/**
 * 沙龙活动控制器
 * 毕生优养商城后端 API
 */

const { body } = require('express-validator');
const { Salon, SalonReservation, Store } = require('../../database/init');
const { success, paginate } = require('../utils/response');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');
const ErrorCodes = require('../utils/errorCodes');

/**
 * 获取沙龙活动列表
 * GET /api/salons
 */
const getSalons = asyncHandler(async (req, res) => {
  const { page = 1, pageSize = 10, status } = req.query;

  const where = {};
  if (status !== undefined) {
    where.status = parseInt(status);
  } else {
    where.status = { $in: [1, 2] }; // 默认只显示报名中和进行中的活动
  }

  const { count, rows } = await Salon.findAndCountAll({
    where,
    include: [{
      model: Store,
      attributes: ['id', 'name', 'address', 'city']
    }],
    order: [['start_time', 'ASC']],
    limit: parseInt(pageSize),
    offset: (parseInt(page) - 1) * parseInt(pageSize)
  });

  // Phase1 如果没有真实数据，返回占位数据
  if (rows.length === 0) {
    const placeholderSalons = generatePlaceholderSalons(page, pageSize);
    return res.json(paginate(placeholderSalons, 10, page, pageSize));
  }

  const salons = rows.map(salon => ({
    id: salon.id,
    title: salon.title,
    cover_image: salon.cover_image,
    store_id: salon.store_id,
    store_name: salon.Store?.name,
    address: salon.address,
    start_time: salon.start_time,
    end_time: salon.end_time,
    max_count: salon.max_count,
    sign_count: salon.sign_count,
    remaining_count: salon.max_count - salon.sign_count,
    status: salon.status,
    status_text: getSalonStatusText(salon.status)
  }));

  res.json(paginate(salons, count, page, pageSize));
});

/**
 * 获取沙龙活动详情
 * GET /api/salons/:id
 */
const getSalonDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const salon = await Salon.findByPk(id, {
    include: [{
      model: Store,
      attributes: ['id', 'name', 'address', 'phone', 'business_hours']
    }]
  });

  if (!salon) {
    // Phase1 返回占位数据
    return res.json(success({
      id: parseInt(id),
      title: '女性养生沙龙：春季养肝护肝',
      cover_image: '/images/salons/salon-1.jpg',
      store_id: 1,
      store_name: '毕生优养·武汉光谷店',
      address: '武汉市洪山区光谷世界城步行街F1层',
      start_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
      max_count: 30,
      sign_count: 15,
      remaining_count: 15,
      content: `<h2>活动简介</h2>
<p>本次沙龙邀请中医养生专家，为大家讲解春季养肝护肝的知识，并现场分享实用的养生方法。</p>
<h2>活动流程</h2>
<ol>
<li>14:00-14:30 签到入场</li>
<li>14:30-15:30 专家讲座</li>
<li>15:30-16:00 产品体验</li>
<li>16:00-16:30 互动交流</li>
</ol>
<h2>报名须知</h2>
<p>1. 本活动仅限武汉地区用户参加</p>
<p>2. 名额有限，先到先得</p>
<p>3. 报名后请准时参加</p>`,
      organizer: '毕生优养',
      phone: '027-88888888',
      status: 1,
      status_text: '报名中',
      compliance_notice: '⚠️ 本页内容仅作日常参考，非医疗诊断，身体不适请及时就医。'
    }));
  }

  res.json(success({
    id: salon.id,
    title: salon.title,
    cover_image: salon.cover_image,
    store_id: salon.store_id,
    store_name: salon.Store?.name,
    address: salon.address,
    start_time: salon.start_time,
    end_time: salon.end_time,
    max_count: salon.max_count,
    sign_count: salon.sign_count,
    remaining_count: salon.max_count - salon.sign_count,
    content: salon.content,
    organizer: salon.organizer,
    phone: salon.phone,
    status: salon.status,
    status_text: getSalonStatusText(salon.status),
    compliance_notice: '⚠️ 本页内容仅作日常参考，非医疗诊断，身体不适请及时就医。'
  }));
});

/**
 * 提交沙龙预约
 * POST /api/salons/reserve
 */
