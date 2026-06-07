import { useState, useEffect } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import { request } from '@/utils/request'
import './index.scss'

interface Course {
  id: string
  title: string
  subtitle?: string
  coverImage?: string
  duration?: number
  type: number
  type_text?: string
  categoryType?: string
  viewCount?: number
  memberLevel?: number
}

interface CoursesResponse {
  list: Course[]
  count: number
  page: number
  pageSize: number
}

const TABS = [
  { key: '免费', label: '免费科普课' },
  { key: '会员', label: '会员专享课' },
  { key: '配套', label: '配套课程' },
]

export default function CourseList() {
  const [activeTab, setActiveTab] = useState('免费')
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [memberLevel, setMemberLevel] = useState(0)

  useEffect(() => {
    // 读取用户会员等级
    const level = Taro.getStorageSync('memberLevel') || 0
    setMemberLevel(level)
    loadCourses()
  }, [activeTab])

  const loadCourses = async () => {
    try {
      setLoading(true)
      const categoryMap: Record<string, string> = { '免费': '免费', '会员': '会员', '配套': '配套' }
      const res = await request<CoursesResponse>(`/courses?categoryType=${categoryMap[activeTab]}&pageSize=20`)
      setCourses(Array.isArray(res.list) ? res.list : [])
    } catch (err) {
      console.error('获取课程列表失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const getImageUrl = (url?: string) => {
    if (!url) return '/assets/images/course-placeholder.jpg'
    if (url.startsWith('http')) return url
    return `http://localhost:3000${url}`
  }

  const canWatch = (course: Course) => {
    if (course.type === 1 || !course.memberLevel) return true // 免费课
    return memberLevel >= (course.memberLevel || 0)
  }

  const getTagText = (course: Course) => {
    if (course.type === 1) return '免费'
    if (course.type === 3) return '购买产品解锁'
    const levelMap: Record<number, string> = { 1: '银卡专享', 2: '金卡专享' }
    return levelMap[course.memberLevel || 0] || '会员专享'
  }

  const getTagClass = (course: Course) => {
    if (course.type === 1) return 'free'
    if (course.type === 3) return 'bundle'
    return 'member'
  }

  return (
    <View className="course-list-page">
     <View className="header-banner">
        <Image src="/assets/images/course-banner.jpg" className="banner-image" />
        <View className="banner-overlay">
          <Text className="banner-title">养生课堂</Text>
          <Text className="banner-subtitle">专业讲师讲解，养生知识轻松学</Text>
        </View>
      </View>

      {/*分类Tab */}
      <ScrollView scrollX className="course-tabs">
        {TABS.map(tab => (
          <View
            key={tab.key}
            className={`course-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <Text>{tab.label}</Text>
          </View>
        ))}
      </ScrollView>

      {/* 课程列表 */}
      <ScrollView scrollY className="course-list">
        {loading ? (
          <View className="loading-container">
            <Text className="loading-text">加载中...</Text>
          </View>
        ) : courses.length === 0 ? (
          <View className="empty-state">
            <Text className="empty-text">暂无课程</Text>
          </View>
        ) : (
          courses.map(course => (
            <View
              key={course.id}
              className="course-card"
              onClick={() => Taro.navigateTo({ url: `/pages/course/detail?id=${course.id}` })}
            >
              <Image src={getImageUrl(course.coverImage)} className="course-cover" mode="aspectFill" />
              <View className="course-info">
                <Text className="course-title">{course.title}</Text>
                <View className="course-meta">
                  {course.duration && (
                    <Text className="course-duration">{Math.floor(course.duration / 60)}分钟</Text>
                  )}
                  {course.viewCount !== undefined && (
                    <Text className="course-views">{course.viewCount}人学习</Text>
                  )}
                </View>
              </View>
              <View className={`course-tag ${getTagClass(course)}`}>
                <Text>{getTagText(course)}</Text>
              </View>
              {!canWatch(course) && (
                <View className="member-lock">
                  <Text className="lock-text">开通会员观看</Text>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  )
}