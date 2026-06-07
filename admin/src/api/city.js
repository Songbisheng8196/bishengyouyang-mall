import request from '@/utils/request'

// 获取门店列表
export const getStoreList = (params) => {
  // 接口路径: /api/admin/store/list
  return request.get('/store/list', { params })
}

// 获取门店详情
export const getStoreDetail = (id) => {
  // 接口路径: /api/admin/store/detail
  return request.get('/store/detail', { params: { id } })
}

// 新增门店
export const addStore = (data) => {
  // 接口路径: /api/admin/store/add
  return request.post('/store/add', data)
}

// 编辑门店
export const updateStore = (data) => {
  // 接口路径: /api/admin/store/update
  return request.post('/store/update', data)
}

// 删除门店
export const deleteStore = (id) => {
  // 接口路径: /api/admin/store/delete
  return request.post('/store/delete', { id })
}

// 获取沙龙列表
export const getSalonList = (params) => {
  // 接口路径: /api/admin/salon/list
  return request.get('/salon/list', { params })
}

// 获取沙龙详情
export const getSalonDetail = (id) => {
  // 接口路径: /api/admin/salon/detail
  return request.get('/salon/detail', { params: { id } })
}

// 新增沙龙
export const addSalon = (data) => {
  // 接口路径: /api/admin/salon/add
  return request.post('/salon/add', data)
}

// 编辑沙龙
export const updateSalon = (data) => {
  // 接口路径: /api/admin/salon/update
  return request.post('/salon/update', data)
}

// 删除沙龙
export const deleteSalon = (id) => {
  // 接口路径: /api/admin/salon/delete
  return request.post('/salon/delete', { id })
}

// 获取沙龙预约列表
export const getSalonBookingList = (params) => {
  // 接口路径: /api/admin/salon/booking/list
  return request.get('/salon/booking/list', { params })
}

// 获取拼团列表
export const getGroupBuyList = (params) => {
  // 接口路径: /api/admin/groupbuy/list
  return request.get('/groupbuy/list', { params })
}

// 新增拼团活动
export const addGroupBuy = (data) => {
  // 接口路径: /api/admin/groupbuy/add
  return request.post('/groupbuy/add', data)
}

// 编辑拼团活动
export const updateGroupBuy = (data) => {
  // 接口路径: /api/admin/groupbuy/update
  return request.post('/groupbuy/update', data)
}

// 结束拼团活动
export const endGroupBuy = (id) => {
  // 接口路径: /api/admin/groupbuy/end
  return request.post('/groupbuy/end', { id })
}
