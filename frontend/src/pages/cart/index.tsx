import { useState } from 'react'
import { View, Text, Image, Checkbox } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import { useCartStore } from '@/store/cart'
import './index.scss'

export default function Cart() {
  const { items, selectedCount, totalAmount, toggleSelect, selectAll, updateQuantity, removeItem } = useCartStore()
  const [isAllSelected, setIsAllSelected] = useState(false)

  const handleSelectAll = () => {
    const newStatus = !isAllSelected
    setIsAllSelected(newStatus)
    selectAll(newStatus)
  }

  return (
    <View className="cart-page">
      {items.length === 0 ? (
        <View className="empty-cart">
          <Image src="/assets/images/empty-cart.png" className="empty-icon" />
          <Text className="empty-text">购物车是空的</Text>
          <View className="empty-btn" onClick={() => Taro.switchTab({ url: '/pages/category/index' })}>
            <Text>去逛逛</Text>
          </View>
        </View>
      ) : (
        <>
          <View className="cart-list">
            {items.map(item => (
              <View key={item.id} className="cart-item">
                <Checkbox checked={item.selected} onClick={() => toggleSelect(item.id)} className="item-checkbox" />
                <Image src={item.productImage} className="item-image" />
                <View className="item-info">
                  <Text className="item-name">{item.productName}</Text>
                  <Text className="item-sku">{item.skuName}</Text>
                  <View className="item-bottom">
                    <Text className="item-price">¥{item.price}</Text>
                    <View className="quantity-control">
                      <Text className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</Text>
                      <Text className="quantity-num">{item.quantity}</Text>
                      <Text className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Text>
                    </View>
                  </View>
                </View>
                <Text className="item-delete" onClick={() => removeItem(item.id)}>删除</Text>
              </View>
            ))}
          </View>
          <View className="cart-footer">
            <View className="footer-left" onClick={handleSelectAll}>
              <Checkbox checked={isAllSelected} />
              <Text className="select-all-text">全选</Text>
            </View>
            <View className="footer-right">
              <View className="total-info">
                <Text className="total-label">合计：</Text>
                <Text className="total-price">¥{totalAmount.toFixed(2)}</Text>
              </View>
              <View className="checkout-btn" onClick={() => Taro.navigateTo({ url: '/pages/order/confirm' })}>
                <Text>结算({selectedCount})</Text>
              </View>
            </View>
          </View>
        </>
      )}
      {/* 🍵 合规标注：本品为普通食品，仅作日常食补食用。 */}
    </View>
  )
}