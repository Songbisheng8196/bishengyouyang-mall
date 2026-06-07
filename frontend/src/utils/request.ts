import Taro from '@tarojs/taro'
import { success, error } from '@/utils/response'

const BASE_URL = process.env.API_BASE_URL || 'http://106.52.93.171:3000/api'

// 通用请求封装
async function request<T = any>(
  url: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    data?: any
    header?: Record<string, string>
  } = {}
): Promise<T> {
  const token = Taro.getStorageSync('token')
  const header = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.header,
  }

  try {
    const res = await Taro.request({
      url: `${BASE_URL}${url}`,
      method: options.method || 'GET',
      data: options.data,
      header,
    })
    if (res.statusCode >= 200 && res.statusCode < 300) {
      const data = res.data as any
      if (data.code === 0) {
        return data.data
      }
      error(data.message || '请求失败')
      throw new Error(data.message)
    }
    error(`HTTP ${res.statusCode}`)
    throw new Error(`HTTP ${res.statusCode}`)
  } catch (err: any) {
    error(err.message || '网络错误')
    throw err
  }
}

export { request }