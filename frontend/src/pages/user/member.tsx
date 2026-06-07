import { useState } from 'react'
import { View, Text, Button } from '@tarojs/taro'
import './index.scss'

// 会员等级配置
const MEMBER_LEVELS = [
  { level: 0, name: '普通会员', discount: '无折扣', color: '#999999', benefits: ['基础购物权益', '参与打卡活动', '查看测评报告'] },
  { level: 1, name: '银卡会员', discount: '9.5折', color: '#C0C0C0', benefits: ['全场9.5折优惠', '免费观看银卡课程', '专属生日礼包', '优先客服响应'] },
  { level: 2, name: '金卡会员', discount: '9折', color: '#FFD700', benefits: ['全场9折优惠', '免费观看全部课程', '专属养生顾问', '优先发货权益', '专属会员日活动'] },
]

export default function Member() {
  const [currentLevel, setCurrentLevel] = useState(0)
  
  const handleUpgrade = () => {
    // TODO: 跳转到会员升级页面
  }
  
  return (
    <View className="member-page">
      {/* 当前会员等级 */}
      <View className="current-level" style={{ backgroundColor: MEMBER_LEVELS[currentLevel].color }}>
        <Text className="level-name">{MEMBER_LEVELS[currentLevel].name}</Text>
        <Text className="level-discount">购物折扣：{MEMBER_LEVELS[currentLevel].discount}</Text>
      </View>
      
      {/* 会员等级对比 */}
      <View className="levels-section">
        <Text className="section-title">会员等级</Text>
        <View className="levels-grid">
          {MEMBER_LEVELS.map((level, index) => (
            <View key={level.level} className={`level-card ${currentLevel === level.level ? 'current' : ''}`}>
              <View className="level-header" style={{ backgroundColor: level.color }}>
                <Text className="level-title">{level.name}</Text>
              </View>
              <View className="level-content">
                <Text className="level-discount-text">购物折扣：{level.discount}</Text>
                <View className="level-benefits">
                  {level.benefits.map((benefit, i) => (
                    <View key={i} className="benefit-item">
                      <Text className="benefit-text">✓ {benefit}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
      
      {/* 升级提示 */}
      {currentLevel < 2 && (
        <View className="upgrade-section">
          <View className="upgrade-info">
            <Text className="upgrade-title">升级{currentLevel === 0 ? '银卡' : '金卡'}会员</Text>
            <Text className="upgrade-desc">享受更多专属权益和购物优惠</Text>
          </View>
          <Button className="upgrade-btn" onClick={handleUpgrade}>
            <Text>立即升级</Text>
          </Button>
        </View>
      )}
      
      {/* 🍵 合规标注：会员权益仅供参考，实际服务内容以平台最新公告为准。 */}
      <View className="compliance-notice">
        <Text className="notice-text">🍵 会员权益仅供参考，实际服务内容以平台最新公告为准。</Text>
      </View>
    </View>
  )
}