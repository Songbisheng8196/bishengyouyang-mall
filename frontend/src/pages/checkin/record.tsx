import { useState } from 'react'
import { View, Text, Image, Input, Button } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import './index.scss'

export default function CheckinRecord() {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const type = Taro.getCurrentInstance().router?.params.type || '1'
  const typeNames = { '1': '产品食用', '2': '饮水', '3': '作息' }
  
  const handleSubmit = async () => {
    if (!content.trim()) {
      Taro.showToast({ title: '请输入打卡内容', icon: 'none' })
      return
    }
    
    setIsSubmitting(true)
    
    // TODO: 调用API提交打卡记录
    // await submitCheckin({ type: Number(type), content })
    
    setTimeout(() => {
      setIsSubmitting(false)
      Taro.showToast({ title: '打卡成功', icon: 'success' })
      setTimeout(() => Taro.navigateBack(), 1000)
    }, 1000)
  }
  
  return (
    <View className="record-page">
      <View className="record-type">
        <Text className="type-label">打卡类型</Text>
        <Text className="type-name">{typeNames[type]}</Text>
      </View>
      
      <View className="record-form">
        <Text className="form-label">打卡内容</Text>
        <Input
          className="content-input"
          type="text"
          placeholder="记录您的打卡内容..."
          value={content}
          onInput={(e) => setContent(e.detail.value)}
          maxlength={200}
        />
      </View>
      
      <View className="record-tips">
        <Text className="tips-title">打卡提示</Text>
        <Text className="tips-text">• 产品食用：记录您今日食用的养生产品</Text>
        <Text className="tips-text">• 饮水：记录您今日的饮水量（杯数）</Text>
        <Text className="tips-text">• 作息：记录您今日的作息情况</Text>
      </View>
      
      <View className="submit-section">
        <Button 
          className="submit-btn"
          loading={isSubmitting}
          onClick={handleSubmit}
        >
          <Text>提交打卡</Text>
        </Button>
      </View>
    </View>
  )
}