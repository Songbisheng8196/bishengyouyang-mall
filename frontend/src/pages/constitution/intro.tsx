import { View, Text, Image } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import './index.scss'

const CONSTITUTION_TYPES = [
  { name: '气虚质', color: '#A8D5BA', desc: '气短懒言，容易疲乏' },
  { name: '血虚质', color: '#EAA78B', desc: '面色苍白，头晕心悸' },
  { name: '阴虚质', color: '#B8D4E8', desc: '手足心热，口干咽燥' },
  { name: '阳虚质', color: '#D4A5D4', desc: '畏寒肢冷，精神不振' },
  { name: '平和质', color: '#F5C77E', desc: '阴阳平衡，健康体质' },
]

export default function ConstitutionIntro() {
  return (
    <View className="intro-page">
      <View className="intro-banner">
        <Image src="/assets/images/constitution-banner.jpg" className="banner-image" />
        <View className="banner-overlay">
          <Text className="banner-title">中医体质测评</Text>
          <Text className="banner-subtitle">了解您的体质特点，定制专属食补方案</Text>
        </View>
      </View>
      <View className="types-section">
        <Text className="section-title">五种体质类型</Text>
        <View className="types-grid">
          {CONSTITUTION_TYPES.map((type, index) => (
            <View key={index} className="type-card" style={{ borderColor: type.color }}>
              <View className="type-header" style={{ backgroundColor: type.color }}>
                <Text className="type-name">{type.name}</Text>
              </View>
              <Text className="type-desc">{type.desc}</Text>
            </View>
          ))}
        </View>
      </View>
      <View className="process-section">
        <Text className="section-title">测评流程</Text>
        <View className="process-steps">
          <View className="step-item"><View className="step-num"><Text>1</Text></View><View className="step-content"><Text className="step-title">回答问卷</Text><Text className="step-desc">完成20道选择题</Text></View></View>
          <View className="step-arrow"><Text>→</Text></View>
          <View className="step-item"><View className="step-num"><Text>2</Text></View><View className="step-content"><Text className="step-title">获取结果</Text><Text className="step-desc">了解您的体质类型</Text></View></View>
          <View className="step-arrow"><Text>→</Text></View>
          <View className="step-item"><View className="step-num"><Text>3</Text></View><View className="step-content"><Text className="step-title">推荐方案</Text><Text className="step-desc">获得专属食补建议</Text></View></View>
        </View>
      </View>
      <View className="start-section">
        <View className="start-btn" onClick={() => Taro.navigateTo({ url: '/pages/constitution/question' })}>
          <Text className="btn-text">开始测评</Text>
        </View>
      </View>
      {/* ⚠️ 合规免责文案：测评结果仅日常膳食参考，非医疗诊断，身体不适请及时就医。 */}
      <View className="compliance-notice">
        <Text className="notice-text">⚠️ 测评结果仅日常膳食参考，非医疗诊断，身体不适请及时就医。</Text>
      </View>
    </View>
  )
}