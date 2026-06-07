/**
 * 体质测评路由
 * 毕生优养商城后端 API
 * Phase2 支持真实测评逻辑和数据
 */

const express = require('express');
const router = express.Router();
const constitutionController = require('../controllers/constitutionController');
const { validate } = require('../middleware/validator');
const { authenticate } = require('../middleware/auth');

// GET /api/constitution/questions - 获取测评题目（无需登录）
router.get('/questions', constitutionController.getQuestions);

// POST /api/constitution/submit - 提交测评结果
router.post('/submit', authenticate, constitutionController.submitValidation, validate, constitutionController.submitConstitution);

// GET /api/constitution/reports - 查询历史报告
router.get('/reports', authenticate, constitutionController.getReports);

// GET /api/constitution/recommend - 获取推荐方案（根据用户历史测评或指定体质）
router.get('/recommend', authenticate, constitutionController.getRecommend);

// GET /api/constitution/types - 获取所有体质类型列表
router.get('/types', constitutionController.getTypes);

// GET /api/constitution/recommend/:type - 获取指定体质类型的推荐方案
router.get('/recommend/:type', constitutionController.getRecommendByType);

module.exports = router;