/**
 * 商品路由
 * 毕生优养商城后端 API
 * Phase2 新增：批量导入接口
 */

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const productController = require('../controllers/productController');

// GET /api/categories - 商品分类列表
router.get('/categories', categoryController.getCategories);

// GET /api/categories/:id/products - 分类下的商品
router.get('/categories/:id/products', categoryController.getCategoryProducts);

// GET /api/products - 商品列表
router.get('/products', productController.getProducts);

// GET /api/products/:id - 商品详情
router.get('/products/:id', productController.getProductDetail);

// POST /api/admin/products/batch-import - 批量导入商品
router.post('/admin/products/batch-import', productController.batchImport);

module.exports = router;