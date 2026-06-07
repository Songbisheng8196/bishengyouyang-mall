import { useState, useEffect } from 'react'
import { View, Text, Image, Button, Input } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import { request } from '@/utils/request'
import './index.scss'

export default function OrderConfirm() {
  const [data, setData] = useState<any>(null)
  const [remark, setRemark] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchOrderData()
  }, [])

  const fetchOrderData = async () => {
    try {
      // 从购物车获取选中商品
      const res = await request('/cart')
      const selectedItems = res.items?.filter((item: any) => item.selected) || []
      if (selectedItems.length === 0) {
        Taro.showToast({ title: '请选择要结算的商品', icon: 'none' })
        return
      }
      setData({
        address: res.address || null,
        products: selectedItems,
        coupon: null,
        freight: 0,
        discount: 0
      })
    } catch (err) {
      // 使用 mock 数据
      setData({
        address: { id: '1', name: '张三', phone: '138****8888', province: '湖北省', city: '武汉市', district: '江汉区', detail: '建设大道xxx号' },
        products: [{ id: '1', name: '花养膏·红枣枸杞味', sku: '红枣枸杞味', price: 128, quantity: 1, image: '/assets/images/product-1.jpg' }],
        coupon: null,
        freight: 0,
        discount: 0
      })
    }
  }

  if (!data) {
    return (
      <View className="order-confirm-page">
        <View className="loading-container">
          <Text className="loading-text">加载中...</Text>
        </View>
      </View>
    )
  }

  const totalAmount = data.products.reduce((sum: number, p: any) => sum + p.price * p.quantity, 0)
  const payAmount = totalAmount + data.freight - data.discount

  // 提交订单
  const handleSubmit = async () => {
    if (!data.address) {
      Taro.showToast({ title: '请选择收货地址', icon: 'none' })
      return
    }

    try {
      setSubmitting(true)
      const cartItemIds = data.products.map((p: any) => p.id)

      // 创建订单
      const res = await request('/orders', {
        method: 'POST',
        data: {
          address_id: data.address.id,
          cart_item_ids: cartItemIds,
          remark
        }
      })

      // 唤起微信支付
      await handleWxPay(res.order_id)
    } catch (err: any) {
      Taro.showToast({ title: err.message || '提交失败', icon: 'none' })
    } finally {
      setSubmitting(false)
    }
  }

  // 微信支付 JSAPI
  const handleWxPay = async (orderId: string) => {
    try {
      // 获取用户 openid（需在小程序端通过 wx.login 获取）
      const loginRes = await Taro.login()
      const openidRes = await request('/auth/openid', {
        method: 'POST',
        data: { code: loginRes.code }
      })
      const openid = openidRes.openid

      // 调用后端统一下单接口
      const payRes = await request(`/orders/${orderId}/pay`, {
        method: 'POST',
        data: { openid }
      })

      // 调起微信支付
      const paymentRes = await Taro.requestPayment({
        timeStamp: payRes.timeStamp,
        nonceStr: payRes.nonceStr,
        package: `prepay_id=${payRes.prepay_id}`,
        signType: 'MD5',
        paySign: payRes.paySign
      })

      // 支付成功
      Taro.redirectTo({ url: `/pages/order/detail?id=${orderId}` })
    } catch (err: any) {
      if (err.errMsg?.includes('cancel')) {
        // 用户取消支付，跳转到订单列表
        Taro.redirectTo({ url: '/pages/order/list' })
      } else {
        Taro.showToast({ title: err.message || '支付失败', icon: 'none' })
      }
    }
  }

  return (
    <View className="order-confirm-page">
      <View className="address-section" onClick={() => Taro.navigateTo({ url: '/pages/user/address' })}>
        {data.address ? (
          <>
            <View className="address-info"><View className="address-user"><Text className="user-name">{data.address.name}</Text><Text className="user-phone">{data.address.phone}</Text></View><Text className="address-detail">{data.address.province}{data.address.city}{data.address.district}{data.address.detail}</Text></View>
            <Text className="address-arrow">></Text>
          </>
        ) : (
          <View className="address-empty">
            <Text>请添加收货地址</Text>
            <Text className="address-arrow">></Text>
          </View>
        )}
      </View>
      <View className="products-section">
        <View className="section-header"><Text className="section-title">商品清单</Text></View>
        {data.products.map((product: any) => (
          <View key={product.id} className="product-item">
            <Image src={product.cover_image || product.image} className="product-image" />
            <View className="product-info"><Text className="product-name">{product.product_name || product.name}</Text><Text className="product-sku">{product.specifications || product.sku}</Text><View className="product-bottom"><Text className="product-price">¥{product.price}</Text><Text className="product-quantity">x{product.quantity}</Text></View></View>
          </View>
        ))}
      </View>
      <View className="coupon-section"><Text className="coupon-label">优惠券</Text><View className="coupon-value"><Text className="coupon-empty">选择优惠券</Text><Text className="arrow">></Text></View></View>
      <View className="remark-section"><Text className="remark-label">订单备注</Text><Input className="remark-input" placeholder="选填" value={remark} onInput={(e: any) => setRemark(e.detail.value)} /></View>
      <View className="price-section">
        <View className="price-row"><Text className="price-label">商品金额</Text><Text className="price-value">¥{totalAmount.toFixed(2)}</Text></View>
        <View className="price-row"><Text className="price-label">运费</Text><Text className="price-value">{data.freight === 0 ? '免运费' : `¥${data.freight}`}</Text></View>
        <View className="price-row"><Text className="price-label">优惠</Text><Text className="price-value">-¥{data.discount.toFixed(2)}</Text></View>
      </View>
      <View className="footer">
        <View className="footer-left"><Text className="total-label">合计：</Text><Text className="total-price">¥{payAmount.toFixed(2)}</Text></View>
        <Button className="submit-btn" onClick={handleSubmit} loading={submitting}><Text>{submitting ? '提交中...' : '提交订单'}</Text></Button>
      </View>
    </View>
  )
}