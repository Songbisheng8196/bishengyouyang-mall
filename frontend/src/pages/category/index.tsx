import { useState } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/taro'
import './index.scss'

const CATEGORIES = [
  { id: '1', name: '花养膏', icon: '/assets/images/category-huayangg.png', subCategories: ['红枣枸杞味', '玫瑰花味', '桂圆红枣味'] },
  { id: '2', name: '花茶', icon: '/assets/images/category-huacha.png', subCategories: ['玫瑰花茶', '菊花茶', '茉莉花茶', '桂花茶'] },
  { id: '3', name: '养生礼盒', icon: '/assets/images/category-gift.png', subCategories: ['节日礼盒', '商务礼盒', '自用套装'] },
]

export default function Category() {
  const [activeCategory, setActiveCategory] = useState('1')
  const [subCategories, setSubCategories] = useState<string[]>([])

  useState(() => {
    const category = CATEGORIES.find(c => c.id === activeCategory)
    if (category) setSubCategories(category.subCategories)
  })

  return (
    <View className="category-page">
      <ScrollView scrollY className="category-nav">
        {CATEGORIES.map(category => (
          <View key={category.id} className={`category-item ${activeCategory === category.id ? 'active' : ''}`} onClick={() => setActiveCategory(category.id)}>
            <Image src={category.icon} className="category-icon" />
            <Text className="category-name">{category.name}</Text>
          </View>
        ))}
      </ScrollView>
      <View className="category-content">
        <Text className="content-title">{CATEGORIES.find(c => c.id === activeCategory)?.name}</Text>
        <View className="sub-category-grid">
          {subCategories.map((sub, index) => (
            <View key={index} className="sub-category-item">
              <View className="sub-category-icon"><Text>{sub.charAt(0)}</Text></View>
              <Text className="sub-category-name">{sub}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}