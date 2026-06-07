import { request } from '@/utils/request'

// 提交体质测评
export function submitConstitution(answers: Record<number, number>) {
  return request('/constitution/submit', { method: 'POST', data: { answers } })
}

// 查询历史报告
export function getConstitutionReports() {
  return request('/constitution/reports')
}

// 获取推荐方案
export function getRecommend(type: string) {
  return request('/constitution/recommend', { data: { type } })
}