import request from '@/utils/request'

// 获取订单列表
export const getOrderList = (params) => {
  // 接口路径: /api/admin/order/list
  return request.get('/order/list', { params })
}

// 获取订单详情
export const getOrderDetail = (id) => {
  // 接口路径: /api/admin/order/detail
  return request.get('/order/detail', { params: { id } })
}

// 更新订单状态
export const updateOrderStatus = (data) => {
  // 接口路径: /api/admin/order/updateStatus
  return request.post('/order/updateStatus', data)
}

// 获取售后列表
export const getAftersaleList = (params) => {
  // 接口路径: /api/admin/aftersale/list
  return request.get('/aftersale/list', { params })
}

// 处理售后
export const handleAftersale = (data) => {
  // 接口路径: /api/admin/aftersale/handle
  return request.post('/aftersale/handle', data)
}
