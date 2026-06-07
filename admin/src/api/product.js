import request from '@/utils/request'

// 获取商品列表
export const getProductList = (params) => {
  // 接口路径: /api/admin/product/list
  return request.get('/product/list', { params })
}

// 获取商品详情
export const getProductDetail = (id) => {
  // 接口路径: /api/admin/product/detail
  return request.get('/product/detail', { params: { id } })
}

// 新增商品
export const addProduct = (data) => {
  // 接口路径: /api/admin/product/add
  return request.post('/product/add', data)
}

// 编辑商品
export const updateProduct = (data) => {
  // 接口路径: /api/admin/product/update
  return request.post('/product/update', data)
}

// 删除商品
export const deleteProduct = (id) => {
  // 接口路径: /api/admin/product/delete
  return request.post('/product/delete', { id })
}

// 获取商品分类列表
export const getCategoryList = (params) => {
  // 接口路径: /api/admin/category/list
  return request.get('/category/list', { params })
}

// 新增商品分类
export const addCategory = (data) => {
  // 接口路径: /api/admin/category/add
  return request.post('/category/add', data)
}

// 编辑商品分类
export const updateCategory = (data) => {
  // 接口路径: /api/admin/category/update
  return request.post('/category/update', data)
}

// 删除商品分类
export const deleteCategory = (id) => {
  // 接口路径: /api/admin/category/delete
  return request.post('/category/delete', { id })
}
