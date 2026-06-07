import request from '@/utils/request'

// 获取会员列表
export const getMemberList = (params) => {
  // 接口路径: /api/admin/member/list
  return request.get('/member/list', { params })
}

// 获取会员详情
export const getMemberDetail = (id) => {
  // 接口路径: /api/admin/member/detail
  return request.get('/member/detail', { params: { id } })
}

// 编辑会员
export const updateMember = (data) => {
  // 接口路径: /api/admin/member/update
  return request.post('/member/update', data)
}

// 调整会员积分
export const adjustMemberPoints = (data) => {
  // 接口路径: /api/admin/member/adjustPoints
  return request.post('/member/adjustPoints', data)
}
