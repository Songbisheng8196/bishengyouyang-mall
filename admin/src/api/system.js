import request from '@/utils/request'

// 获取账号列表
export const getUserList = (params) => {
  // 接口路径: /api/admin/user/list
  return request.get('/user/list', { params })
}

// 获取账号详情
export const getUserDetail = (id) => {
  // 接口路径: /api/admin/user/detail
  return request.get('/user/detail', { params: { id } })
}

// 新增账号
export const addUser = (data) => {
  // 接口路径: /api/admin/user/add
  return request.post('/user/add', data)
}

// 编辑账号
export const updateUser = (data) => {
  // 接口路径: /api/admin/user/update
  return request.post('/user/update', data)
}

// 删除账号
export const deleteUser = (id) => {
  // 接口路径: /api/admin/user/delete
  return request.post('/user/delete', { id })
}

// 重置密码
export const resetPassword = (data) => {
  // 接口路径: /api/admin/user/resetPassword
  return request.post('/user/resetPassword', data)
}

// 获取公告列表
export const getAnnouncementList = (params) => {
  // 接口路径: /api/admin/announcement/list
  return request.get('/announcement/list', { params })
}

// 获取公告详情
export const getAnnouncementDetail = (id) => {
  // 接口路径: /api/admin/announcement/detail
  return request.get('/announcement/detail', { params: { id } })
}

// 新增公告
export const addAnnouncement = (data) => {
  // 接口路径: /api/admin/announcement/add
  return request.post('/announcement/add', data)
}

// 编辑公告
export const updateAnnouncement = (data) => {
  // 接口路径: /api/admin/announcement/update
  return request.post('/announcement/update', data)
}

// 删除公告
export const deleteAnnouncement = (id) => {
  // 接口路径: /api/admin/announcement/delete
  return request.post('/announcement/delete', { id })
}

// 发布/下架公告
export const updateAnnouncementStatus = (data) => {
  // 接口路径: /api/admin/announcement/updateStatus
  return request.post('/announcement/updateStatus', data)
}
