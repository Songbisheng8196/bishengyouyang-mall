import { useState } from 'react'
import { View, Text, Input, Button } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import './index.scss'

// 模拟沙龙活动
const MOCK_SALON = {
  id: '1',
  title: '夏季养生分享会',
  date: '2024-06-15',
  time: '14:00',
  location: '武汉市江汉区建设大道xxx号',
  capacity: 30,
  registered: 15,
}

export default function SalonReserve() {
  const [salon] = useState(MOCK_SALON)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleSubmit = async () => {
    if (!name.trim()) {
      Taro.showToast({ title: '请输入姓名', icon: 'none' })
      return
    }
    if (!phone.trim()) {
      Taro.showToast({ title: '请输入手机号', icon: 'none' })
      return
    }
    
    setIsSubmitting(true)
    
    // TODO: 调用API提交预约
    // await reserveSalon({ salonId: salon.id, name, phone, note })
    
    setTimeout(() => {
      setIsSubmitting(false)
      Taro.showToast({ title: '预约成功', icon: 'success' })
      setTimeout(() => Taro.navigateBack(), 1000)
    }, 1000)
  }
  
  return (
    <View className="salon-page">
      {/* 沙龙信息 */}
      <View className="salon-info-section">
        <Text className="salon-title">{salon.title}</Text>
        <View className="salon-meta">
          <View className="meta-item">
            <Text className="meta-label">时间</Text>
            <Text className="meta-value">{salon.date} {salon.time}</Text>
          </View>
          <View className="meta-item">
            <Text className="meta-label">地点</Text>
            <Text className="meta-value">{salon.location}</Text>
          </View>
          <View className="meta-item">
            <Text className="meta-label">名额</Text>
            <Text className="meta-value">{salon.registered}/{salon.capacity}人</Text>
          </View>
        </View>
      </View>
      
      {/* 预约表单 */}
      <View className="form-section">
        <View className="form-item">
          <Text className="form-label">姓名</Text>
          <Input
            className="form-input"
            placeholder="请输入您的姓名"
            value={name}
            onInput={(e) => setName(e.detail.value)}
          />
        </View>
        <View className="form-item">
          <Text className="form-label">手机号</Text>
          <Input
            className="form-input"
            type="number"
            placeholder="请输入您的手机号"
            value={phone}
            onInput={(e) => setPhone(e.detail.value)}
            maxlength={11}
          />
        </View>
        <View className="form-item">
          <Text className="form-label">备注</Text>
          <Input
            className="form-input"
            placeholder="选填，可备注特殊需求"
            value={note}
            onInput={(e) => setNote(e.detail.value)}
          />
        </View>
      </View>
      
      {/* 提交按钮 */}
      <View className="submit-section">
        <Button 
          className="submit-btn"
          loading={isSubmitting}
          onClick={handleSubmit}
        >
          <Text>提交预约</Text>
        </Button>
      </View>
    </View>
  )
}