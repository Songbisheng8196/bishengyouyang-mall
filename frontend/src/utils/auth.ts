/**
 * 微信登录授权封装工具
 */
import Taro from '@tarojs/taro'

export async function wxLogin(): Promise<string> {
  try {
    const result = await Taro.login()
    if (result.code) return result.code
    throw new Error('微信登录失败，未获取到code')
  } catch (error) {
    console.error('wxLogin error:', error)
    throw error
  }
}

export async function login(): Promise<{ token: string; userInfo: any }> {
  const code = await wxLogin()
  const response = await Taro.request({
    url: `${process.env.API_BASE}/api/auth/login`,
    method: 'POST',
    data: { code }
  })
  const { token, userInfo } = response.data
  Taro.setStorageSync('token', token)
  Taro.setStorageSync('user_info', userInfo)
  return { token, userInfo }
}

export function logout(): void {
  Taro.removeStorageSync('token')
  Taro.removeStorageSync('user_info')
  Taro.removeStorageSync('session_key')
}

export function getToken(): string {
  return Taro.getStorageSync('token') || ''
}