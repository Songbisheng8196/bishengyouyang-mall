import { useState } from 'react'
import { View, Text } from '@tarojs/taro'
import './index.scss'

// 模拟积分记录
const MOCK_RECORDS = [
  { id: '1', type: 1, points: 5, description: '每日签到', createTime: '2024-06-05 09:00' },
  { id: '2', type: 5, points: 3, description: '产品食用打卡', createTime: '2024-06-04 20:30' },
  { id: '3', type: 2, points: 128, description: '订单消费返积分', createTime: '2024-06-03 15:20' },
  { id: '4', type: 4, points: 20, description: '完成课程学习', createTime: '2024-06-02 18:00' },
]

const TYPE_NAMES = { 1: '签到', 2: '消费', 3: '分享', 4: '学习', 5: '打卡' }

export default function Points() {
  const [balance] = useState(428)
  const [records] = useState(MOCK_RECORDS)
  
  return (
    <View className="points-page">
      {/* 积分余额 */}
      <View className="balance-section">
        <Text className="balance-label">当前积分</Text>
        <Text className="balance-value">{balance}</Text>
      </View>
      
      {/* 积分规则 */}
      <View className="rules-section">
        <Text className="section-title">积分规则</Text>
        <View className="rules-list">
          <View className="rule-item">
            <Text className="rule-points">+5</Text>
            <Text className="rule-desc">每日签到</Text>
          </View>
          <View className="rule-item">
            <Text className="rule-points">+3</Text>
            <Text className="rule-desc">日常打卡</Text>
          </View>
          <View className="rule-item">
            <Text className="rule-points">+20</Text>
            <Text className="rule-desc">课程学习</Text>
          </View>
          <View className="rule-item">
            <Text className="rule-points">+10</Text>
            <Text className="rule-desc">分享好友</Text>
          </View>
        </View>
      </View>
      
      {/* 积分记录 */}
      <View className="records-section">
        <Text className="section-title">积分明细</Text>
        <View className="records-list">
          {records.map(record => (
            <View key={record.id} className="record-item">
              <View className="record-info">
                <Text className="record-desc">{record.description}</Text>
                <Text className="record-time">{record.createTime}</Text>
              </View>
              <Text className={`record-points ${record.points > 0 ? 'plus' : 'minus'}`}>
                {record.points > 0 ? '+' : ''}{record.points}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}