/**
 * 认证控制器
 * 毕生优养商城后端 API
 */

const { body } = require('express-validator');
const { User, Member, PointsRecord } = require('../../database/init');
const { success, error } = require('../utils/response');
const ErrorCodes = require('../utils/errorCodes');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');
const { generateToken } = require('../middleware/auth');

/**
 * 微信授权登录
 * POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { code, encryptedData, iv } = req.body;

  // Phase1 占位实现：使用模拟数据
  // 实际项目中需要调用微信接口获取 openid
  let openid = `mock_openid_${Date.now()}`;
  
  // 如果有code，生成对应的mock openid（用于测试）
  if (code) {
    openid = `mock_openid_${code}`;
  }

  // 查询或创建用户
  let user = await User.findOne({ where: { openid } });
  
  if (!user) {
    // 创建新用户
    user = await User.create({
      openid,
      nickname: '新用户',
      avatar: '',
      member_level: 0,
      points: 0
    });

    // 创建会员记录
    await Member.create({
      user_id: user.id,
      level: 0,
      total_points: 0,
      used_points: 0
    });

    // 新用户注册赠送积分
    await PointsRecord.create({
      user_id: user.id,
      type: 1,
      points: 100,
      source: 'register',
      description: '新用户注册赠送'
    });

    // 更新用户积分
    user.points = 100;
    await user.save();
  }

  // 生成 token
  const token = generateToken(user.id);

  res.json(success({
    token,
    user: {
      id: user.id,
      nickname: user.nickname,
      avatar: user.avatar,
      member_level: user.member_level,
      points: user.points
    }
  }, '登录成功'));
});

/**
 * 获取用户信息
 * GET /api/auth/userinfo
 */
const getUserInfo = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ['openid', 'unionid'] }
  });

  if (!user) {
    throw new ApiError(ErrorCodes.USER_NOT_FOUND);
  }

  // 获取会员信息
  const member = await Member.findOne({ where: { user_id: user.id } });

  res.json(success({
    id: user.id,
    nickname: user.nickname,
    avatar: user.avatar,
    gender: user.gender,
    phone: user.phone,
    member_level: user.member_level,
    points: user.points,
    total_consumption: user.total_consumption,
    member: member ? {
      level: member.level,
      total_points: member.total_points,
      used_points: member.used_points,
      vip_expire_time: member.vip_expire_time,
      growth_value: member.growth_value
    } : null
  }));
});

/**
 * 更新用户信息
 * PUT /api/auth/userinfo
 */
const updateUserInfo = asyncHandler(async (req, res) => {
  const { nickname, avatar, gender, phone } = req.body;
  
  const user = await User.findByPk(req.user.id);
  
  if (!user) {
    throw new ApiError(ErrorCodes.USER_NOT_FOUND);
  }

  // 更新字段
  if (nickname !== undefined) user.nickname = nickname;
  if (avatar !== undefined) user.avatar = avatar;
  if (gender !== undefined) user.gender = gender;
  if (phone !== undefined) user.phone = phone;

  await user.save();

  res.json(success({
    id: user.id,
    nickname: user.nickname,
    avatar: user.avatar,
    gender: user.gender,
    phone: user.phone
  }, '更新成功'));
});

// 登录验证规则
const loginValidation = [
  body('code').optional().isString().withMessage('授权码格式错误')
];

// 更新用户信息验证规则
const updateUserInfoValidation = [
  body('nickname').optional().isString().isLength({ max: 50 }).withMessage('昵称不能超过50个字符'),
  body('avatar').optional().isURL().withMessage('头像URL格式错误'),
  body('gender').optional().isIn([0, 1, 2]).withMessage('性别值无效'),
  body('phone').optional().isMobilePhone('zh-CN').withMessage('手机号格式不正确')
];

module.exports = {
  login,
  getUserInfo,
  updateUserInfo,
  loginValidation,
  updateUserInfoValidation
};