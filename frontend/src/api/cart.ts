import { request } from '@/utils/request'

// 获取购物车
export function getCart() {
  return request('/cart')
}

// 添加购物车
export function addCart(data: { productId: string; quantity: number }) {
  return request('/cart', { method: 'POST', data })
}

// 更新购物车商品
export function updateCartItem(id: string, data: { quantity: number }) {
  return request(`/cart/${id}`, { method: 'PUT', data })
}

// 删除购物车商品
export function removeCartItem(id: string) {
  return request(`/cart/${id}`, { method: 'DELETE' })
}