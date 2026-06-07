import { useState } from 'react'
import { View, Text, Button } from '@tarojs/taro'
import './index.scss'

// 模拟地址列表
const MOCK_ADDRESSES = [
  { id: '1', name: '张三', phone: '138****8888', province: '湖北省', city: '武汉市', district: '江汉区', detail: '建设大道xxx号', isDefault: true },
  { id: '2', name: '李四', phone: '139****9999', province: '湖北省', city: '武汉市', district: '武昌区', detail: '中南路xxx号', isDefault: false },
]

export default function Address() {
  const [addresses] = useState(MOCK_ADDRESSES)
  
  const handleAddAddress = () => {
    // TODO: 跳转到新增地址页面
  }
  
  const handleEditAddress = (addressId: string) => {
    // TODO: 跳转到编辑地址页面
  }
  
  const handleSetDefault = (addressId: string) => {
    // TODO: 设置默认地址
  }
  
  const handleDeleteAddress = (addressId: string) => {
    // TODO: 删除地址
  }
  
  return (
    <View className="address-page">
      <View className="address-list">
        {addresses.map(address => (
          <View key={address.id} className="address-card">
            <View className="address-info">
              <View className="address-header">
                <Text className="address-name">{address.name}</Text>
                <Text className="address-phone">{address.phone}</Text>
                {address.isDefault && <Text className="default-tag">默认</Text>}
              </View>
              <Text className="address-detail">{address.province}{address.city}{address.district}{address.detail}</Text>
            </View>
            <View className="address-actions">
              <Button className="action-btn" onClick={() => handleEditAddress(address.id)}>
                <Text>编辑</Text>
              </Button>
              {!address.isDefault && (
                <Button className="action-btn" onClick={() => handleSetDefault(address.id)}>
                  <Text>设为默认</Text>
                </Button>
              )}
              <Button className="action-btn delete" onClick={() => handleDeleteAddress(address.id)}>
                <Text>删除</Text>
              </Button>
            </View>
          </View>
        ))}
      </View>
      
      {/* 新增地址按钮 */}
      <View className="add-address-section">
        <Button className="add-btn" onClick={handleAddAddress}>
          <Text>+ 新增地址</Text>
        </Button>
      </View>
    </View>
  )
}