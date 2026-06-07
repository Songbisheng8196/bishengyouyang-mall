/**
 * 全局状态管理 - 用户状态
 */
import { create } from 'zustand'
import Taro from '@tarojs/taro'

interface UserState {
  token: string
  userInfo: {
    id: string
    nickName: string
    avatarUrl: string
    phone: string
    memberLevel: number
    points: number
  } | null
  isLoggedIn: boolean
  setToken: (token: string) => void
  setUserInfo: (userInfo: UserState['userInfo']) => void
  login: (token: string, userInfo: UserState['userInfo']) => void
  logout: () => void
  updatePoints: (points: number) => void
}

export const useUserStore = create<UserState>((set) => ({
  token: Taro.getStorageSync('token') || '',
  userInfo: Taro.getStorageSync('user_info') || null,
  isLoggedIn: !!Taro.getStorageSync('token'),
  
  setToken: (token) => {
    Taro.setStorageSync('token', token)
    set({ token })
  },
  
  setUserInfo: (userInfo) => {
    if (userInfo) Taro.setStorageSync('user_info', userInfo)
    set({ userInfo })
  },
  
  login: (token, userInfo) => {
    Taro.setStorageSync('token', token)
    Taro.setStorageSync('user_info', userInfo)
    set({ token, userInfo, isLoggedIn: true })
  },
  
  logout: () => {
    Taro.removeStorageSync('token')
    Taro.removeStorageSync('user_info')
    set({ token: '', userInfo: null, isLoggedIn: false })
  },
  
  updatePoints: (points) => {
    const userInfo = Taro.getStorageSync('user_info')
    if (userInfo) {
      userInfo.points = points
      Taro.setStorageSync('user_info', userInfo)
      set({ userInfo })
    }
  }
}))