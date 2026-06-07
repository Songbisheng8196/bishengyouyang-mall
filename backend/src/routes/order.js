/**
 * 订单路由
 * 毕生优养商城后端 API
 */

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { validate } = require('../middleware/validator');
const { authenticate } = require('../middleware/auth');

// 所有订单接口需要登录
router.use(authenticate);

// POST /api/orders - 创建订单
router.post('/', orderController.createOrderValidation, validate, orderController.createOrder);

// GET /api/orders - 订单列表
router.get('/', orderController.getOrders);

// GET /api/orders/:id - 订单详情
router.get('/:id', orderController.getOrderDetail);

// PUT /api/orders/:id/cancel - 取消订单
router.put('/:id/cancel', orderController.cancelOrder);

// PUT /api/orders/:id/confirm - 确认收货
router.put('/:id/confirm', orderController.confirmReceive);

// POST /api/orders/:id/pay - 微信支付统一下单
router.post('/:id/pay', orderController.createWxPayOrder);

// GET /api/orders/:id/pay-status - 查询支付状态
router.get('/:id/pay-status', orderController.getPayStatus);

module.exports = router;