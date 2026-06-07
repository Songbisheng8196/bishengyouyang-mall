import { useState } from 'react'
import { View, Text, RadioGroup, Radio, Input, Button } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import './index.scss'

const AFTERSALE_TYPES = [{ id: 1, name: '退货退款' }, { id: 2, name: '换货' }, { id: 3, name: '仅退款' }]

export default function Aftersale() {
  const [type, setType] = useState(1)
  const [reason, setReason] = useState('')
  const orderId = Taro.getCurrentInstance().router?.params.orderId || ''

  return (
    <View className="aftersale-page">
      <View className="form-section">
        <Text className="form-label">售后类型</Text>
        <RadioGroup onChange={(e) => setType(Number(e.detail.value))}>
          <View className="type-list">{AFTERSALE_TYPES.map(item => (<View key={item.id} className="type-item"><Radio value={String(item.id)} checked={type === item.id} /><Text className="type-name">{item.name}</Text></View>))}</View>
        </RadioGroup>
      </View>
      <View className="form-section"><Text className="form-label">申请原因</Text><Input className="reason-input" placeholder="请详细描述您的问题..." value={reason} onInput={(e) => setReason(e.detail.value)} /></View>
      <View className="tips-section"><Text className="tips-title">温馨提示</Text><Text className="tips-text">1. 提交申请后，客服将在24小时内处理</Text><Text className="tips-text">2. 请保持手机畅通</Text></View>
      <View className="submit-section"><Button className="submit-btn"><Text>提交申请</Text></Button></View>
    </View>
  )
}