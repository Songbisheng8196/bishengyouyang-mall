import { request } from '@/utils/request'

// 微信登录
export function wxLogin(code: string) {
  return request('/auth/login', { method: 'POST', data: { code } })
}

// 获取用户信息
export function getUserInfo() {
  return request('/auth/userinfo')
}

// 更新用户信息
export function updateUserInfo(data: any) {
  return request('/auth/userinfo', { method: 'PUT', data })
}