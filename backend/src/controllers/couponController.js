/**
 * 优惠券控制器
 * 毕生优养商城后端 API
 */

const { Coupon, Product } = require('../../database/init');
const { success, paginate } = require('../utils/response');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * 获取优惠券列表
 * GET /api/coupons
 */
const getCoupons = asyncHandler(async (req, res) => {
  const { page = 1, pageSize = 20, status } = req.query;
  const userId = req.user.id;

  const where = { user_id: userId };
  
  // 状态筛选
  if (status !== undefined) {
    where.status = parseInt(status);
  }

  const { count, rows } = await Coupon.findAndCountAll({
    where,
    order: [['created_at', 'DESC']],
    limit: parseInt(pageSize),
    offset: (parseInt(page) - 1) * parseInt(pageSize)
  });

  const now = new Date();
  const coupons = rows.map(coupon => {
    let statusText = '未使用';
    let canUse = false;

    if (coupon.status === 2) {
      statusText = '已使用';
    } else if (coupon.status === 3 || new Date(coupon.end_time) < now) {
      statusText = '已过期';
    } else if (new Date(coupon.start_time) > now) {
      statusText = '未开始';
    } else {
      statusText = '待使用';
      canUse = true;
    }

    return {
      id: coupon.id,
      name: coupon.name,
      type: coupon.type,
      type_text: coupon.type === 1 ? '满减券' : '折扣券',
      value: coupon.type === 1 ? `满${coupon.min_amount}减${coupon.value}` : `${coupon.value}折`,
      min_amount: coupon.min_amount,
      start_time: coupon.start_time,
      end_time: coupon.end_time,
      status: coupon.status,
      status_text: statusText,
      can_use: canUse
    };
  });

  res.json(paginate(coupons, count, page, pageSize));
});

/**
 * 领取优惠券
 * POST /api/coupons/claim
 */
const claimCoupon = asyncHandler(async (req, res) => {
  const { coupon_template_id } = req.body;

  // Phase1 占位实现
  // 实际需要从优惠券模板表领取

  res.status(201).json(success({
    id: Date.now(),
    name: '新人专享优惠券',
    type: 1,
    value: 20,
    min_amount: 100,
    start_time: new Date(),
    end_time: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  }, '领取成功'));
});

/**
 * 获取可用优惠券（用于下单时选择）
 * GET /api/coupons/available
 */
const getAvailableCoupons = asyncHandler(async (req, res) => {
  const { order_amount } = req.query;
  const userId = req.user.id;
  const amount = parseFloat(order_amount) || 0;

  const now = new Date();

  const coupons = await Coupon.findAll({
    where: {
      user_id: userId,
      status: 1,
      start_time: { $lte: now },
      end_time: { $gte: now }
    }
  });

  // 筛选出满足条件的优惠券
  const availableCoupons = coupons.filter(coupon => {
    return amount >= coupon.min_amount;
  });

  res.json(success(availableCoupons.map(coupon => ({
    id: coupon.id,
    name: coupon.name,
    type: coupon.type,
    type_text: coupon.type === 1 ? '满减券' : '折扣券',
    value: coupon.type === 1 ? `减${coupon.value}元` : `${coupon.value}折`,
    min_amount: coupon.min_amount,
    end_time: coupon.end_time,
    discount_amount: coupon.type === 1 ? parseFloat(coupon.value) : amount * (1 - parseFloat(coupon.value) / 100)
  }))));
});

module.exports = {
  getCoupons,
  claimCoupon,
  getAvailableCoupons
};