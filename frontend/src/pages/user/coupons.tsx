import { useState } from 'react'
import { View, Text, Tabs, TabPane } from '@tarojs/taro'
import './index.scss'

// 模拟优惠券列表
const MOCK_COUPONS = {
  available: [
    { id: '1', name: '新人专享券', value: 20, minAmount: 100, validEnd: '2024-06-30', type: 1 },
    { id: '2', name: '会员专属券', value: 50, minAmount: 200, validEnd: '2024-06-15', type: 1 },
  ],
  used: [],
  expired: [
    { id: '3', name: '限时折扣券', value: 10, minAmount: 50, validEnd: '2024-06-01', type: 1 },
  ]
}

export default function Coupons() {
  const [activeTab, setActiveTab] = useState('available')
  const [coupons] = useState(MOCK_COUPONS)
  
  const getCurrentCoupons = () => {
    switch (activeTab) {
      case 'used': return coupons.used
      case 'expired': return coupons.expired
      default: return coupons.available
    }
  }
  
  return (
    <View className="coupons-page">
      <Tabs current={activeTab} onClick={(index) => setActiveTab(index)}>
        <TabPane title="可用优惠券">
          <View className="coupon-list">
            {getCurrentCoupons().map(coupon => (
              <View key={coupon.id} className="coupon-card available">
                <View className="coupon-left">
                  <Text className="coupon-value">¥{coupon.value}</Text>
                  <Text className="coupon-condition">满{coupon.minAmount}可用</Text>
                </View>
                <View className="coupon-right">
                  <Text className="coupon-name">{coupon.name}</Text>
                  <Text className="coupon-time">有效期至{coupon.validEnd}</Text>
                </View>
              </View>
            ))}
            {getCurrentCoupons().length === 0 && (
              <View className="empty-state">
                <Text>暂无优惠券</Text>
              </View>
            )}
          </View>
        </TabPane>
        <TabPane title="已使用">
          <View className="coupon-list">
            {getCurrentCoupons().length === 0 && (
              <View className="empty-state"><Text>暂无已使用优惠券</Text></View>
            )}
          </View>
        </TabPane>
        <TabPane title="已过期">
          <View className="coupon-list">
            {getCurrentCoupons().map(coupon => (
              <View key={coupon.id} className="coupon-card expired">
                <View className="coupon-left">
                  <Text className="coupon-value">¥{coupon.value}</Text>
                  <Text className="coupon-condition">满{coupon.minAmount}可用</Text>
                </View>
                <View className="coupon-right">
                  <Text className="coupon-name">{coupon.name}</Text>
                  <Text className="coupon-time expired-text">已过期</Text>
                </View>
              </View>
            ))}
            {getCurrentCoupons().length === 0 && (
              <View className="empty-state"><Text>暂无已过期优惠券</Text></View>
            )}
          </View>
        </TabPane>
      </Tabs>
    </View>
  )
}