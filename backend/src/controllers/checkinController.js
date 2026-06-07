/**
 * 养生打卡控制器
 * 毕生优养商城后端 API
 */

const { body } = require('express-validator');
const { CheckinRecord, User, PointsRecord } = require('../../database/init');
const { success, paginate } = require('../utils/response');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');
const ErrorCodes = require('../utils/errorCodes');

// 打卡类型映射
const checkinTypes = {
  1: { name: '产品食用', icon: '🍵', points: 3 },
  2: { name: '饮水记录', icon: '💧', points: 2 },
  3: { name: '作息记录', icon: '😴', points: 2 }
};

/**
 * 提交打卡记录
 * POST /api/checkin
 */
const submitCheckin = asyncHandler(async (req, res) => {
  const { type, content, images } = req.body;
  const userId = req.user.id;

  if (!type || !checkinTypes[type]) {
    throw new ApiError(ErrorCodes.BAD_REQUEST);
  }

  const today = new Date().toISOString().split('T')[0];

  // 检查今日是否已打卡（同一类型）
  const existingRecord = await CheckinRecord.findOne({
    where: {
      user_id: userId,
      type,
      checkin_date: today
    }
  });

  if (existingRecord) {
    throw new ApiError(ErrorCodes.CHECKIN_ALREADY_EXISTS);
  }

  // 获取打卡积分
  const points = checkinTypes[type].points;

  // 创建打卡记录
  const record = await CheckinRecord.create({
    user_id: userId,
    type,
    content,
    images: images || [],
    points,
    checkin_date: today
  });

  // 增加用户积分
  await User.increment('points', { by: points, where: { id: userId } });

  // 记录积分明细
  await PointsRecord.create({
    user_id: userId,
    type: 1,
    points,
    source: 'checkin',
    description: `${checkinTypes[type].name}打卡获得`
  });

  // 获取用户当前积分
  const user = await User.findByPk(userId);

  res.status(201).json(success({
    id: record.id,
    type,
    type_name: checkinTypes[type].name,
    points_earned: points,
    total_points: user.points,
    checkin_date: today
  }, '打卡成功'));
});

/**
 * 获取打卡记录
 * GET /api/checkin/records
 */
const getCheckinRecords = asyncHandler(async (req, res) => {
  const { page = 1, pageSize = 20, type, start_date, end_date } = req.query;
  const userId = req.user.id;

  const where = { user_id: userId };

  if (type) {
    where.type = parseInt(type);
  }

  if (start_date) {
    where.checkin_date = { $gte: start_date };
  }

  if (end_date) {
    where.checkin_date = { ...where.checkin_date, $lte: end_date };
  }

  const { count, rows } = await CheckinRecord.findAndCountAll({
    where,
    order: [['checkin_date', 'DESC'], ['created_at', 'DESC']],
    limit: parseInt(pageSize),
    offset: (parseInt(page) - 1) * parseInt(pageSize)
  });

  const records = rows.map(record => ({
    id: record.id,
    type: record.type,
    type_name: checkinTypes[record.type]?.name || '未知',
    type_icon: checkinTypes[record.type]?.icon || '📝',
    content: record.content,
    images: record.images,
    points: record.points,
    checkin_date: record.checkin_date,
    created_at: record.created_at
  }));

  res.json(paginate(records, count, page, pageSize));
});

/**
 * 获取月度小结
 * GET /api/checkin/summary
 */
const getCheckinSummary = asyncHandler(async (req, res) => {
  const { month } = req.query; // 格式: 2024-01
  const userId = req.user.id;

  // 默认当月
  const targetMonth = month || new Date().toISOString().substring(0, 7);
  const [year, monthNum] = targetMonth.split('-').map(Number);

  // 计算月份起始和结束日期
  const startDate = new Date(year, monthNum - 1, 1);
  const endDate = new Date(year, monthNum, 0);

  // 获取该月所有打卡记录
  const records = await CheckinRecord.findAll({
    where: {
      user_id: userId,
      checkin_date: {
        $gte: startDate.toISOString().split('T')[0],
        $lte: endDate.toISOString().split('T')[0]
      }
    },
    order: [['checkin_date', 'ASC']]
  });

  // 统计各类型打卡次数
  const typeStats = {
    1: { name: '产品食用', count: 0, points: 0 },
    2: { name: '饮水记录', count: 0, points: 0 },
    3: { name: '作息记录', count: 0, points: 0 }
  };

  let totalDays = 0;
  let totalPoints = 0;
  const checkinDays = new Set();

  records.forEach(record => {
    typeStats[record.type].count++;
    typeStats[record.type].points += record.points;
    totalPoints += record.points;
    checkinDays.add(record.checkin_date);
  });

  totalDays = checkinDays.size;

  // 计算连续打卡天数
  const sortedDates = Array.from(checkinDays).sort();
  let consecutiveDays = 0;
  let maxConsecutiveDays = 0;
  let currentStreak = 0;

  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      currentStreak = 1;
    } else {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);
      const diffDays = Math.floor((curr - prev) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreak++;
      } else {
        maxConsecutiveDays = Math.max(maxConsecutiveDays, currentStreak);
        currentStreak = 1;
      }
    }
  }
  maxConsecutiveDays = Math.max(maxConsecutiveDays, currentStreak);
  consecutiveDays = currentStreak;

  // 计算本月总天数
  const totalDaysInMonth = endDate.getDate();
  const checkinRate = ((totalDays / totalDaysInMonth) * 100).toFixed(1);

  res.json(success({
    month: targetMonth,
    total_days: totalDays,
    total_points: totalPoints,
    checkin_rate: checkinRate,
    consecutive_days: consecutiveDays,
    max_consecutive_days: maxConsecutiveDays,
    type_stats: Object.values(typeStats),
    checkin_dates: Array.from(checkinDays),
    encouragement: totalDays >= 20 
      ? '太棒了！您保持了良好的打卡习惯，继续坚持！'
      : totalDays >= 10
      ? '不错哦！继续保持，争取每天都打卡！'
      : '坚持就是胜利，每天打卡让健康成为习惯！',
    compliance_notice: '⚠️ 本页内容仅作日常参考，身体不适请及时就医。'
  }));
});

/**
 * 获取今日打卡状态
 * GET /api/checkin/today
 */
const getTodayStatus = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().split('T')[0];

  const todayRecords = await CheckinRecord.findAll({
    where: {
      user_id: userId,
      checkin_date: today
    }
  });

  const status = {
    date: today,
    checked_in: todayRecords.length > 0,
    types: todayRecords.map(r => ({
      type: r.type,
      type_name: checkinTypes[r.type]?.name,
      type_icon: checkinTypes[r.type]?.icon,
      points: r.points
    })),
    all_types_completed: Object.keys(checkinTypes).every(type => 
      todayRecords.some(r => r.type === parseInt(type))
    )
  };

  res.json(success(status));
});

// 验证规则
const checkinValidation = [
  body('type').isIn([1, 2, 3]).withMessage('打卡类型无效'),
  body('content').optional().isString().isLength({ max: 500 }).withMessage('内容不能超过500字'),
  body('images').optional().isArray().withMessage('图片格式错误')
];

module.exports = {
  submitCheckin,
  getCheckinRecords,
  getCheckinSummary,
  getTodayStatus,
  checkinValidation
};