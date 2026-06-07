import { useState } from 'react'
import { View, Text, Image, Button } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import './index.scss'

// 模拟沙龙活动
const MOCK_SALONS = [
  { id: '1', title: '夏季养生分享会', date: '2024-06-15', time: '14:00', location: '武汉市江汉区', status: 0, registered: 15, capacity: 30 },
]

export default function CityIndex() {
  const [salons] = useState(MOCK_SALONS)
  
  const handleSalonReserve = () => {
    Taro.navigateTo({ url: '/pages/city/salon' })
  }
  
  const handleStoreMap = () => {
    Taro.navigateTo({ url: '/pages/city/stores' })
  }
  
  const handleGroupBuy = () => {
    Taro.navigateTo({ url: '/pages/city/group-buy' })
  }
  
  return (
    <View className="city-page">
      {/* 顶部Banner */}
      <View className="city-banner">
        <Image src="/assets/images/city-banner.jpg" className="banner-image" />
        <View className="banner-overlay">
          <Text className="banner-title">武汉同城</Text>
          <Text className="banner-subtitle">养生沙龙·门店地图·拼团购</Text>
        </View>
      </View>
      
      {/* 功能入口 */}
      <View className="entry-section">
        <View className="entry-item" onClick={handleSalonReserve}>
          <Image src="/assets/images/city-salon.png" className="entry-icon" />
          <Text className="entry-title">沙龙预约</Text>
          <Text className="entry-desc">线下养生分享会</Text>
        </View>
        <View className="entry-item" onClick={handleStoreMap}>
          <Image src="/assets/images/city-store.png" className="entry-icon" />
          <Text className="entry-title">门店地图</Text>
          <Text className="entry-desc">到店自提更便捷</Text>
        </View>
        <View className="entry-item" onClick={handleGroupBuy}>
          <Image src="/assets/images/city-group.png" className="entry-icon" />
          <Text className="entry-title">拼团购</Text>
          <Text className="entry-desc">武汉用户专享</Text>
        </View>
      </View>
      
      {/* 沙龙活动 */}
      <View className="salon-section">
        <View className="section-header">
          <Text className="section-title">近期沙龙</Text>
          <Text className="section-more" onClick={handleSalonReserve}>查看全部 ></Text>
        </View>
        {salons.map(salon => (
          <View key={salon.id} className="salon-card">
            <View className="salon-info">
              <Text className="salon-title">{salon.title}</Text>
              <View className="salon-meta">
                <Text className="meta-item">{salon.date} {salon.time}</Text>
                <Text className="meta-item">{salon.location}</Text>
              </View>
              <View className="salon-status">
                <Text className="status-text">{salon.registered}/{salon.capacity}人已报名</Text>
              </View>
            </View>
            <View className="salon-action">
              <Button className="reserve-btn" onClick={handleSalonReserve}>立即预约</Button>
            </View>
          </View>
        ))}
      </View>
      
      {/* 门店推荐 */}
      <View className="store-section">
        <View className="section-header">
          <Text className="section-title">推荐门店</Text>
          <Text className="section-more" onClick={handleStoreMap}>查看全部 ></Text>
        </View>
        <View className="store-list">
          <View className="store-card" onClick={handleStoreMap}>
            <Image src="/assets/images/store-1.jpg" className="store-image" />
            <View className="store-info">
              <Text className="store-name">江汉路旗舰店</Text>
              <Text className="store-address">江汉区建设大道xxx号</Text>
              <Text className="store-distance">1.2km</Text>
            </View>
          </View>
          <View className="store-card" onClick={handleStoreMap}>
            <Image src="/assets/images/store-2.jpg" className="store-image" />
            <View className="store-info">
              <Text className="store-name">光谷体验店</Text>
              <Text className="store-address">洪山区光谷广场xxx号</Text>
              <Text className="store-distance">3.5km</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}