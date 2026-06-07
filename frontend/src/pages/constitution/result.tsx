import { useState, useEffect } from 'react'
import { View, Text, Button } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import { request } from '@/utils/request'
import './result.scss'

interface RecommendResponse {
  type: string
  typeName: string
  description: string
  score: number
  color: string
  suggestions: string[]
  products: Array<{
    id: string
    name: string
    price: number
    image: string
    reason: string
  }>
  recipes: Array<{
    name: string
    ingredients: string[]
    tips: string
  }>
  courses: Array<{
    id: string
    name: string
    cover: string
    description: string
  }>
}

export default function ConstitutionResult() {
  const [result, setResult] = useState<RecommendResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResult()
  }, [])

  const fetchResult = async () => {
    try {
      setLoading(true)
      
      // Get constitution type from storage (set by question page after submission)
      const storedResult = Taro.getStorageSync('constitutionResult')
      if (!storedResult) {
        Taro.showToast({ title: '未找到测评结果', icon: 'none' })
        return
      }

      const { type } = storedResult

      // Fetch detailed recommendation data
      const res = await request<RecommendResponse>(`/constitution/recommend?type=${type}`)
      setResult(res)
    } catch (err) {
      console.error('获取结果失败:', err)
      Taro.showToast({ title: '获取结果失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  const handleViewRecommend = () => {
    if (!result) return
    Taro.navigateTo({ url: `/pages/constitution/recommend?type=${result.type}` })
  }

  const handleRetest = () => {
    // Clear stored result
    Taro.removeStorageSync('constitutionResult')
    Taro.redirectTo({ url: '/pages/constitution/question' })
  }

  // Loading state
  if (loading) {
    return (
      <View className="result-page">
        <View className="loading-container">
          <Text className="loading-text">加载中...</Text>
        </View>
      </View>
    )
  }

  // Empty state
  if (!result) {
    return (
      <View className="result-page">
        <View className="loading-container">
          <Text className="loading-text">未找到测评结果</Text>
          <Button className="retest-btn" onClick={handleRetest}>重新测评</Button>
        </View>
      </View>
    )
  }

  return (
    <View className="result-page">
      <View className="result-card" style={{ backgroundColor: result.color || '#A8D5BA' }}>
        <View className="result-header">
          <Text className="result-label">您的体质类型</Text>
          <View className="result-badge">
            <Text className="badge-text">已完成</Text>
          </View>
        </View>
        <View className="result-type">
          <Text className="type-name">{result.typeName}</Text>
          <Text className="type-score">匹配度 {result.score}%</Text>
        </View>
      </View>

      <View className="desc-section">
        <Text className="section-title">体质解读</Text>
        <Text className="desc-text">{result.description}</Text>
      </View>

      <View className="suggestions-section">
        <Text className="section-title">日常调理建议</Text>
        <View className="suggestions-list">
          {result.suggestions?.map((item, index) => (
            <View key={index} className="suggestion-item">
              <View className="suggestion-num">
                <Text>{index + 1}</Text>
              </View>
              <Text className="suggestion-text">{item}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 推荐课程 */}
      {result.courses && result.courses.length > 0 && (
        <View className="courses-section">
          <Text className="section-title">推荐课程</Text>
          <View className="courses-list">
            {result.courses.map((course, index) => (
              <View key={index} className="course-item" onClick={() => Taro.navigateTo({ url: `/pages/course/detail?id=${course.id}` })}>
                <View className="course-info">
                  <Text className="course-name">{course.name}</Text>
                  <Text className="course-desc">{course.description}</Text>
                </View>
                <Text className="course-arrow">›</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View className="action-section">
        <View className="action-btn primary" onClick={handleViewRecommend}>
          <Text>查看完整方案</Text>
        </View>
        <View className="action-btn secondary" onClick={handleRetest}>
          <Text>重新测评</Text>
        </View>
      </View>

      {/* 合规免责文案 */}
      <View className="compliance-notice">
        <Text className="notice-text">⚠️ 测评结果仅日常膳食参考，非医疗诊断，身体不适请及时就医。</Text>
      </View>
    </View>
  )
}