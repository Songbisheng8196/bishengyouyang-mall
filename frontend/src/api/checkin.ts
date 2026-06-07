import { request } from '@/utils/request'

// 提交打卡
export function submitCheckin(data: { type: string; note?: string; image?: string }) {
  return request('/checkin', { method: 'POST', data })
}

// 打卡记录列表
export function getCheckinRecords(params?: { month?: string }) {
  return request('/checkin/records', { data: params })
}

// 月度小结
export function getCheckinSummary(month: string) {
  return request('/checkin/summary', { data: { month } })
}