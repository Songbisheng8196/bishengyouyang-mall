import request from '@/utils/request'

// 获取优惠券列表
export const getCouponList = (params) => {
  // 接口路径: /api/admin/coupon/list
  return request.get('/coupon/list', { params })
}

// 获取优惠券详情
export const getCouponDetail = (id) => {
  // 接口路径: /api/admin/coupon/detail
  return request.get('/coupon/detail', { params: { id } })
}

// 新增优惠券
export const addCoupon = (data) => {
  // 接口路径: /api/admin/coupon/add
  return request.post('/coupon/add', data)
}

// 编辑优惠券
export const updateCoupon = (data) => {
  // 接口路径: /api/admin/coupon/update
  return request.post('/coupon/update', data)
}

// 删除优惠券
export const deleteCoupon = (id) => {
  // 接口路径: /api/admin/coupon/delete
  return request.post('/coupon/delete', { id })
}

// 发放优惠券
export const distributeCoupon = (data) => {
  // 接口路径: /api/admin/coupon/distribute
  return request.post('/coupon/distribute', data)
}

// 获取积分规则
export const getPointsRule = () => {
  // 接口路径: /api/admin/points/rule
  return request.get('/points/rule')
}

// 更新积分规则
export const updatePointsRule = (data) => {
  // 接口路径: /api/admin/points/rule/update
  return request.post('/points/rule/update', data)
}

// 获取积分记录
export const getPointsLog = (params) => {
  // 接口路径: /api/admin/points/log
  return request.get('/points/log', { params })
}
