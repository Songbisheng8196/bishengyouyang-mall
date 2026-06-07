import { request } from '@/utils/request'

// 创建订单
export function createOrder(data: any) {
  return request('/orders', { method: 'POST', data })
}

// 订单列表
export function getOrders(params?: { status?: string; page?: number }) {
  return request('/orders', { data: params })
}

// 订单详情
export function getOrderDetail(id: string) {
  return request(`/orders/${id}`)
}

// 取消订单
export function cancelOrder(id: string) {
  return request(`/orders/${id}/cancel`, { method: 'PUT' })
}

// 申请售后
export function applyAftersale(orderId: string, data: any) {
  return request(`/orders/${orderId}/aftersale`, { method: 'POST', data })
}

// 查询物流
export function getLogistics(id: string) {
  return request(`/logistics/${id}`)
}