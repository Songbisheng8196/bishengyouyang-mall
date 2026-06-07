/**
 * 购物车控制器
 * 毕生优养商城后端 API
 */

const { body } = require('express-validator');
const { CartItem, Product, User } = require('../../database/init');
const { success, error } = require('../utils/response');
const ErrorCodes = require('../utils/errorCodes');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');

/**
 * 获取购物车列表
 * GET /api/cart
 */
const getCart = asyncHandler(async (req, res) => {
  const cartItems = await CartItem.findAll({
    where: { user_id: req.user.id },
    include: [{
      model: Product,
      attributes: ['id', 'name', 'cover_image', 'price', 'stock', 'status']
    }],
    order: [['created_at', 'DESC']]
  });

  // 计算购物车统计
  let totalAmount = 0;
  let totalCount = 0;
  
  const validItems = cartItems.filter(item => item.Product && item.Product.status === 1);
  
  validItems.forEach(item => {
    if (item.selected) {
      totalAmount += parseFloat(item.Product.price) * item.quantity;
      totalCount += item.quantity;
    }
  });

  res.json(success({
    items: validItems.map(item => ({
      id: item.id,
      product_id: item.product_id,
      product_name: item.Product.name,
      cover_image: item.Product.cover_image,
      price: item.Product.price,
      stock: item.Product.stock,
      quantity: item.quantity,
      specifications: item.specifications,
      selected: item.selected,
      subtotal: parseFloat(item.Product.price) * item.quantity
    })),
    totalAmount: totalAmount.toFixed(2),
    totalCount
  }));
});

/**
 * 添加商品到购物车
 * POST /api/cart
 */
const addToCart = asyncHandler(async (req, res) => {
  const { product_id, quantity = 1, specifications } = req.body;

  // 检查商品是否存在
  const product = await Product.findByPk(product_id);
  if (!product) {
    throw new ApiError(ErrorCodes.PRODUCT_NOT_FOUND);
  }

  if (product.status !== 1) {
    throw new ApiError(error(400, '商品已下架'));
  }

  if (product.stock < quantity) {
    throw new ApiError(ErrorCodes.PRODUCT_STOCK_NOT_ENOUGH);
  }

  // 检查购物车中是否已有该商品
  let cartItem = await CartItem.findOne({
    where: { 
      user_id: req.user.id,
      product_id,
      specifications: specifications || null
    }
  });

  if (cartItem) {
    // 更新数量
    const newQuantity = cartItem.quantity + quantity;
    if (newQuantity > product.stock) {
      throw new ApiError(ErrorCodes.PRODUCT_STOCK_NOT_ENOUGH);
    }
    cartItem.quantity = newQuantity;
    await cartItem.save();
  } else {
    // 创建新记录
    cartItem = await CartItem.create({
      user_id: req.user.id,
      product_id,
      quantity,
      specifications,
      selected: true
    });
  }

  // 返回更新后的购物车数量
  const cartCount = await CartItem.sum('quantity', {
    where: { user_id: req.user.id }
  });

  res.status(201).json(success({
    cart_item_id: cartItem.id,
    cart_count: cartCount || 0
  }, '添加成功'));
});

/**
 * 更新购物车商品
 * PUT /api/cart/:id
 */
const updateCartItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quantity, selected, specifications } = req.body;

  const cartItem = await CartItem.findOne({
    where: { id, user_id: req.user.id }
  });

  if (!cartItem) {
    throw new ApiError(error(404, '购物车商品不存在'));
  }

  if (quantity !== undefined) {
    if (quantity <= 0) {
      await cartItem.destroy();
      return res.json(success(null, '已从购物车移除'));
    }

    const product = await Product.findByPk(cartItem.product_id);
    if (quantity > product.stock) {
      throw new ApiError(ErrorCodes.PRODUCT_STOCK_NOT_ENOUGH);
    }
    cartItem.quantity = quantity;
  }

  if (selected !== undefined) {
    cartItem.selected = selected;
  }

  if (specifications !== undefined) {
    cartItem.specifications = specifications;
  }

  await cartItem.save();

  res.json(success({
    id: cartItem.id,
    quantity: cartItem.quantity,
    selected: cartItem.selected,
    specifications: cartItem.specifications
  }, '更新成功'));
});

/**
 * 删除购物车商品
 * DELETE /api/cart/:id
 */
const removeCartItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const cartItem = await CartItem.findOne({
    where: { id, user_id: req.user.id }
  });

  if (!cartItem) {
    throw new ApiError(error(404, '购物车商品不存在'));
  }

  await cartItem.destroy();

  res.json(success(null, '删除成功'));
});

/**
 * 清空购物车（已选中的商品）
 * DELETE /api/cart
 */
const clearCart = asyncHandler(async (req, res) => {
  const { selected_only = true } = req.query;

  const where = { user_id: req.user.id };
  
  if (selected_only === 'true' || selected_only === true) {
    where.selected = true;
  }

  await CartItem.destroy({ where });

  res.json(success(null, '清空成功'));
});

// 验证规则
const addToCartValidation = [
  body('product_id').notEmpty().withMessage('商品ID不能为空').isInt().withMessage('商品ID必须是整数'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('数量必须是正整数'),
  body('specifications').optional().isObject().withMessage('规格格式错误')
];

const updateCartValidation = [
  body('quantity').optional().isInt({ min: 0 }).withMessage('数量必须是非负整数'),
  body('selected').optional().isBoolean().withMessage('选中状态必须是布尔值')
];

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  addToCartValidation,
  updateCartValidation
};