/**
 * 测试脚本 - 验证后端服务可启动
 */
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// 创建测试应用
const app = express();
app.use(cors());
app.use(express.json());

// 测试路由
app.get('/test', (req, res) => {
  res.json({ code: 0, message: 'success', data: { test: 'ok' } });
});

app.get('/api/categories', (req, res) => {
  res.json({ 
    code: 0, 
    message: 'success', 
    data: [
      { id: 1, name: '花养膏系列', icon: '/images/category/huayanggao.png', sort_order: 1 },
      { id: 2, name: '花茶系列', icon: '/images/category/flower-tea.png', sort_order: 2 },
      { id: 3, name: '养生礼盒', icon: '/images/category/gift-box.png', sort_order: 3 },
      { id: 4, name: '滋补品', icon: '/images/category/nourishing.png', sort_order: 4 },
      { id: 5, name: '日常零食', icon: '/images/category/snacks.png', sort_order: 5 }
    ]
  });
});

app.get('/api/products', (req, res) => {
  res.json({ 
    code: 0, 
    message: 'success', 
    data: { list: [], pagination: { total: 0, page: 1, pageSize: 10, totalPages: 0 } }
  });
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ code: 0, message: 'success', data: { status: 'ok', version: '1.0.0' } });
});

const PORT = process.env.API_PORT || 3000;

app.listen(PORT, () => {
  console.log('========================================');
  console.log('  毕生优养商城后端 API 服务 - 测试模式');
  console.log('========================================');
  console.log(`  服务地址: http://localhost:${PORT}`);
  console.log(`  健康检查: http://localhost:${PORT}/health`);
  console.log('========================================');
  console.log('');
});

module.exports = app;