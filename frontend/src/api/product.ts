import { request } from '@/utils/request'

// 获取分类列表
export function getCategories() {
  return request('/categories')
}

// 获取商品列表
export function getProducts(params?: { categoryId?: string; page?: number; pageSize?: number }) {
  return request('/products', { data: params })
}

// 获取商品详情
export function getProductDetail(id: string) {
  return request(`/products/${id}`)
}