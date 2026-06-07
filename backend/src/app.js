/**
 * 毕生优养商城后端 API 服务
 * 主应用入口
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

// 导入中间件
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const { success } = require('./utils/response');

// 创建 Express 应用
const app = express();

// 中间件配置
app.use(cors({
  origin: '*', // 生产环境应配置具体域名
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 静态文件服务 - 上传的图片
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 请求日志（开发环境）
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
  });
}

// 健康检查接口
app.get('/health', (req, res) => {
  res.json(success({
    status: 'ok',
    service: 'bisheng-youyang-backend',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  }));
});

// API 版本信息
app.get('/api', (req, res) => {
  res.json(success({
    name: '毕生优养商城 API',
    version: 'v1',
    description: '女性轻养生食品微信小程序后端服务',
    endpoints: {
      auth: '/api/auth',
      products: '/api/categories, /api/products',
      cart: '/api/cart',
      orders: '/api/orders',
      member: '/api/member, /api/points, /api/coupons',
      constitution: '/api/constitution',
      checkin: '/api/checkin',
      courses: '/api/courses, /api/articles',
      city: '/api/stores, /api/salons'
    }
  }));
});

// 导入路由
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const memberRoutes = require('./routes/member');
const constitutionRoutes = require('./routes/constitution');
const checkinRoutes = require('./routes/checkin');
const courseRoutes = require('./routes/course');
const cityRoutes = require('./routes/city');

// 挂载路由
app.use('/api/auth', authRoutes);
app.use('/api', productRoutes); // categories 和 products
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', memberRoutes); // member, points, coupons
app.use('/api/constitution', constitutionRoutes);
app.use('/api', checkinRoutes); // checkin 路由
app.use('/api', courseRoutes); // courses, articles, admin/courses
app.use('/api', cityRoutes); // stores, salons

// 物流查询接口（独立路由）
const { getLogistics } = require('./controllers/orderController');
const { authenticate } = require('./middleware/auth');
app.get('/api/logistics/:id', authenticate, getLogistics);

// 微信支付回调接口（无需鉴权）
const { wxPayNotify } = require('./controllers/orderController');
app.post('/api/orders/wxpay-notify', wxPayNotify);

// 错误处理
app.use(notFoundHandler);
app.use(errorHandler);

// 启动服务器
const PORT = process.env.API_PORT || 3000;
const HOST = process.env.API_HOST || 'http://localhost';

app.listen(PORT, () => {
  console.log('');
  console.log('========================================');
  console.log('  毕生优养商城后端 API 服务');
  console.log('========================================');
  console.log(`  服务地址: ${HOST}:${PORT}`);
  console.log(`  健康检查: ${HOST}:${PORT}/health`);
  console.log(`  API信息:   ${HOST}:${PORT}/api`);
  console.log(`  环境:     ${process.env.NODE_ENV || 'development'}`);
  console.log('========================================');
  console.log('');
});

module.exports = app;