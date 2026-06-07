import { useState } from 'react'
import { View, Text, Image } from '@tarojs/taro'
import './index.scss'

// 模拟月度小结数据
const MOCK_SUMMARY = {
  month: '2024-06',
  totalDays: 28,
  totalPoints: 186,
  continueDays: 7,
  records: [
    { type: 1, name: '产品食用', count: 15 },
    { type: 2, name: '饮水', count: 56 },
    { type: 3, name: '作息', count: 20 },
  ],
  calendar: [
    // 模拟日历数据
  ]
}

export default function CheckinSummary() {
  const [summary] = useState(MOCK_SUMMARY)
  
  return (
    <View className="summary-page">
      {/* 月度统计卡片 */}
      <View className="stats-card">
        <View className="stats-header">
          <Text className="month-text">{summary.month}</Text>
          <Text className="month-label">月度小结</Text>
        </View>
        <View className="stats-grid">
          <View className="stat-item">
            <Text className="stat-value">{summary.totalDays}</Text>
            <Text className="stat-label">打卡天数</Text>
          </View>
          <View className="stat-item">
            <Text className="stat-value">{summary.continueDays}</Text>
            <Text className="stat-label">连续天数</Text>
          </View>
          <View className="stat-item">
            <Text className="stat-value">{summary.totalPoints}</Text>
            <Text className="stat-label">获得积分</Text>
          </View>
        </View>
      </View>
      
      {/* 打卡类型统计 */}
      <View className="types-section">
        <Text className="section-title">打卡类型统计</Text>
        <View className="types-list">
          {summary.records.map(record => (
            <View key={record.type} className="type-item">
              <View className="type-info">
                <Text className="type-name">{record.name}</Text>
                <Text className="type-count">{record.count}次</Text>
              </View>
              <View className="type-bar">
                <View className="bar-fill" style={{ width: `${(record.count / 60) * 100}%` }} />
              </View>
            </View>
          ))}
        </View>
      </View>
      
      {/* 打卡日历 */}
      <View className="calendar-section">
        <Text className="section-title">打卡日历</Text>
        <View className="calendar-grid">
          {['日', '一', '二', '三', '四', '五', '六'].map(day => (
            <View key={day} className="weekday">{day}</View>
          ))}
          {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
            <View key={day} className={`day-item ${day <= 28 ? 'checked' : ''}`}>
              <Text className="day-num">{day}</Text>
              {day <= 28 && <View className="check-dot" />}
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}