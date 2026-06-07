/**
 * 武汉同城相关API
 */
import { get, post } from '@/utils/request'

export interface Store {
  id: string
  name: string
  image: string
  address: string
  phone: string
  latitude: number
  longitude: number
  distance?: number
  businessHours: string
  services: string[]
}

export interface Salon {
  id: string
  title: string
  coverImage: string
  date: string
  time: string
  location: string
  capacity: number
  registered: number
  status: number
}

export interface GroupBuy {
  id: string
  productId: string
  productName: string
  productImage: string
  originalPrice: number
  groupPrice: number
  groupSize: number
  currentCount: number
  endTime: string
  status: number
}

export async function getStoreList(params?: { latitude?: number; longitude?: number }): Promise<Store[]> {
  return get('/api/stores', params)
}

export async function getStoreDetail(id: string): Promise<Store> {
  return get(`/api/stores/${id}`)
}

export async function getSalonList(): Promise<Salon[]> {
  return get('/api/salons')
}

export async function reserveSalon(params: { salonId: string; name: string; phone: string; note?: string }): Promise<void> {
  return post('/api/salons/reserve', params)
}

export async function getGroupBuyList(): Promise<GroupBuy[]> {
  return get('/api/group-buyings')
}

export async function joinGroupBuy(groupBuyId: string): Promise<{ orderId: string }> {
  return post('/api/group-buyings/join', { groupBuyId })
}

export async function createGroupBuyOrder(groupBuyId: string, addressId: string): Promise<{ orderId: string }> {
  return post('/api/group-buyings/create-order', { groupBuyId, addressId })
}