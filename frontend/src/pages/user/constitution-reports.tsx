import { useState } from 'react'
import { View, Text, Button } from '@tarojs/taro'
import './index.scss'

// 模拟测评报告
const MOCK_REPORTS = [
  { id: '1', typeName: '气虚质', score: 72, createTime: '2024-06-01', status: '已完成' },
  { id: '2', typeName: '气虚质', score: 68, createTime: '2024-05-15', status: '已完成' },
]

export default function ConstitutionReports() {
  const [reports] = useState(MOCK_REPORTS)
  
  const handleViewReport = (reportId: string) => {
    // TODO: 跳转到报告详情
  }
  
  const handleNewTest = () => {
    // TODO: 跳转到测评
  }
  
  return (
    <View className="reports-page">
      <View className="reports-list">
        {reports.map(report => (
          <View key={report.id} className="report-card">
            <View className="report-header">
              <Text className="report-type">{report.typeName}</Text>
              <Text className="report-status">{report.status}</Text>
            </View>
            <View className="report-info">
              <View className="info-item">
                <Text className="info-label">匹配度</Text>
                <Text className="info-value">{report.score}%</Text>
              </View>
              <View className="info-item">
                <Text className="info-label">测评时间</Text>
                <Text className="info-value">{report.createTime}</Text>
              </View>
            </View>
            <Button className="view-btn" onClick={() => handleViewReport(report.id)}>
              <Text>查看报告</Text>
            </Button>
          </View>
        ))}
        
        {reports.length === 0 && (
          <View className="empty-state">
            <Text>暂无测评报告</Text>
            <Button className="new-test-btn" onClick={handleNewTest}>
              <Text>立即测评</Text>
            </Button>
          </View>
        )}
      </View>
      
      {/* ⚠️ 合规免责文案：测评结果仅日常膳食参考，非医疗诊断，身体不适请及时就医。 */}
      <View className="compliance-notice">
        <Text className="notice-text">⚠️ 测评结果仅日常膳食参考，非医疗诊断，身体不适请及时就医。</Text>
      </View>
    </View>
  )
}