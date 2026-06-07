import { useState } from 'react'
import { View, Text, Image, Map } from '@tarojs/taro'
import './index.scss'

// 模拟门店详情
const MOCK_STORE = {
  id: '1',
  name: '江汉路旗舰店',
  image: '/assets/images/store-detail.jpg',
  address: '湖北省武汉市江汉区建设大道xxx号',
  phone: '027-88888888',
  latitude: 30.5795,
  longitude: 114.2706,
  businessHours: '周一至周日 09:00-21:00',
  services: ['到店自提', '产品体验', '养生咨询'],
}

export default function StoreDetail() {
  const [store] = useState(MOCK_STORE)
  
  const handleCall = () => {
    // TODO: 调用拨打电话
  }
  
  const handleNavigate = () => {
    // TODO: 调起地图导航
  }
  
  return (
    <View className="store-detail-page">
      {/* 门店图片 */}
      <Image src={store.image} className="store-image" mode="aspectFill" />
      
      {/* 门店信息 */}
      <View className="store-info">
        <Text className="store-name">{store.name}</Text>
        <View className="info-row">
          <Text className="info-label">地址</Text>
          <Text className="info-value">{store.address}</Text>
        </View>
        <View className="info-row">
          <Text className="info-label">电话</Text>
          <Text className="info-value">{store.phone}</Text>
        </View>
        <View className="info-row">
          <Text className="info-label">营业时间</Text>
          <Text className="info-value">{store.businessHours}</Text>
        </View>
        <View className="services-row">
          {store.services.map((service, index) => (
            <View key={index} className="service-tag">
              <Text className="service-name">{service}</Text>
            </View>
          ))}
        </View>
      </View>
      
      {/* 地图 */}
      <View className="map-section">
        <Map
          className="store-map"
          latitude={store.latitude}
          longitude={store.longitude}
          markers={[{
            latitude: store.latitude,
            longitude: store.longitude,
            title: store.name,
            width: 30,
            height: 30,
          }]}
        />
      </View>
      
      {/* 操作按钮 */}
      <View className="action-section">
        <View className="action-btn" onClick={handleCall}>
          <Text>拨打电话</Text>
        </View>
        <View className="action-btn primary" onClick={handleNavigate}>
          <Text>导航到店</Text>
        </View>
      </View>
    </View>
  )
}