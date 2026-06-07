import { useState } from 'react'
import { View, Text, Image } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import './index.scss'

const CHECKIN_TYPES = [
  { id: 1, name: '产品食用', icon: 'product.png', unit: '次', color: '#EAA78B' },
  { id: 2, name: '饮水', icon: 'water.png', unit: '杯', color: '#A8D5BA' },
  { id: 3, name: '作息', icon: 'sleep.png', unit: '次', color: '#B8D4E8' },
]

const MOCK_STATS = { totalDays: 28, continueDays: 7, totalPoints: 186, todayCompleted: [true, true, false] }

export default function Checkin() {
  const [stats] = useState(MOCK_STATS)

  return (
    <View className="checkin-page">
      <View className="stats-card">
        <View className="stats-header">
          <Text className="stats-title">打卡数据</Text>
          <Text className="stats-more" onClick={() => { const now = new Date(); const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`; Taro.navigateTo({ url: `/pages/checkin/summary?month=${month}` }) }}>月度小结</Text>
        </View>
        <View className="stats-content">
          <View className="stat-item"><Text className="stat-value">{stats.totalDays}</Text><Text className="stat-label">累计天数</Text></View>
          <View className="stat-divider" />
          <View className="stat-item"><Text className="stat-value">{stats.continueDays}</Text><Text className="stat-label">连续天数</Text></View>
          <View className="stat-divider" />
          <View className="stat-item"><Text className="stat-value">{stats.totalPoints}</Text><Text className="stat-label">累计积分</Text></View>
        </View>
      </View>
      <View className="today-section">
        <View className="section-header"><Text className="section-title">今日打卡</Text><Text className="section-date">{new Date().toLocaleDateString()}</Text></View>
        <View className="checkin-types">
          {CHECKIN_TYPES.map((type, index) => (
            <View key={type.id} className={`checkin-type-item ${stats.todayCompleted[index] ? 'completed' : ''}`} onClick={() => Taro.navigateTo({ url: `/pages/checkin/record?type=${type.id}` })}>
              <View className="type-icon" style={{ backgroundColor: type.color }}>
                <Image src={`/assets/images/${type.icon}`} />
                {stats.todayCompleted[index] && <View className="completed-badge"><Text>✓</Text></View>}
              </View>
              <Text className="type-name">{type.name}</Text>
              <Text className="type-hint">点击记录</Text>
            </View>
          ))}
        </View>
      </View>
      <View className="rules-section">
        <View className="section-header"><Text className="section-title">积分规则</Text></View>
        <View className="rules-list">
          <View className="rule-item"><Text className="rule-points">+5</Text><Text className="rule-desc">每日签到</Text></View>
          <View className="rule-item"><Text className="rule-points">+3</Text><Text className="rule-desc">日常打卡</Text></View>
          <View className="rule-item"><Text className="rule-points">+20</Text><Text className="rule-desc">课程学习</Text></View>
          <View className="rule-item"><Text className="rule-points">+10</Text><Text className="rule-desc">分享好友</Text></View>
        </View>
      </View>
      {/* 🍵 合规标注：本品为普通食品，仅作日常食补食用。 */}
    </View>
  )
}