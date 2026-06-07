import { useState } from 'react'
import { View, Text } from '@tarojs/taro'
import './index.scss'

const MOCK_LOGISTICS = { company: '顺丰速运', trackingNo: 'SF1234567890', status: '配送中', traces: [{ time: '2024-06-05 14:30', content: '商品已从武汉仓库发出' }, { time: '2024-06-05 10:20', content: '商品已到达武汉分拨中心' }, { time: '2024-06-04 20:00', content: '商家已发货' }] }

export default function Logistics() {
  const [logistics] = useState(MOCK_LOGISTICS)
  return (
    <View className="logistics-page">
      <View className="status-section"><View className="status-icon"><Text>🚚</Text></View><View className="status-info"><Text className="status-text">{logistics.status}</Text><Text className="status-time">预计明天送达</Text></View></View>
      <View className="info-section"><View className="info-row"><Text className="info-label">物流公司</Text><Text className="info-value">{logistics.company}</Text></View><View className="info-row"><Text className="info-label">运单号码</Text><Text className="info-value">{logistics.trackingNo}</Text></View></View>
      <View className="traces-section"><Text className="section-title">物流轨迹</Text><View className="traces-list">
        {logistics.traces.map((trace, index) => (<View key={index} className={`trace-item ${index === 0 ? 'current' : ''}`}><View className="trace-dot">{index === 0 && <View className="dot-inner" />}</View><View className="trace-content"><Text className="trace-time">{trace.time}</Text><Text className="trace-desc">{trace.content}</Text></View></View>))}
      </View></View>
    </View>
  )
}