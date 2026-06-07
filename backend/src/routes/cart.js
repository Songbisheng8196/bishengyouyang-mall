/**
 * 购物车路由
 * 毕生优养商城后端 API
 */

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { validate } = require('../middleware/validator');
const { authenticate } = require('../middleware/auth');

// 所有购物车接口需要登录
router.use(authenticate);

// GET /api/cart - 获取购物车
router.get('/', cartController.getCart);

// POST /api/cart - 添加购物车
router.post('/', cartController.addToCartValidation, validate, cartController.addToCart);

// PUT /api/cart/:id - 更新购物车商品
router.put('/:id', cartController.updateCartValidation, validate, cartController.updateCartItem);

// DELETE /api/cart/:id - 删除购物车商品
router.delete('/:id', cartController.removeCartItem);

// DELETE /api/cart - 清空购物车
router.delete('/', cartController.clearCart);

module.exports = router;