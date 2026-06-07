import { useState, useEffect } from 'react'
import { View, Text, RadioGroup, Radio } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import { request } from '@/utils/request'
import './question.scss'

interface Question {
  id: number
  title: string
  options: Array<{ id: number; label: string; score: number }>
}

interface QuestionsResponse {
  questions: Question[]
}

interface SubmitResponse {
  type: string
  typeName: string
  score: number
}

export default function ConstitutionQuestion() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Fetch questions from API
  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const res = await request<QuestionsResponse>('/constitution/questions')
      setQuestions(res.questions || [])
    } catch (err) {
      console.error('获取题目失败:', err)
      Taro.showToast({ title: '获取题目失败，请重试', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  const question = questions[currentQuestion]
  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0

  const handleOptionSelect = (optionId: number) => {
    if (!question) return
    setAnswers({ ...answers, [question.id]: optionId })
  }

  const handleNext = async () => {
    if (!question) return
    
    // Frontend validation: all questions must be answered
    if (!answers[question.id]) {
      Taro.showToast({ title: '请选择一个选项', icon: 'none' })
      return
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Last question - submit the questionnaire
      await handleSubmit()
    }
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      
      // Build answers object: questionId -> selectedOptionId
      const answersPayload: Record<number, number> = {}
      for (const q of questions) {
        if (answers[q.id]) {
          answersPayload[q.id] = answers[q.id]
        }
      }

      // Validate all questions answered
      if (Object.keys(answersPayload).length < questions.length) {
        Taro.showToast({ title: '请完成所有题目', icon: 'none' })
        return
      }

      const res = await request<SubmitResponse>('/constitution/submit', {
        method: 'POST',
        data: { answers: answersPayload }
      })

      // Store result type for result page
      Taro.setStorageSync('constitutionResult', {
        type: res.type,
        typeName: res.typeName,
        score: res.score
      })

      Taro.showToast({ title: '提交成功', icon: 'success' })
      Taro.navigateTo({ url: '/pages/constitution/result' })
    } catch (err) {
      console.error('提交失败:', err)
      Taro.showToast({ title: '提交失败，请重试', icon: 'none' })
    } finally {
      setSubmitting(false)
    }
  }

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  // Loading state
  if (loading) {
    return (
      <View className="question-page">
        <View className="loading-container">
          <Text className="loading-text">加载题目中...</Text>
        </View>
      </View>
    )
  }

  // Empty state
  if (questions.length === 0) {
    return (
      <View className="question-page">
        <View className="loading-container">
          <Text className="loading-text">暂无可用题目</Text>
        </View>
      </View>
    )
  }

  return (
    <View className="question-page">
      <View className="progress-section">
        <View className="progress-bar">
          <View className="progress-fill" style={{ width: `${progress}%` }} />
        </View>
        <Text className="progress-text">{currentQuestion + 1}/{questions.length}</Text>
      </View>
      <View className="question-content">
        <Text className="question-title">{question.title}</Text>
        <RadioGroup>
          {question.options.map(option => (
            <View
              key={option.id}
              className={`option-item ${answers[question.id] === option.id ? 'selected' : ''}`}
              onClick={() => handleOptionSelect(option.id)}
            >
              <Radio
                value={String(option.id)}
                checked={answers[question.id] === option.id}
              />
              <Text className="option-label">{option.label}</Text>
            </View>
          ))}
        </RadioGroup>
      </View>
      <View className="question-footer">
        {currentQuestion > 0 && (
          <View className="btn-prev" onClick={handlePrev}>
            <Text>上一题</Text>
          </View>
        )}
        <View
          className={`btn-next ${currentQuestion === 0 ? 'full' : ''}`}
          onClick={submitting ? () => {} : handleNext}
        >
          <Text>{submitting ? '提交中...' : (currentQuestion === questions.length - 1 ? '提交测评' : '下一题')}</Text>
        </View>
      </View>
      {/* 合规免责文案 */}
      <View className="compliance-notice">
        <Text className="notice-text">⚠️ 测评结果仅日常膳食参考，非医疗诊断，身体不适请及时就医。</Text>
      </View>
    </View>
  )
}