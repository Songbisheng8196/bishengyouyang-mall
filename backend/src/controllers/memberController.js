/**
 * 会员控制器
 * 毕生优养商城后端 API
 */

const { Member, User, PointsRecord } = require('../../database/init');
const { success, paginate } = require('../utils/response');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * 获取会员信息
 * GET /api/member/info
 */
const getMemberInfo = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await User.findByPk(userId);
  const member = await Member.findOne({ where: { user_id: userId } });

  // 计算会员等级权益
  const levelBenefits = {
    0: {
      name: '普通会员',
      discount: '无折扣',
      benefits: ['基础购物权益', '参与打卡活动', '观看免费课程']
    },
    1: {
      name: '银卡会员',
      discount: '9.5折',
      benefits: ['银卡专属折扣', '免费观看银卡课程', '优先客服', '专属活动']
    },
    2: {
      name: '金卡会员',
      discount: '9折',
      benefits: ['金卡专属折扣', '免费观看全部课程', '专属客服', '优先发货', '生日礼包']
    }
  };

  // Phase1 占位数据（如果数据库没有）
  if (!member) {
    return res.json(success({
      level: user?.member_level || 0,
      level_name: levelBenefits[user?.member_level || 0].name,
      discount: levelBenefits[user?.member_level || 0].discount,
      benefits: levelBenefits[user?.member_level || 0].benefits,
      total_points: user?.points || 0,
      available_points: user?.points || 0,
      used_points: 0,
      growth_value: 0,
      next_level_points: 1000,
      compliance_notice: '⚠️ 本页内容仅作日常参考，身体不适请及时就医。'
    }));
  }

  // 计算距离下一级需要的成长值
  const nextLevelThreshold = (member.level + 1) * 1000;
  const growthNeeded = Math.max(0, nextLevelThreshold - member.growth_value);

  res.json(success({
    level: member.level,
    level_name: levelBenefits[member.level].name,
    discount: levelBenefits[member.level].discount,
    benefits: levelBenefits[member.level].benefits,
    total_points: member.total_points,
    available_points: user.points,
    used_points: member.used_points,
    growth_value: member.growth_value,
    next_level_points: growthNeeded,
    vip_expire_time: member.vip_expire_time,
    compliance_notice: '⚠️ 本页内容仅作日常参考，身体不适请及时就医。'
  }));
});

/**
 * 获取积分余额
 * GET /api/points/balance
 */
const getPointsBalance = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await User.findByPk(userId);
  const member = await Member.findOne({ where: { user_id: userId } });

  // 获取本月获得/消费的积分
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthlyRecords = await PointsRecord.findAll({
    where: {
      user_id: userId,
      created_at: { $gte: monthStart }
    }
  });

  let monthlyEarned = 0;
  let monthlyUsed = 0;

  monthlyRecords.forEach(record => {
    if (record.type === 1) {
      monthlyEarned += record.points;
    } else {
      monthlyUsed += record.points;
    }
  });

  res.json(success({
    total_points: user.points,
    available_points: user.points,
    monthly_earned: monthlyEarned,
    monthly_used: monthlyUsed,
    total_earned: member?.total_points || 0,
    total_used: member?.used_points || 0
  }));
});

/**
 * 获取积分明细
 * GET /api/points/records
 */
const getPointsRecords = asyncHandler(async (req, res) => {
  const { page = 1, pageSize = 20, type } = req.query;
  const userId = req.user.id;

  const where = { user_id: userId };
  if (type) {
    where.type = type;
  }

  const { count, rows } = await PointsRecord.findAndCountAll({
    where,
    order: [['created_at', 'DESC']],
    limit: parseInt(pageSize),
    offset: (parseInt(page) - 1) * parseInt(pageSize)
  });

  const records = rows.map(record => ({
    id: record.id,
    type: record.type,
    type_text: record.type === 1 ? '获得' : '消费',
    points: record.points,
    source: record.source,
    source_text: getSourceText(record.source),
    description: record.description,
    order_id: record.order_id,
    created_at: record.created_at
  }));

  res.json(paginate(records, count, page, pageSize));
});

/**
 * 获取来源文本
 */
function getSourceText(source) {
  const sourceMap = {
    'sign': '每日签到',
    'checkin': '日常打卡',
    'order': '订单消费',
    'share': '分享好友',
    'course': '课程学习',
    'redeem': '积分兑换',
    'register': '注册赠送'
  };
  return sourceMap[source] || source;
}

module.exports = {
  getMemberInfo,
  getPointsBalance,
  getPointsRecords
};