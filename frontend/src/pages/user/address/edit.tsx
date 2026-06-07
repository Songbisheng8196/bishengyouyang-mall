import { useState } from 'react'
import { View, Text, Input, Switch, Button } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import './index.scss'

export default function AddressEdit() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [province, setProvince] = useState('')
  const [city, setCity] = useState('')
  const [district, setDistrict] = useState('')
  const [detail, setDetail] = useState('')
  const [isDefault, setIsDefault] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const isEdit = Taro.getCurrentInstance().router?.params.id
  
  const handleSubmit = async () => {
    if (!name.trim()) {
      Taro.showToast({ title: '请输入收货人姓名', icon: 'none' })
      return
    }
    if (!phone.trim()) {
      Taro.showToast({ title: '请输入手机号', icon: 'none' })
      return
    }
    if (!detail.trim()) {
      Taro.showToast({ title: '请输入详细地址', icon: 'none' })
      return
    }
    
    setIsSubmitting(true)
    
    // TODO: 调用API保存地址
    // await saveAddress({ name, phone, province, city, district, detail, isDefault })
    
    setTimeout(() => {
      setIsSubmitting(false)
      Taro.showToast({ title: '保存成功', icon: 'success' })
      setTimeout(() => Taro.navigateBack(), 1000)
    }, 1000)
  }
  
  return (
    <View className="address-edit-page">
      <View className="form-section">
        <View className="form-item">
          <Text className="form-label">收货人</Text>
          <Input
            className="form-input"
            placeholder="请输入收货人姓名"
            value={name}
            onInput={(e) => setName(e.detail.value)}
          />
        </View>
        <View className="form-item">
          <Text className="form-label">手机号</Text>
          <Input
            className="form-input"
            type="number"
            placeholder="请输入手机号"
            value={phone}
            onInput={(e) => setPhone(e.detail.value)}
            maxlength={11}
          />
        </View>
        <View className="form-item">
          <Text className="form-label">所在地区</Text>
          <Input
            className="form-input"
            placeholder="省-市-区"
            value={`${province} ${city} ${district}`}
            onInput={(e) => {
              const parts = e.detail.value.split(' ')
              setProvince(parts[0] || '')
              setCity(parts[1] || '')
              setDistrict(parts[2] || '')
            }}
          />
        </View>
        <View className="form-item">
          <Text className="form-label">详细地址</Text>
          <Input
            className="form-input"
            placeholder="请输入详细地址"
            value={detail}
            onInput={(e) => setDetail(e.detail.value)}
          />
        </View>
        <View className="form-item default-row">
          <Text className="form-label">设为默认</Text>
          <Switch checked={isDefault} onChange={(e) => setIsDefault(e.detail.value)} />
        </View>
      </View>
      
      <View className="submit-section">
        <Button className="submit-btn" loading={isSubmitting} onClick={handleSubmit}>
          <Text>保存地址</Text>
        </Button>
      </View>
    </View>
  )
}