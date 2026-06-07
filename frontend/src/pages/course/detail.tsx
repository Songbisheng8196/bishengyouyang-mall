import { useState, useEffect } from 'react'
import { View, Text, Image, Button } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import { request } from '@/utils/request'
import './index.scss'

interface CourseDetail {
  id: string
  title: string
  subtitle?: string
  coverImage?: string
  videoUrl?: string
  duration?: number
  type: number
  type_text?: string
  categoryType?: string
  memberLevel?: number
  description?: string
  chapters?: Array<{ id: number; title: string; startTime?: string; content?: string }>
  script?: string
  viewCount?: number
  canWatch?: boolean
  compliance_notice?: string
}

export default function CourseDetail() {
  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [memberLevel, setMemberLevel] = useState(0)

  useEffect(() => {
    const level = Taro.getStorageSync('memberLevel') || 0
    setMemberLevel(level)
    fetchCourse()
  }, [])

  const fetchCourse = async () => {
    try {
      setLoading(true)
      const id = (Taro.getCurrentInstance() as any).router?.params?.id || '1'
      const res = await request<CourseDetail>(`/courses/${id}`)
      setCourse(res)
    } catch (err) {
      console.error('获取课程详情失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const getImageUrl = (url?: string) => {
    if (!url) return '/assets/images/course-placeholder.jpg'
    if (url.startsWith('http')) return url
    return `http://localhost:3000${url}`
  }

  const canWatch = () => {
    if (!course) return false
    if (course.type === 1 || !course.memberLevel) return true
    return memberLevel >= (course.memberLevel || 0)
  }

  const handleStartLearn = () => {
    if (!course) return
    if (!canWatch()) {
      Taro.showToast({ title: '开通会员后可观看', icon: 'none' })
      return
    }
    Taro.navigateTo({ url: `/pages/course/player?id=${course.id}` })
  }

  if (loading) {
    return (
      <View className="course-detail-page">
        <View className="loading-container">
          <Text className="loading-text">加载中...</Text>
        </View>
      </View>
    )
  }

  if (!course) {
    return (
      <View className="course-detail-page">
        <View className="loading-container">
          <Text className="loading-text">课程不存在</Text>
        </View>
      </View>
    )
  }

  return (
    <View className="course-detail-page">
      {/* 封面区域 */}
      <View className="course-cover-section">
        <Image src={getImageUrl(course.coverImage)} className="cover-image" mode="aspectFill" />
        {!canWatch() && (
          <View className="member-mask">
            <Text className="member-mask-text">银卡会员可观看</Text>
          </View>
        )}
        <View className="play-btn" onClick={handleStartLearn}>
          <Text className="play-icon">▶</Text>
        </View>
      </View>

      {/* 课程信息 */}
      <View className="course-info-section">
        <Text className="course-title">{course.title}</Text>
        {course.subtitle && <Text className="course-subtitle">{course.subtitle}</Text>}
        <View className="course-meta">
          {course.duration && (
            <Text className="meta-item">{Math.floor(course.duration / 60)}分钟</Text>
          )}
          {course.chapters?.length && (
            <Text className="meta-item">|</Text>
          )}
          {course.chapters?.length && (
            <Text className="meta-item">{course.chapters.length}章节</Text>
          )}
          {course.viewCount !== undefined && (
            <>
              <Text className="meta-item">|</Text>
              <Text className="meta-item">{course.viewCount}人学习</Text>
            </>
          )}
        </View>
        {course.description && (
          <Text className="course-desc">{course.description}</Text>
        )}
      </View>

      {/* 章节目录 */}
      {course.chapters && course.chapters.length > 0 && (
        <View className="chapters-section">
          <View className="section-header">
            <Text className="section-title">课程目录</Text>
          </View>
          <View className="chapters-list">
            {course.chapters.map((chapter, index) => (
              <View key={chapter.id || index} className="chapter-item">
                <View className="chapter-num">
                  <Text>{index + 1}</Text>
                </View>
                <View className="chapter-info">
                  <Text className="chapter-title">{chapter.title}</Text>
                  {chapter.startTime && (
                    <Text className="chapter-duration">{chapter.startTime}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* 合规免责文案 */}
      <View className="compliance-notice">
        <Text className="notice-text">
          {course.compliance_notice || '⚠️ 本课程内容仅作日常养生参考，非医疗诊断，身体不适请及时就医。'}
        </Text>
      </View>

      {/* 开始学习按钮 */}
      <View className="action-section">
        <Button className="start-btn" onClick={handleStartLearn}>
          <Text>{canWatch() ? '开始学习' : '开通会员观看'}</Text>
        </Button>
      </View>
    </View>
  )
}