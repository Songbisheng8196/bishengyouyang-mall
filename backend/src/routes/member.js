/**
 * 会员路由
 * 毕生优养商城后端 API
 */

const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const couponController = require('../controllers/couponController');
const { authenticate } = require('../middleware/auth');

// 所有会员接口需要登录
router.use(authenticate);

// GET /api/member/info - 会员信息
router.get('/info', memberController.getMemberInfo);

// GET /api/points/balance - 积分余额
router.get('/points/balance', memberController.getPointsBalance);

// GET /api/points/records - 积分明细
router.get('/points/records', memberController.getPointsRecords);

// GET /api/coupons - 优惠券列表
router.get('/coupons', couponController.getCoupons);

// POST /api/coupons/claim - 领取优惠券
router.post('/coupons/claim', couponController.claimCoupon);

// GET /api/coupons/available - 可用优惠券
router.get('/coupons/available', couponController.getAvailableCoupons);

module.exports = router;