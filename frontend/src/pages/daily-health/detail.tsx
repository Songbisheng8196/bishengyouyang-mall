import { useState } from 'react'
import { View, Text, Image, RichText } from '@tarojs/taro'
import './index.scss'

const MOCK_ARTICLE = {
  title: '芒种时节养生：祛湿健脾正当时',
  author: '毕生优养营养师',
  publishDate: '2024-06-05',
  coverImage: '/assets/images/article-detail.jpg',
  content: '<p>芒种是夏季的第三个节气，标志着仲夏时节的正式开始。此时气温显著升高、雨量充沛、空气湿度大，养生重点在于祛湿健脾。</p><h3>一、饮食调理</h3><p>芒种时节宜清淡饮食，多吃具有祛湿作用的食物，如薏米、红豆、冬瓜等。</p>',
}

export default function DailyHealthDetail() {
  const [article] = useState(MOCK_ARTICLE)
  return (
    <View className="detail-page">
      <View className="article-header"><Text className="article-title">{article.title}</Text><View className="article-meta"><Text className="meta-author">{article.author}</Text><Text className="meta-date">{article.publishDate}</Text></View></View>
      <Image src={article.coverImage} className="article-cover" mode="aspectFill" />
      <View className="article-content"><RichText nodes={article.content} /></View>
      {/* ⚠️ 合规免责文案：本文内容仅作日常养生参考，非医疗诊断，身体不适请及时就医。 */}
      <View className="compliance-notice"><Text className="notice-text">⚠️ 本文内容仅作日常养生参考，非医疗诊断，身体不适请及时就医。</Text></View>
    </View>
  )
}