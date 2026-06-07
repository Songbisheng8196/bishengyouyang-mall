import { useState } from 'react'
import { View, Text, Image, Button } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import './index.scss'

// 模拟拼团列表
const MOCK_GROUP_BUYS = [
  { 
    id: '1', 
    productId: '1',
    productName: '花养膏·红枣枸杞味', 
    productImage: '/assets/images/product-1.jpg',
    originalPrice: 168,
    groupPrice: 128,
    groupSize: 3,
    currentCount: 2,
    endTime: '2024-06-10 18:00',
    status: 0,
  },
]

export default function GroupBuy() {
  const [groupBuys] = useState(MOCK_GROUP_BUYS)
  
  const handleJoinGroup = (groupBuyId: string) => {
    Taro.navigateTo({ url: `/pages/order/confirm?groupBuyId=${groupBuyId}` })
  }
  
  const handleProductClick = (productId: string) => {
    Taro.navigateTo({ url: `/pages/product/detail?id=${productId}` })
  }
  
  return (
    <View className="group-buy-page">
      {/* 武汉区域提示 */}
      <View className="city-tip">
        <Text className="tip-text">武汉区域用户专享拼团活动</Text>
      </View>
      
      {/* 拼团列表 */}
      <View className="group-list">
        {groupBuys.map(group => (
          <View key={group.id} className="group-card">
            <View className="product-info" onClick={() => handleProductClick(group.productId)}>
              <Image src={group.productImage} className="product-image" />
              <View className="product-detail">
                <Text className="product-name">{group.productName}</Text>
                <View className="price-row">
                  <Text className="group-price">¥{group.groupPrice}</Text>
                  <Text className="original-price">¥{group.originalPrice}</Text>
                </View>
              </View>
            </View>
            
            <View className="group-status">
              <View className="progress-info">
                <Text className="progress-text">还差 {group.groupSize - group.currentCount} 人成团</Text>
                <View className="progress-bar">
                  <View className="progress-fill" style={{ width: `${(group.currentCount / group.groupSize) * 100}%` }} />
                </View>
              </View>
              <View className="group-time">
                <Text className="time-label">剩余时间</Text>
                <Text className="time-value">{group.endTime}</Text>
              </View>
            </View>
            
            <Button className="join-btn" onClick={() => handleJoinGroup(group.id)}>
              <Text>参与拼团</Text>
            </Button>
          </View>
        ))}
        
        {groupBuys.length === 0 && (
          <View className="empty-state">
            <Text>暂无可参与的拼团活动</Text>
          </View>
        )}
      </View>
      
      {/* 占位说明 */}
      <View className="placeholder-notice">
        <Text className="notice-text">拼团活动由后台配置，武汉区域用户专享</Text>
      </View>
    </View>
  )
}