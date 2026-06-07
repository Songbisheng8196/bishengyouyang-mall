import { useState, useEffect } from 'react'
import { View, Text, Image, Swiper, SwiperItem, ScrollView } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import './index.scss'

const ENTRY_LIST = [
  { id: 'constitution', title: '体质测评', icon: 'constitution.png', path: '/pages/constitution/intro', color: '#EAA78B' },
  { id: 'daily', title: '每日养生', icon: 'daily.png', path: '/pages/daily-health/list', color: '#A8D5BA' },
  { id: 'course', title: '养生课堂', icon: 'course.png', path: '/pages/course/list', color: '#F5C77E' },
  { id: 'checkin', title: '养生打卡', icon: 'checkin.png', path: '/pages/checkin/index', color: '#B8D4E8' },
  { id: 'mall', title: '商城', icon: 'mall.png', path: '/pages/category/index', color: '#D4A5D4' },
]

const BANNER_LIST = [
  { id: 1, image: '/assets/images/banner1.jpg', link: '' },
  { id: 2, image: '/assets/images/banner2.jpg', link: '' },
  { id: 3, image: '/assets/images/banner3.jpg', link: '' },
]

export default function Index() {
  const [userInfo, setUserInfo] = useState<any>(null)
  
  useEffect(() => {
    const info = Taro.getStorageSync('user_info')
    if (info) setUserInfo(info)
  }, [])
  
  const handleEntryClick = (entry: typeof ENTRY_LIST[0]) => {
    Taro.navigateTo({ url: entry.path })
  }
  
  return (
    <View className="index-page">
      <View className="header">
        <View className="welcome">
          <Text className="title">您好，{userInfo?.nickName || '养生爱好者'}</Text>
          <Text className="subtitle">今日宜：科学食补，轻松养生</Text>
        </View>
        <View className="avatar" onClick={() => Taro.navigateTo({ url: '/pages/user/index' })}>
          <Image src={userInfo?.avatarUrl || '/assets/images/default-avatar.png'} />
        </View>
      </View>
      
      <Swiper className="banner" autoplay circular indicatorDots>
        {BANNER_LIST.map(banner => (
          <SwiperItem key={banner.id}>
            <Image src={banner.image} className="banner-image" mode="aspectFill" />
          </SwiperItem>
        ))}
      </Swiper>
      
      <View className="entry-section">
        <View className="entry-grid">
          {ENTRY_LIST.map(entry => (
            <View key={entry.id} className="entry-item" onClick={() => handleEntryClick(entry)}>
              <View className="entry-icon" style={{ backgroundColor: entry.color }}>
                <Image src={`/assets/images/${entry.icon}`} />
              </View>
              <Text className="entry-title">{entry.title}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View className="section">
        <View className="section-header">
          <Text className="section-title">精选推荐</Text>
          <Text className="section-more" onClick={() => Taro.navigateTo({ url: '/pages/product/list' })}>更多</Text>
        </View>
        <ScrollView scrollX className="product-scroll">
          {[1, 2, 3, 4, 5].map(item => (
            <View key={item} className="product-card" onClick={() => Taro.navigateTo({ url: '/pages/product/detail?id=' + item })}>
              <Image src="/assets/images/product-placeholder.jpg" className="product-image" mode="aspectFill" />
              <Text className="product-name">花养膏·红枣枸杞口味</Text>
              <Text className="product-price">¥128</Text>
            </View>
          ))}
        </ScrollView>
      </View>
      
      <View className="city-float-btn" onClick={() => Taro.navigateTo({ url: '/pages/city/index' })}>
        <Text className="city-text">武汉同城</Text>
      </View>
    </View>
  )
}