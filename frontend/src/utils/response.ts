/**
 * 统一响应状态处理工具
 */
import Taro from '@tarojs/taro'

export function success(message: string = '操作成功'): void {
  Taro.showToast({ title: message, icon: 'success', duration: 2000 })
}

export function error(message: string = '操作失败'): void {
  Taro.showToast({ title: message, icon: 'none', duration: 2000 })
}

export function loading(message: string = '加载中...'): void {
  Taro.showLoading({ title: message, mask: true })
}

export function hideLoading(): void {
  Taro.hideLoading()
}

export function toast(message: string, icon: 'success' | 'none' | 'loading' = 'none'): void {
  Taro.showToast({ title: message, icon, duration: 2000 })
}