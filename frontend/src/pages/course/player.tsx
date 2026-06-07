import { useState, useEffect, useRef } from 'react'
import { View, Text, Video } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import { request } from '@/utils/request'
import './index.scss'

interface CourseDetail {
  id: string
  title: string
  coverImage?: string
  videoUrl?: string
  duration?: number
  type: number
  type_text?: string
  chapters?: Array<{ id: number; title: string; startTime?: string; content?: string }>
  canWatch?: boolean
  compliance_notice?: string
}

const PROGRESS_KEY = (id: string) => `course_progress_${id}`

export default function CoursePlayer() {
  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentChapter, setCurrentChapter] = useState(0)
  const [progress, setProgress] = useState(0)
  const videoRef = useRef<any>(null)

  useEffect(() => {
    fetchCourse()
  }, [])

  const fetchCourse = async () => {
    try {
      setLoading(true)
      const id = (Taro.getCurrentInstance() as any).router?.params?.id || '1'
      const res = await request<CourseDetail>(`/courses/${id}`)
      setCourse(res)

      // 读取保存的进度
      const saved = Taro.getStorageSync(PROGRESS_KEY(id))
      if (saved) {
        setProgress(saved.progress || 0)
        setCurrentChapter(saved.currentChapter || 0)
      }
    } catch (err) {
      console.error('获取课程信息失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const saveProgress = (prog: number, chapter: number) => {
    if (!course) return
    Taro.setStorageSync(PROGRESS_KEY(course.id), { progress: prog, currentChapter: chapter })
  }

  const handleProgressChange = (e: any) => {
    const prog = e.detail.current
    setProgress(prog)
    saveProgress(prog, currentChapter)
  }

  const handleTimeUpdate = (e: any) => {
    const current = e.detail.currentTime
    const duration = e.detail.duration
    if (duration > 0) {
      const pct = Math.round((current / duration) * 100)
      setProgress(pct)
    }
  }

  const handleChapterChange = (index: number) => {
    setCurrentChapter(index)
    if (videoRef.current) {
      // 粗略估算跳转位置（每个章节均分总时长）
      const chapters = course?.chapters || []
      if (chapters.length > 0) {
        const avgDuration = (course?.duration || 0) / chapters.length
        const seekTime = avgDuration * index
        videoRef.current.seek && videoRef.current.seek(seekTime)
      }
    }
    saveProgress(0, index)
    setProgress(0)
  }

  const getImageUrl = (url?: string) => {
    if (!url) return '/assets/images/course-placeholder.jpg'
    if (url.startsWith('http')) return url
    return `http://localhost:3000${url}`
  }

  if (loading) {
    return (
      <View className="player-page">
        <View className="loading-container"><Text className="loading-text">加载中...</Text></View>
      </View>
    )
  }

  if (!course) {
    return (
      <View className="player-page">
        <View className="loading-container"><Text className="loading-text">课程不存在</Text></View>
      </View>
    )
  }

  const chapters = course.chapters || []
  const videoUrl = course.videoUrl || ''

  return (
    <View className="player-page">
      {/* 视频播放器 */}
      <View className="video-container">
        {videoUrl ? (
          <Video
            ref={videoRef}
            className="video-player"
            src={videoUrl}
            controls
            showCenterPlayBtn
            enableProgressGesture
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => {
              // 播放结束，自动跳转下一章
              if (currentChapter < chapters.length - 1) {
                handleChapterChange(currentChapter + 1)
              }
            }}
          />
        ) : (
          <View className="video-placeholder">
            <Text className="placeholder-text">视频待生成，Phase3 将通过 Seedance AI 自动生成课程视频</Text>
          </View>
        )}
      </View>

      {/* 播放信息 */}
      <View className="player-info">
        <Text className="course-title">{course.title}</Text>
        <View className="chapter-info">
          <Text className="chapter-text">
            第{currentChapter + 1}章 / 共{chapters.length || 0}章
          </Text>
          <Text className="progress-text">进度 {progress}%</Text>
        </View>
      </View>

      {/* 章节目录 */}
      {chapters.length > 0 && (
        <View className="chapters-list">
          <Text className="section-title">课程目录</Text>
          {chapters.map((chapter, index) => (
            <View
              key={chapter.id || index}
              className={`chapter-item ${index === currentChapter ? 'active' : ''} ${index < currentChapter ? 'watched' : ''}`}
              onClick={() => handleChapterChange(index)}
            >
              <View className="chapter-num">
                <Text>{index + 1}</Text>
              </View>
              <View className="chapter-info">
                <Text className="chapter-title">{chapter.title}</Text>
                <Text className="chapter-status">
                  {index < currentChapter ? '已看完' : index === currentChapter ? '播放中' : '未学习'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* 导航按钮 */}
      <View className="player-footer">
        <View
          className={`nav-btn ${currentChapter === 0 ? 'disabled' : ''}`}
          onClick={() => currentChapter > 0 && handleChapterChange(currentChapter - 1)}
        >
          <Text>上一章</Text>
        </View>
        <View className="exit-btn" onClick={() => Taro.navigateBack()}>
          <Text>退出播放</Text>
        </View>
        <View
          className={`nav-btn ${currentChapter >= chapters.length - 1 ? 'disabled' : ''}`}
          onClick={() => currentChapter < chapters.length - 1 && handleChapterChange(currentChapter + 1)}
        >
          <Text>下一章</Text>
        </View>
      </View>

      {/* 合规免责文案 */}
      <View className="compliance-notice">
        <Text className="notice-text">
          {course.compliance_notice || '⚠️ 本视频内容仅作日常养生参考，非医疗诊疗，身体不适请及时就医。'}
        </Text>
      </View>
    </View>
  )
}