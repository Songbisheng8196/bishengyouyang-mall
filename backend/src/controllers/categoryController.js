/**
 * 商品分类控制器
 * 毕生优养商城后端 API
 */

const { Category, Product } = require('../../database/init');
const { success, paginate } = require('../utils/response');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * 获取商品分类列表
 * GET /api/categories
 */
const getCategories = asyncHandler(async (req, res) => {
  // Phase1 占位数据
  const placeholderCategories = [
    { id: 1, name: '花养膏系列', icon: '/images/category/huayanggao.png', sort_order: 1 },
    { id: 2, name: '花茶系列', icon: '/images/category/flower-tea.png', sort_order: 2 },
    { id: 3, name: '养生礼盒', icon: '/images/category/gift-box.png', sort_order: 3 },
    { id: 4, name: '滋补品', icon: '/images/category/nourishing.png', sort_order: 4 },
    { id: 5, name: '日常零食', icon: '/images/category/snacks.png', sort_order: 5 }
  ];

  // 尝试从数据库获取真实数据
  const dbCategories = await Category.findAll({
    where: { status: 1 },
    order: [['sort_order', 'ASC']]
  });

  const categories = dbCategories.length > 0 ? dbCategories : placeholderCategories;

  res.json(success(categories));
});

/**
 * 获取分类下的商品
 * GET /api/categories/:id/products
 */
const getCategoryProducts = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page = 1, pageSize = 10 } = req.query;

  const { count, rows } = await Product.findAndCountAll({
    where: { 
      category_id: id,
      status: 1 
    },
    order: [['id', 'DESC']],
    limit: parseInt(pageSize),
    offset: (parseInt(page) - 1) * parseInt(pageSize)
  });

  // Phase1 如果没有真实数据，返回空数组
  const list = rows.length > 0 ? rows : [];

  res.json(paginate(list, count, page, pageSize));
});

module.exports = {
  getCategories,
  getCategoryProducts
};