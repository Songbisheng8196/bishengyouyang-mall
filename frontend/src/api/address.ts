/**
 * 地址管理相关API
 */
import { get, post, put, del } from '@/utils/request'

export interface Address {
  id: string
  name: string
  phone: string
  province: string
  provinceCode: string
  city: string
  cityCode: string
  district: string
  districtCode: string
  detail: string
  isDefault: boolean
}

export async function getAddressList(): Promise<Address[]> {
  return get('/api/address')
}

export async function getAddressDetail(id: string): Promise<Address> {
  return get(`/api/address/${id}`)
}

export async function addAddress(data: Omit<Address, 'id'>): Promise<Address> {
  return post('/api/address', data)
}

export async function updateAddress(id: string, data: Partial<Address>): Promise<Address> {
  return put(`/api/address/${id}`, data)
}

export async function deleteAddress(id: string): Promise<void> {
  return del(`/api/address/${id}`)
}

export async function setDefaultAddress(id: string): Promise<void> {
  return put(`/api/address/${id}/default`)
}