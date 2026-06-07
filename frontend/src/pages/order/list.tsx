import { useState } from 'react'
import { View, Text, Image, Tabs, TabPane } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import './index.scss'

const MOCK_ORDERS = { all: [{ id: '1', orderNo: 'BS202406050001', status: 0, totalAmount: 128, items: [{ name: '花养膏·红枣枸杞味', image: '/assets/images/product-1.jpg' }], createTime: '2024-06-05 10:30' }], unpaid: [{ id: '1', orderNo: 'BS202406050001', status: 0, totalAmount: 128, items: [{ name: '花养膏·红枣枸杞味', image: '/assets/images/product-1.jpg' }], createTime: '2024-06-05 10:30' }], shipped: [], completed: [] }
const STATUS_TEXT = ['待付款', '待发货', '待收货', '已完成', '已取消']

export default function OrderList() {
  const [activeTab, setActiveTab] = useState('all')
  const getCurrentOrders = () => { switch (activeTab) { case 'unpaid': return MOCK_ORDERS.unpaid; case 'shipped': return MOCK_ORDERS.shipped; case 'completed': return MOCK_ORDERS.completed; default: return MOCK_ORDERS.all } }

  return (
    <View className="order-list-page">
      <Tabs current={activeTab} onClick={(index) => setActiveTab(index)}>
        <TabPane title="全部"><View className="order-list">{getCurrentOrders().map(order => (<View key={order.id} className="order-card" onClick={() => Taro.navigateTo({ url: `/pages/order/detail?id=${order.id}` })}><View className="order-header"><Text className="order-no">订单号：{order.orderNo}</Text><Text className="order-status">{STATUS_TEXT[order.status]}</Text></View><View className="order-items">{order.items.map((item, index) => (<View key={index} className="order-item"><Image src={item.image} className="item-image" /><Text className="item-name">{item.name}</Text></View>))}</View><View className="order-footer"><Text className="order-amount">¥{order.totalAmount}</Text>{order.status === 0 && <View className="order-actions"><View className="action-btn primary"><Text>去付款</Text></View></View>}</View></View>))}{getCurrentOrders().length === 0 && <View className="empty-state"><Text>暂无订单</Text></View>}</View></TabPane>
        <TabPane title="待付款"><View className="order-list">{MOCK_ORDERS.unpaid.map(order => (<View key={order.id} className="order-card"><View className="order-footer"><Text className="order-amount">¥{order.totalAmount}</Text><View className="action-btn primary"><Text>去付款</Text></View></View></View>))}{MOCK_ORDERS.unpaid.length === 0 && <View className="empty-state"><Text>暂无待付款订单</Text></View>}</View></TabPane>
        <TabPane title="待收货"><View className="empty-state"><Text>暂无待收货订单</Text></View></TabPane>
        <TabPane title="已完成"><View className="empty-state"><Text>暂无已完成订单</Text></View></TabPane>
      </Tabs>
    </View>
  )
}