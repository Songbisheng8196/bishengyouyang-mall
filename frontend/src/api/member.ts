/**
 * 会员与积分相关API
 */
import { get, post } from '@/utils/request'

export interface MemberInfo {
  level: number
  levelName: string
  points: number
  discount: number
  benefits: string[]
  upgradeProgress?: number
  nextLevelPoints?: number
}

export interface PointsRecord {
  id: string
  type: number
  points: number
  description: string
  createTime: string
}

export interface Coupon {
  id: string
  name: string
  type: number
  value: number
  minAmount: number
  validStart: string
  validEnd: string
  status: number
}

export async function getMemberInfo(): Promise<MemberInfo> {
  return get('/api/member/info')
}

export async function getPointsBalance(): Promise<{ balance: number }> {
  return get('/api/points/balance')
}

export async function getPointsRecords(params: { page: number; pageSize: number }): Promise<{ list: PointsRecord[]; total: number }> {
  return get('/api/points/records', params)
}

export async function getCouponList(params?: { status?: number }): Promise<Coupon[]> {
  return get('/api/coupons', params)
}

export async function receiveCoupon(couponId: string): Promise<void> {
  return post('/api/coupons/receive', { couponId })
}