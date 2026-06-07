/**
 * 武汉同城路由
 * 毕生优养商城后端 API
 */

const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const salonController = require('../controllers/salonController');
const { validate } = require('../middleware/validator');
const { authenticate } = require('../middleware/auth');

// GET /api/stores - 门店列表
router.get('/stores', storeController.getStores);

// GET /api/stores/:id - 门店详情
router.get('/stores/:id', storeController.getStoreDetail);

// GET /api/salons - 沙龙活动列表
router.get('/salons', salonController.getSalons);

// GET /api/salons/:id - 沙龙活动详情
router.get('/salons/:id', salonController.getSalonDetail);

// POST /api/salons/reserve - 沙龙预约提交
router.post('/salons/reserve', authenticate, salonController.reserveValidation, validate, salonController.reserveSalon);

// GET /api/salons/my-reservations - 我的沙龙预约
router.get('/salons/my-reservations', authenticate, salonController.getMyReservations);

// DELETE /api/salons/reserve/:id - 取消沙龙预约
router.delete('/salons/reserve/:id', authenticate, salonController.cancelReservation);

module.exports = router;