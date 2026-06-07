/**
 * 订单控制器
 * 毕生优养商城后端 API
 */

const { body } = require('express-validator');
const { Order, OrderItem, CartItem, Product, User, Address, PointsRecord, Coupon } = require('../../database/init');
const { success, paginate, error } = require('../utils/response');
const ErrorCodes = require('../utils/errorCodes');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const https = require('https');

// 微信支付配置
const WECHAT_CONFIG = {
  appid: process.env.WECHAT_APPID,
  mch_id: process.env.WECHAT_MCH_ID,
  api_key: process.env.WECHAT_API_KEY,
  notify_url: process.env.WECHAT_NOTIFY_URL || 'http://localhost:3000/api/orders/wxpay-notify'
};

/**
 * 创建订单
 * POST /api/orders
 */
const createOrder = asyncHandler(async (req, res) => {
  const { 
    address_id,
    cart_item_ids,
    coupon_id,
    use_points = 0,
    remark = ''
  } = req.body;

  // 获取收货地址
  let address;
  if (address_id) {
    address = await Address.findOne({
      where: { id: address_id, user_id: req.user.id }
    });
    if (!address) {
      throw new ApiError(error(404, '收货地址不存在'));
    }
  }

  // 获取购物车商品
  let orderItems = [];
  let totalAmount = 0;

  if (cart_item_ids && cart_item_ids.length > 0) {
    const cartItems = await CartItem.findAll({
      where: {
        id: cart_item_ids,
        user_id: req.user.id,
        selected: true
      },
      include: [{ model: Product }]
    });

    if (cartItems.length === 0) {
      throw new ApiError(ErrorCodes.CART_EMPTY);
    }

    for (const item of cartItems) {
      if (!item.Product || item.Product.status !== 1) {
        throw new ApiError(error(400, `商品"${item.Product?.name || '未知'}"已下架`));
      }
      if (item.quantity > item.Product.stock) {
        throw new ApiError(ErrorCodes.PRODUCT_STOCK_NOT_ENOUGH);
      }

      const subtotal = parseFloat(item.Product.price) * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        product_id: item.product_id,
        product_name: item.Product.name,
        cover_image: item.Product.cover_image,
        price: item.Product.price,
        quantity: item.quantity,
        specifications: item.specifications,
        subtotal
      });
    }
  } else {
    throw new ApiError(ErrorCodes.CART_EMPTY);
  }

  // 计算优惠
  let discountAmount = 0;
  let pointsDiscount = 0;
  let couponDiscount = 0;

  // 积分抵扣（100积分=1元）
  if (use_points > 0) {
    const user = await User.findByPk(req.user.id);
    if (use_points > user.points) {
      throw new ApiError(ErrorCodes.POINTS_NOT_ENOUGH);
    }
    pointsDiscount = Math.min(use_points / 100, totalAmount * 0.1); // 最多抵扣10%
  }

  // 优惠券
  if (coupon_id) {
    const coupon = await Coupon.findOne({
      where: { id: coupon_id, user_id: req.user.id, status: 1 }
    });
    if (coupon) {
      const now = new Date();
      if (new Date(coupon.start_time) <= now && new Date(coupon.end_time) >= now) {
        if (totalAmount >= coupon.min_amount) {
          if (coupon.type === 1) {
            couponDiscount = parseFloat(coupon.value);
          } else if (coupon.type === 2) {
            couponDiscount = totalAmount * (1 - parseFloat(coupon.value) / 100);
          }
        }
      }
    }
  }

  discountAmount = pointsDiscount + couponDiscount;
  const payAmount = Math.max(0, totalAmount - discountAmount);
  const pointsEarned = Math.floor(payAmount); // 每消费1元获得1积分

  // 生成订单号
  const orderNo = `BS${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

  // 创建订单
  const order = await Order.create({
    order_no: orderNo,
    user_id: req.user.id,
    total_amount: totalAmount,
    discount_amount: discountAmount,
    points_discount: pointsDiscount,
    coupon_id: coupon_id || null,
    coupon_discount: couponDiscount,
    pay_amount: payAmount,
    points_earned: pointsEarned,
    address_id: address_id,
    consignee: address?.consignee,
    phone: address?.phone,
    province: address?.province,
    city: address?.city,
    district: address?.district,
    detail: address?.detail,
    remark
  });

  // 创建订单商品记录
  for (const item of orderItems) {
    await OrderItem.create({
      order_id: order.id,
      ...item
    });
  }

  // 扣减库存
  for (const item of orderItems) {
    await Product.decrement('stock', { by: item.quantity, where: { id: item.product_id } });
    await Product.increment('sales_count', { by: item.quantity, where: { id: item.product_id } });
  }

  // 删除已下单的购物车商品
  await CartItem.destroy({ where: { id: cart_item_ids } });

  // 使用优惠券
  if (coupon_id) {
    await Coupon.update({
      status: 2,
      used_time: new Date(),
      order_id: order.id
    }, { where: { id: coupon_id } });
  }

  res.status(201).json(success({
    order_id: order.id,
    order_no: orderNo,
    pay_amount: payAmount,
    points_earned: pointsEarned
  }, '订单创建成功'));
});

/**
 * 获取订单列表
 * GET /api/orders
 */
const getOrders = asyncHandler(async (req, res) => {
  const { page = 1, pageSize = 10, status } = req.query;

  const where = { 
    user_id: req.user.id,
    status: { $ne: 2 } // 排除已删除
  };

  // 状态筛选
  if (status !== undefined) {
    const statusNum = parseInt(status);
    if (statusNum === 0) {
      // 待付款
      where.pay_status = 0;
    } else if (statusNum === 1) {
      // 已付款待发货
      where.pay_status = 1;
      where.shipping_status = 0;
    } else if (statusNum === 2) {
      // 已发货待收货
      where.shipping_status = 1;
    } else if (statusNum === 3) {
      // 已收货/已完成
      where.shipping_status = { $gte: 2 };
    }
  }

  const { count, rows } = await Order.findAndCountAll({
    where,
    include: [{
      model: OrderItem,
      attributes: ['id', 'product_id', 'product_name', 'cover_image', 'price', 'quantity', 'subtotal']
    }],
    order: [['created_at', 'DESC']],
    limit: parseInt(pageSize),
    offset: (parseInt(page) - 1) * parseInt(pageSize)
  });

  const orders = rows.map(order => ({
    id: order.id,
    order_no: order.order_no,
    total_amount: order.total_amount,
    discount_amount: order.discount_amount,
    pay_amount: order.pay_amount,
    pay_status: order.pay_status,
    shipping_status: order.shipping_status,
    items: order.OrderItems,
    created_at: order.created_at
  }));

  res.json(paginate(orders, count, page, pageSize));
});

/**
 * 获取订单详情
 * GET /api/orders/:id
 */
const getOrderDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findOne({
    where: { id, user_id: req.user.id },
    include: [{
      model: OrderItem
    }]
  });

  if (!order) {
    throw new ApiError(ErrorCodes.ORDER_NOT_FOUND);
  }

  res.json(success({
    id: order.id,
    order_no: order.order_no,
    total_amount: order.total_amount,
    discount_amount: order.discount_amount,
    points_discount: order.points_discount,
    coupon_discount: order.coupon_discount,
    pay_amount: order.pay_amount,
    points_earned: order.points_earned,
    pay_status: order.pay_status,
    pay_time: order.pay_time,
    shipping_status: order.shipping_status,
    shipping_time: order.shipping_time,
    receive_time: order.receive_time,
    express_company: order.express_company,
    express_no: order.express_no,
    consignee: order.consignee,
    phone: order.phone,
    province: order.province,
    city: order.city,
    district: order.district,
    detail: order.detail,
    remark: order.remark,
    items: order.OrderItems,
    created_at: order.created_at
  }));
});

/**
 * 取消订单
 * PUT /api/orders/:id/cancel
 */
const cancelOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason = '' } = req.body;

  const order = await Order.findOne({
    where: { id, user_id: req.user.id }
  });

  if (!order) {
    throw new ApiError(ErrorCodes.ORDER_NOT_FOUND);
  }

  if (order.pay_status !== 0) {
    throw new ApiError(ErrorCodes.ORDER_CANNOT_CANCEL);
  }

  // 恢复库存
  const orderItems = await OrderItem.findAll({ where: { order_id: order.id } });
  for (const item of orderItems) {
    await Product.increment('stock', { by: item.quantity, where: { id: item.product_id } });
  }

  // 恢复优惠券
  if (order.coupon_id) {
    await Coupon.update({
      status: 1,
      used_time: null,
      order_id: null
    }, { where: { id: order.coupon_id } });
  }

  order.status = 0;
  order.cancel_time = new Date();
  order.cancel_reason = reason;
  await order.save();

  res.json(success(null, '订单已取消'));
});

/**
 * 确认收货
 * PUT /api/orders/:id/confirm
 */
const confirmReceive = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findOne({
    where: { id, user_id: req.user.id }
  });

  if (!order) {
    throw new ApiError(ErrorCodes.ORDER_NOT_FOUND);
  }

  if (order.shipping_status !== 1) {
    throw new ApiError(error(400, '该订单无法确认收货'));
  }

  order.shipping_status = 2;
  order.receive_time = new Date();
  await order.save();

  // 发放积分
  await User.increment('points', { by: order.points_earned, where: { id: req.user.id } });
  await PointsRecord.create({
    user_id: req.user.id,
    type: 1,
    points: order.points_earned,
    source: 'order',
    description: `订单${order.order_no}消费获得`,
    order_id: order.id
  });

  // 更新用户累计消费
  await User.increment('total_consumption', { by: order.pay_amount, where: { id: req.user.id } });

  res.json(success({ points_earned: order.points_earned }, '确认收货成功'));
});

/**
 * 获取物流信息
 * GET /api/logistics/:id
 */
const getLogistics = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findOne({
    where: { id, user_id: req.user.id }
  });

  if (!order) {
    throw new ApiError(ErrorCodes.ORDER_NOT_FOUND);
  }

  if (!order.express_no) {
    return res.json(success({
      express_company: order.express_company,
      express_no: order.express_no,
      steps: []
    }));
  }

  // Phase1 占位数据
  res.json(success({
    express_company: order.express_company || '顺丰速运',
    express_no: order.express_no,
    steps: [
      { time: '2024-01-15 10:30', status: '包裹已签收', description: '签收人是【本人签收】' },
      { time: '2024-01-15 08:20', status: '派送中', description: '快递员正在为您派送' },
      { time: '2024-01-15 06:00', status: '到达【武汉分拨中心】', description: '' },
      { time: '2024-01-14 20:00', status: '已发货', description: '商品已从仓库发出' }
    ]
  }));
});

/**
 * 微信支付统一下单
 * POST /api/orders/:id/pay
 * 接入微信支付 JSAPI，description 字段填写商品详情
 */
const createWxPayOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { openid } = req.body;

  if (!openid) {
    throw new ApiError(error(400, '缺少用户 openid'));
  }

  // 获取订单信息
  const order = await Order.findOne({
    where: { id, user_id: req.user.id }
  });

  if (!order) {
    throw new ApiError(ErrorCodes.ORDER_NOT_FOUND);
  }

  if (order.pay_status !== 0) {
    throw new ApiError(error(400, '该订单已支付'));
  }

  // 获取订单商品详情，用于 description 字段
  const orderItems = await OrderItem.findAll({
    where: { order_id: order.id }
  });

  // 构建商品详情描述（微信支付 description 限制 128 字符）
  let productDesc = orderItems.map(item => item.product_name).join('、');
  if (productDesc.length > 120) {
    productDesc = productDesc.substring(0, 117) + '...';
  }

  // 生成支付订单号（微信支付要求 32 字符以内）
  const wxPayOrderNo = `WX${order.order_no}`;

  // 统一下单参数
  const params = {
    appid: WECHAT_CONFIG.appid,
    mch_id: WECHAT_CONFIG.mch_id,
    nonce_str: uuidv4().replace(/-/g, ''),
    sign_type: 'MD5',
    body: '毕生优养-健康好物', // 商品描述（商户名-商品简称）
    detail: productDesc, // 商品详情（用于微信支付账单显示）
    out_trade_no: wxPayOrderNo,
    total_fee: Math.round(order.pay_amount * 100), // 金额单位：分
    spbill_create_ip: req.ip || req.connection.remoteAddress || '127.0.0.1',
    notify_url: WECHAT_CONFIG.notify_url,
    trade_type: 'JSAPI',
    openid: openid
  };

  // 签名
  params.sign = signParams(params);

  // 调用微信支付统一下单接口
  const xmlData = buildXml(params);

  try {
    const wxResponse = await requestWxPayApi(xmlData);

    if (wxResponse.return_code === 'SUCCESS' && wxResponse.result_code === 'SUCCESS') {
      // 预支付订单调用参数
      const prepay_id = wxResponse.prepay_id;

      // 更新订单微信支付订单号
      order.wx_pay_order_no = wxPayOrderNo;
      await order.save();

      // 返回唤起支付所需参数
      const paySign = signParams({
        appId: WECHAT_CONFIG.appid,
        timeStamp: Math.floor(Date.now() / 1000).toString(),
        nonceStr: params.nonce_str,
        package: `prepay_id=${prepay_id}`,
        signType: 'MD5'
      });

      res.json(success({
        prepay_id,
        paySign,
        timeStamp: Math.floor(Date.now() / 1000).toString(),
        nonceStr: params.nonce_str,
        wx_pay_order_no: wxPayOrderNo
      }, '预支付订单创建成功'));
    } else {
      console.error('微信支付统一下单失败:', wxResponse);
      throw new ApiError(error(500, wxResponse.return_msg || '微信支付下单失败'));
    }
  } catch (err) {
    console.error('微信支付请求失败:', err);
    throw new ApiError(error(500, '微信支付服务暂时不可用'));
  }
});

/**
 * 微信支付回调
 * POST /api/orders/wxpay-notify
 */
const wxPayNotify = asyncHandler(async (req, res) => {
  const xmlData = req.body;

  if (!xmlData || xmlData.return_code !== 'SUCCESS') {
    return res.send('<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[签名失败]]></return_msg></xml>');
  }

  // 验证签名
  const sign = signParams(xmlData);
  if (sign !== xmlData.sign) {
    console.error('微信支付回调签名验证失败');
    return res.send('<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[签名失败]]></return_msg></xml>');
  }

  const { out_trade_no, transaction_id, total_fee } = xmlData;

  // 更新订单状态
  const order = await Order.findOne({
    where: { wx_pay_order_no: out_trade_no }
  });

  if (order) {
    order.pay_status = 1;
    order.pay_time = new Date();
    order.wx_transaction_id = transaction_id;
    await order.save();

    // 发放积分
    await User.increment('points', { by: order.points_earned, where: { id: order.user_id } });
    await PointsRecord.create({
      user_id: order.user_id,
      type: 1,
      points: order.points_earned,
      source: 'order',
      description: `订单${order.order_no}消费获得`,
      order_id: order.id
    });

    // 更新用户累计消费
    await User.increment('total_consumption', { by: order.pay_amount, where: { id: order.user_id } });
  }

  res.send('<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>');
});

/**
 * 微信支付订单查询
 * GET /api/orders/:id/pay-status
 */
const getPayStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findOne({
    where: { id, user_id: req.user.id }
  });

  if (!order) {
    throw new ApiError(ErrorCodes.ORDER_NOT_FOUND);
  }

  res.json(success({
    pay_status: order.pay_status,
    pay_time: order.pay_time,
    wx_transaction_id: order.wx_transaction_id
  }));
});

// ============ 微信支付辅助函数 ============

/**
 * 签名参数
 */
function signParams(params) {
  const sortedKeys = Object.keys(params).filter(key => key !== 'sign' && params[key] !== undefined && params[key] !== '').sort();
  const signStr = sortedKeys.map(key => `${key}=${params[key]}`).join('&');
  const signString = signStr + `&key=${WECHAT_CONFIG.api_key}`;
  return crypto.createHash('md5').update(signString, 'utf8').digest('hex').toUpperCase();
}

/**
 * 构建 XML
 */
function buildXml(params) {
  let xml = '<xml>';
  for (const key in params) {
    xml += `<${key}><![CDATA[${params[key]}]]></${key}>`;
  }
  xml += '</xml>';
  return xml;
}

/**
 * 请求微信支付 API
 */
function requestWxPayApi(xmlData) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.mch.weixin.qq.com',
      port: 443,
      path: '/pay/unifiedorder',
      method: 'POST'
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        // 解析 XML 响应
        const result = parseXml(data);
        resolve(result);
      });
    });

    req.on('error', reject);
    req.write(xmlData);
    req.end();
  });
}

/**
 * 解析 XML
 */
function parseXml(xmlString) {
  const result = {};
  const regex = /<(\w+)><!\[CDATA\[([^\]]*)\]\]><\/\1>/g;
  let match;
  while ((match = regex.exec(xmlString)) !== null) {
    result[match[1]] = match[2];
  }
  return result;
}

// 验证规则
const createOrderValidation = [
  body('address_id').notEmpty().withMessage('请选择收货地址').isInt().withMessage('地址ID格式错误'),
  body('cart_item_ids').isArray({ min: 1 }).withMessage('请选择要结算的商品')
];

module.exports = {
  createOrder,
  getOrders,
  getOrderDetail,
  cancelOrder,
  confirmReceive,
  getLogistics,
  createOrderValidation,
  createWxPayOrder,
  wxPayNotify,
  getPayStatus
};