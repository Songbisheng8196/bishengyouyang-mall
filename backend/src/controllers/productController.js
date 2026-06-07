/**
 * 商品控制器
 * 毕生优养商城后端 API
 * Phase2 扩展：新增 images/tags/stock/weight/originalPrice 字段
 */

const { Product, Category } = require('../../database/init');
const { success, paginate, error } = require('../utils/response');
const ErrorCodes = require('../utils/errorCodes');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');

/**
 * 获取商品列表
 * GET /api/products
 * Phase2: 支持 categoryId/keyword/page/pageSize 参数
 */
const getProducts = asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    pageSize = 10, 
    categoryId,
    category_id, // 兼容旧参数
    keyword,
    sort = 'id',
    order = 'desc'
  } = req.query;

  const where = { status: 1 };
  
  // 兼容 categoryId 和 category_id 参数
  const catId = categoryId || category_id;
  if (catId) {
    where.category_id = catId;
  }
  
  if (keyword) {
    where.name = { $like: `%${keyword}%` };
  }

  // 排序映射
  const orderMap = {
    'price': 'price',
    'sales': 'sales_count',
    'time': 'created_at',
    'id': 'id'
  };

  const { count, rows } = await Product.findAndCountAll({
    where,
    order: [[orderMap[sort] || 'id', order.toUpperCase()]],
    limit: parseInt(pageSize),
    offset: (parseInt(page) - 1) * parseInt(pageSize)
  });

  // Phase2 返回真实数据（含 images/tags/stock）
  const list = rows.map(p => ({
    id: p.id,
    name: p.name,
    subtitle: p.subtitle,
    cover_image: p.cover_image,
    images: p.images || [],
    price: p.price,
    originalPrice: p.original_price || p.originalPrice,
    stock: p.stock || 0,
    sales_count: p.sales_count,
    tags: p.tags || [],
    category_id: p.category_id
  }));

  res.json(paginate(list, count, page, pageSize));
});

/**
 * 获取商品详情
 * GET /api/products/:id
 * Phase2: 返回完整商品信息（含 images/tags/stock/weight）
 */
const getProductDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findByPk(id);

  if (!product) {
    return res.status(404).json(error('商品不存在', 404));
  }

  res.json(success({
    id: product.id,
    name: product.name,
    subtitle: product.subtitle,
    cover_image: product.cover_image,
    images: product.images || [],
    price: product.price,
    originalPrice: product.original_price || product.originalPrice,
    stock: product.stock || 0,
    weight: product.weight || 0,
    sales_count: product.sales_count || 0,
    description: product.description,
    specifications: product.specifications || [],
    tags: product.tags || [],
    category_id: product.category_id,
    status: product.status,
    compliance_notice: '⚠️ 本品为普通食品，仅作日常食补食用，非医疗诊断，身体不适请及时就医。'
  }));
});

/**
 * 批量导入商品
 * POST /api/admin/products/batch-import
 * Phase2 新增
 */
const batchImport = asyncHandler(async (req, res) => {
  const { products } = req.body;
  
  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json(error('请提供有效的商品列表', 400));
  }

  const results = {
    success: 0,
    failed: 0,
    errors: []
  };

  for (let i = 0; i < products.length; i++) {
    const item = products[i];
    
    // 验证必填字段
    if (!item.name || !item.price || !item.category_id) {
      results.failed++;
      results.errors.push({
        index: i,
        message: '缺少必填字段（name/price/category_id）'
      });
      continue;
    }

    try {
      const product = await Product.create({
        name: item.name,
        subtitle: item.subtitle || '',
        description: item.description || '',
        price: parseFloat(item.price),
        original_price: item.originalPrice ? parseFloat(item.originalPrice) : null,
        stock: parseInt(item.stock) || 0,
        weight: parseFloat(item.weight) || 0,
        images: item.images || [],
        tags: item.tags || [],
        cover_image: item.cover_image || (item.images && item.images[0]) || '',
        specifications: item.specifications || [],
        category_id: item.category_id,
        status: item.status !== undefined ? item.status : 1,
        sales_count: 0
      });
      
      results.success++;
    } catch (err) {
      results.failed++;
      results.errors.push({
        index: i,
        name: item.name,
        message: err.message
      });
    }
  }

  res.json(success({
    total: products.length,
    success: results.success,
    failed: results.failed,
    errors: results.errors
  }));
});

module.exports = {
  getProducts,
  getProductDetail,
  batchImport
};