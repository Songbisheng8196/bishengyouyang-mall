/**
 * 养生打卡路由
 * 毕生优养商城后端 API
 */

const express = require('express');
const router = express.Router();
const checkinController = require('../controllers/checkinController');
const { validate } = require('../middleware/validator');
const { authenticate } = require('../middleware/auth');

// 所有打卡接口需要登录
router.use(authenticate);

// POST /api/checkin - 提交打卡记录
router.post('/', checkinController.checkinValidation, validate, checkinController.submitCheckin);

// GET /api/checkin/records - 打卡记录列表
router.get('/records', checkinController.getCheckinRecords);

// GET /api/checkin/summary - 月度小结
router.get('/summary', checkinController.getCheckinSummary);

// GET /api/checkin/today - 今日打卡状态
router.get('/today', checkinController.getTodayStatus);

module.exports = router;