const reserveSalon = asyncHandler(async (req, res) => {
  const { salon_id, name, phone, remark } = req.body;
  const userId = req.user.id;

  if (!salon_id || !name || !phone) {
    throw new ApiError(ErrorCodes.BAD_REQUEST);
  }

  const salon = await Salon.findByPk(salon_id);
  if (!salon) {
    throw new ApiError(ErrorCodes.SALON_NOT_FOUND);
  }

  if (salon.status !== 1) {
    throw new ApiError(error(400, '该活动已结束或不在报名中'));
  }

  if (salon.sign_count >= salon.max_count) {
    throw new ApiError(ErrorCodes.SALON_FULL);
  }

  // 检查是否已预约
  const existingReservation = await SalonReservation.findOne({
    where: { salon_id, user_id: userId, status: 1 }
  });

  if (existingReservation) {
    return res.json(success({
      id: existingReservation.id,
      salon_id,
      name: existingReservation.name,
      phone: existingReservation.phone,
      status: existingReservation.status
    }, '您已预约过该活动'));
  }

  // 创建预约
  const reservation = await SalonReservation.create({
    salon_id,
    user_id: userId,
    name,
    phone,
    remark
  });

  // 更新沙龙报名人数
  await Salon.increment('sign_count', { by: 1, where: { id: salon_id } });

  res.status(201).json(success({
    id: reservation.id,
    salon_id,
    salon_title: salon.title,
    name,
    phone,
    status: 1
  }, '预约成功'));
});

/**
 * 获取我的沙龙预约
 * GET /api/salons/my-reservations
 */
const getMyReservations = asyncHandler(async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const userId = req.user.id;

  const { count, rows } = await SalonReservation.findAndCountAll({
    where: { user_id: userId, status: 1 },
    include: [{
      model: Salon,
      attributes: ['id', 'title', 'cover_image', 'start_time', 'end_time', 'address', 'status']
    }],
    order: [['created_at', 'DESC']],
    limit: parseInt(pageSize),
    offset: (parseInt(page) - 1) * parseInt(pageSize)
  });

  const reservations = rows.map(r => ({
    id: r.id,
    salon_id: r.salon_id,
    salon_title: r.Salon?.title,
    salon_cover: r.Salon?.cover_image,
    start_time: r.Salon?.start_time,
    end_time: r.Salon?.end_time,
    address: r.Salon?.address,
    salon_status: r.Salon?.status,
    name: r.name,
    phone: r.phone,
    status: r.status
  }));

  res.json(paginate(reservations, count, page, pageSize));
});

/**
 * 取消沙龙预约
 * DELETE /api/salons/reserve/:id
 */
const cancelReservation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const reservation = await SalonReservation.findOne({
    where: { id, user_id: userId, status: 1 }
  });

  if (!reservation) {
    throw new ApiError(error(404, '预约记录不存在'));
  }

  reservation.status = 2; // 已取消
  await reservation.save();

  // 减少沙龙报名人数
  await Salon.decrement('sign_count', { by: 1, where: { id: reservation.salon_id } });

  res.json(success(null, '已取消预约'));
});

/**
 * 获取沙龙状态文本
 */
function getSalonStatusText(status) {
  const statusMap = {
    1: '报名中',
    2: '进行中',
    3: '已结束'
  };
  return statusMap[status] || '未知';
}

/**
 * 生成占位沙龙数据
 */
function generatePlaceholderSalons(page, pageSize) {
  const salons = [];
  const startIndex = (page - 1) * pageSize;

  const titles = [
    '女性养生沙龙：春季养肝护肝',
    '周末养生课堂：花茶品鉴会',
    '体质调理讲座：个性化食补方案',
    '中医养生分享：日常穴位保健'
  ];

  for (let i = 0; i < Math.min(pageSize, 4); i++) {
    const index = startIndex + i;
    if (index >= 4) break;

    salons.push({
      id: index + 1,
      title: titles[index],
      cover_image: `/images/salons/salon-${index + 1}.jpg`,
      store_id: (index % 3) + 1,
      store_name: `毕生优养·武汉${['光谷', '武广', '徐东'][index % 3]}店`,
      address: '武汉市',
      start_time: new Date(Date.now() + (7 + index * 3) * 24 * 60 * 60 * 1000).toISOString(),
      end_time: new Date(Date.now() + (7 + index * 3) * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
      max_count: 30,
      sign_count: Math.floor(Math.random() * 20) + 5,
      remaining_count: 0,
      status: 1,
      status_text: '报名中'
    });
  }

  // 计算剩余人数
  salons.forEach(s => {
    s.remaining_count = s.max_count - s.sign_count;
  });

  return salons;
}

// 验证规则
const reserveValidation = [
  body('salon_id').notEmpty().withMessage('请选择活动').isInt().withMessage('活动ID格式错误'),
  body('name').notEmpty().withMessage('请填写姓名').isLength({ max: 50 }).withMessage('姓名不能超过50字'),
  body('phone').notEmpty().withMessage('请填写手机号').isMobilePhone('zh-CN').withMessage('手机号格式不正确'),
  body('remark').optional().isLength({ max: 200 }).withMessage('备注不能超过200字')
];

module.exports = {
  getSalons,
  getSalonDetail,
  reserveSalon,
  getMyReservations,
  cancelReservation,
  reserveValidation
};