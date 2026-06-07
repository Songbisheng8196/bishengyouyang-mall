import { useState } from 'react'
import { View, Text, Image } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import './index.scss'

const MOCK_ORDER = { id: '1', orderNo: 'BS202406050001', status: 0, statusText: '待付款', totalAmount: 128, address: { name: '张三', phone: '138****8888', detail: '湖北省武汉市江汉区建设大道xxx号' }, items: [{ id: '1', name: '花养膏·红枣枸杞味', sku: '红枣枸杞味', price: 128, quantity: 1, image: '/assets/images/product-1.jpg' }], createTime: '2024-06-05 10:30:00' }

export default function OrderDetail() {
  const [order] = useState(MOCK_ORDER)
  return (
    <View className="order-detail-page">
      <View className="status-section"><Text className="status-text">{order.statusText}</Text><Text className="status-hint">请尽快完成付款</Text></View>
      <View className="address-section"><View className="address-info"><Text className="address-name">{order.address.name}</Text><Text className="address-phone">{order.address.phone}</Text></View><Text className="address-detail">{order.address.detail}</Text></View>
      <View className="products-section">{order.items.map(item => (<View key={item.id} className="product-item"><Image src={item.image} className="product-image" /><View className="product-info"><Text className="product-name">{item.name}</Text><Text className="product-sku">{item.sku}</Text><View className="product-bottom"><Text className="product-price">¥{item.price}</Text><Text className="product-quantity">x{item.quantity}</Text></View></View></View>))}</View>
      <View className="price-section"><View className="price-row"><Text className="price-label">商品金额</Text><Text className="price-value">¥{order.totalAmount.toFixed(2)}</Text></View><View className="price-row"><Text className="price-label">合计</Text><Text className="price-value">¥{order.totalAmount.toFixed(2)}</Text></View></View>
      <View className="info-section"><View className="info-row"><Text className="info-label">订单编号</Text><Text className="info-value">{order.orderNo}</Text></View><View className="info-row"><Text className="info-label">下单时间</Text><Text className="info-value">{order.createTime}</Text></View></View>
      {order.status === 0 && <View className="action-section"><View className="action-btn cancel"><Text>取消订单</Text></View><View className="action-btn primary"><Text>去付款</Text></View></View>}
    </View>
  )
}