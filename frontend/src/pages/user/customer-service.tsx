import { useState } from 'react'
import { View, Text } from '@tarojs/taro'
import './index.scss'

export default function CustomerService() {
  return (
    <View className="service-page">
      <View className="service-intro">
        <Text className="intro-title">在线客服</Text>
        <Text className="intro-desc">客服工作时间为 9:00-21:00</Text>
      </View>
      
      {/* 占位框架 */}
      <View className="placeholder-section">
        <View className="placeholder-card">
          <Text className="placeholder-text">在线客服功能占位</Text>
          <Text className="placeholder-desc">实际接入客服系统（如企点客服、美洽等）</Text>
        </View>
        
        <View className="contact-options">
          <View className="contact-item">
            <Text className="contact-label">电话客服</Text>
            <Text className="contact-value">400-xxx-xxxx</Text>
          </View>
          <View className="contact-item">
            <Text className="contact-label">微信公众号</Text>
            <Text className="contact-value">毕生优养</Text>
          </View>
        </View>
      </View>
    </View>
  )
}