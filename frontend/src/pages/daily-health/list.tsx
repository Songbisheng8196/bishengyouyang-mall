import { useState } from 'react'
import { View, Text, Image, Tabs, TabPane } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import './index.scss'

const CATEGORIES = [{ id: 'jieqi', name: '节气养生' }, { id: 'siji', name: '四季食补' }, { id: 'shengli', name: '生理期膳食' }]
const MOCK_ARTICLES = [
  { id: '1', title: '芒种时节养生：祛湿健脾正当时', category: 'jieqi', cover: '/assets/images/article-1.jpg', summary: '芒种是夏季第三个节气，此时气温升高、雨水增多...' },
  { id: '2', title: '夏日清热解毒食谱推荐', category: 'siji', cover: '/assets/images/article-2.jpg', summary: '夏季天气炎热，容易上火...' },
]

export default function DailyHealthList() {
  const [activeTab, setActiveTab] = useState('jieqi')

  return (
    <View className="daily-health-page">
      <View className="header-banner">
        <Image src="/assets/images/daily-health-banner.jpg" className="banner-image" />
        <View className="banner-overlay"><Text className="banner-title">每日养生</Text><Text className="banner-subtitle">根据节气、季节、生理期，定制专属食补方案</Text></View>
      </View>
      <Tabs current={activeTab} onClick={(index) => setActiveTab(index)}>
        {CATEGORIES.map(cat => (
          <TabPane key={cat.id} title={cat.name}>
            <View className="article-list">
              {MOCK_ARTICLES.filter(a => a.category === cat.id).map(article => (
                <View key={article.id} className="article-item" onClick={() => Taro.navigateTo({ url: `/pages/daily-health/detail?id=${article.id}` })}>
                  <Image src={article.cover} className="article-cover" />
                  <View className="article-info"><Text className="article-title">{article.title}</Text><Text className="article-summary">{article.summary}</Text></View>
                </View>
              ))}
            </View>
          </TabPane>
        ))}
      </Tabs>
    </View>
  )
}