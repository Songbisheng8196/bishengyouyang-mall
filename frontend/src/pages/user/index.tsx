import { useEffect } from 'react'
import { View, Text, Image } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import { useUserStore } from '@/store/user'
import './index.scss'

const MENU_ITEMS = [
  { id: 'member', title: '会员中心', icon: 'member.png', path: '/pages/user/member' },
  { id: 'points', title: '我的积分', icon: 'points.png', path: '/pages/user/points' },
  { id: 'coupons', title: '优惠券', icon: 'coupon.png', path: '/pages/user/coupons' },
  { id: 'constitution', title: '测评报告', icon: 'report.png', path: '/pages/user/constitution-reports' },
  { id: 'checkin', title: '打卡记录', icon: 'checkin-history.png', path: '/pages/user/checkin-history' },
  { id: 'address', title: '收货地址', icon: 'address.png', path: '/pages/user/address' },
  { id: 'service', title: '在线客服', icon: 'service.png', path: '/pages/user/customer-service' },
]

export default function User() {
  const { userInfo, isLoggedIn } = useUserStore()

  const getMemberLevelName = (level: number) => ['普通会员', '银卡会员', '金卡会员'][level] || '普通会员'
  const getMemberLevelColor = (level: number) => ['#999999', '#C0C0C0', '#FFD700'][level] || '#999999'

  return (
    <View className="user-page">
      <View className="user-card">
        <View className="user-info">
          <Image src={userInfo?.avatarUrl || '/assets/images/default-avatar.png'} className="avatar" />
          <View className="info-detail">
            <Text className="nickname">{userInfo?.nickName || '点击登录'}</Text>
            <View className="member-badge" style={{ backgroundColor: getMemberLevelColor(userInfo?.memberLevel || 0) }}>
              <Text className="member-name">{getMemberLevelName(userInfo?.memberLevel || 0)}</Text>
            </View>
          </View>
        </View>
        <View className="user-stats">
          <View className="stat-item"><Text className="stat-value">{userInfo?.points || 0}</Text><Text className="stat-label">积分</Text></View>
          <View className="stat-item" onClick={() => Taro.navigateTo({ url: '/pages/user/coupons' })}><Text className="stat-value">0</Text><Text className="stat-label">优惠券</Text></View>
          <View className="stat-item" onClick={() => Taro.navigateTo({ url: '/pages/order/list' })}><Text className="stat-value">0</Text><Text className="stat-label">订单</Text></View>
        </View>
      </View>
      <View className="member-upgrade" onClick={() => Taro.navigateTo({ url: '/pages/user/member' })}>
        <View className="upgrade-info">
          <Text className="upgrade-title">升级银卡会员</Text>
          <Text className="upgrade-desc">享受9.5折优惠，更多专属权益</Text>
        </View>
        <Text className="upgrade-btn">立即升级</Text>
      </View>
      <View className="menu-section">
        {MENU_ITEMS.map(item => (
          <View key={item.id} className="menu-item" onClick={() => Taro.navigateTo({ url: item.path })}>
            <View className="menu-left">
              <Image src={`/assets/images/${item.icon}`} className="menu-icon" />
              <Text className="menu-title">{item.title}</Text>
            </View>
            <Text className="menu-arrow">></Text>
          </View>
        ))}
      </View>
      {/* 🍵 合规标注：本品为普通食品，仅作日常食补食用。 */}
    </View>
  )
}