import { useState } from 'react'
import { View, Text } from '@tarojs/taro'
import './index.scss'

// 模拟打卡记录
const MOCK_RECORDS = [
  { id: '1', type: 1, typeName: '产品食用', content: '今日服用花养膏1次', points: 3, createTime: '2024-06-05 20:30' },
  { id: '2', type: 2, typeName: '饮水', content: '今日饮水8杯', points: 3, createTime: '2024-06-05 21:00' },
  { id: '3', type: 3, typeName: '作息', content: '早睡早起，睡眠质量良好', points: 3, createTime: '2024-06-04 22:30' },
]

export default function CheckinHistory() {
  const [records] = useState(MOCK_RECORDS)
  
  return (
    <View className="checkin-history-page">
      <View className="records-list">
        {records.map(record => (
          <View key={record.id} className="record-card">
            <View className="record-header">
              <Text className="record-type">{record.typeName}</Text>
              <Text className="record-points">+{record.points}积分</Text>
            </View>
            <Text className="record-content">{record.content}</Text>
            <Text className="record-time">{record.createTime}</Text>
          </View>
        ))}
        
        {records.length === 0 && (
          <View className="empty-state">
            <Text>暂无打卡记录</Text>
          </View>
        )}
      </View>
    </View>
  )
}