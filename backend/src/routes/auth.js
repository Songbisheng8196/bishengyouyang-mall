/**
 * 认证路由
 * 毕生优养商城后端 API
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validate } = require('../middleware/validator');
const { authenticate } = require('../middleware/auth');

// POST /api/auth/login - 微信授权登录
router.post('/login', authController.loginValidation, validate, authController.login);

// GET /api/auth/userinfo - 获取用户信息
router.get('/userinfo', authenticate, authController.getUserInfo);

// PUT /api/auth/userinfo - 更新用户信息
router.put('/userinfo', authenticate, authController.updateUserInfoValidation, validate, authController.updateUserInfo);

module.exports = router;