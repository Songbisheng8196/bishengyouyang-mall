import { useState } from 'react'
import { View, Text, Image } from '@tarojs/taro'
import './index.scss'

// 模拟门店列表
const MOCK_STORES = [
  { id: '1', name: '江汉路旗舰店', address: '江汉区建设大道xxx号', phone: '027-88888888', distance: '1.2km', image: '/assets/images/store-1.jpg' },
  { id: '2', name: '光谷体验店', address: '洪山区光谷广场xxx号', phone: '027-88888889', distance: '3.5km', image: '/assets/images/store-2.jpg' },
  { id: '3', name: '汉街形象店', address: '武昌区楚河汉街xxx号', phone: '027-88888890', distance: '5.8km', image: '/assets/images/store-3.jpg' },
]

export default function Stores() {
  const [stores] = useState(MOCK_STORES)
  
  const handleStoreClick = (storeId: string) => {
    // TODO: 跳转到门店详情
  }
  
  const handleCall = (phone: string) => {
    // TODO: 调用拨打电话
  }
  
  const handleNavigate = (address: string) => {
    // TODO: 调起地图导航
  }
  
  return (
    <View className="stores-page">
      <View className="stores-list">
        {stores.map(store => (
          <View key={store.id} className="store-card" onClick={() => handleStoreClick(store.id)}>
            <Image src={store.image} className="store-image" />
            <View className="store-info">
              <Text className="store-name">{store.name}</Text>
              <Text className="store-address">{store.address}</Text>
              <View className="store-meta">
                <Text className="store-distance">{store.distance}</Text>
                <Text className="store-phone">{store.phone}</Text>
              </View>
            </View>
            <View className="store-actions">
              <View className="action-btn" onClick={(e) => { e.stopPropagation(); handleCall(store.phone) }}>
                <Text>拨打电话</Text>
              </View>
              <View className="action-btn" onClick={(e) => { e.stopPropagation(); handleNavigate(store.address) }}>
                <Text>导航</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
      
      {/* 占位框架说明 */}
      <View className="placeholder-notice">
        <Text className="notice-text">门店列表占位框架，实际门店数据由后台配置</Text>
      </View>
    </View>
  )
}