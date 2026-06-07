import { useState, useEffect } from 'react'
import { View, Text, Image, Swiper, SwiperItem, Button } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import { request } from '@/utils/request'
import './index.scss'

interface ProductDetail {
  id: string
  name: string
  subtitle?: string
  cover_image: string
  images: string[]
  price: number
  originalPrice?: number
  stock?: number
  sales_count?: number
  description?: string
  tags?: string[]
  specifications?: Array<{ name: string; options: string[] }>
  compliance_notice?: string
}

export default function ProductDetail() {
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSku, setSelectedSku] = useState('')
  const [addingCart, setAddingCart] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const id = (Taro.getCurrentInstance() as any).router?.params?.id || '1'
      const res = await request<ProductDetail>(`/products/${id}`)
      setProduct(res)
      // 默认选第一个规格（如果有的话）
      if (res.specifications?.length) {
        setSelectedSku(res.specifications[0].options?.[0] || '')
      }
    } catch (err) {
      console.error('获取商品详情失败:', err)
      Taro.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  const getImageUrl = (url: string) => {
    if (!url) return '/assets/images/product-placeholder.jpg'
    if (url.startsWith('http')) return url
    return `http://localhost:3000${url}`
  }

  const handleAddCart = async () => {
    if (!product) return
    try {
      setAddingCart(true)
      await Taro.request({
        url: `${(Taro as any).config?.apiBase || 'http://localhost:3000/api'}/cart/add`,
        method: 'POST',
        data: { productId: product.id, sku: selectedSku, quantity: 1 },
      })
      Taro.showToast({ title: '已加入购物车', icon: 'success' })
    } catch {
      Taro.showToast({ title: '加入失败，请重试', icon: 'none' })
    } finally {
      setAddingCart(false)
    }
  }

  if (loading) {
    return (
      <View className="product-detail-page">
        <View className="loading-container">
          <Text className="loading-text">加载中...</Text>
        </View>
      </View>
    )
  }

  if (!product) {
    return (
      <View className="product-detail-page">
        <View className="loading-container">
          <Text className="loading-text">商品不存在</Text>
        </View>
      </View>
    )
  }

  // 处理图片列表
  const imageList = product.images?.length
    ? product.images
    : product.cover_image
    ? [product.cover_image]
    : ['/assets/images/product-placeholder.jpg']

  return (
    <View className="product-detail-page">
      {/* 图片轮播 */}
      <Swiper className="product-swiper" autoplay circular indicatorDots>
        {imageList.map((image, index) => (
          <SwiperItem key={index}>
            <Image src={getImageUrl(image)} className="swiper-image" mode="aspectFill" />
          </SwiperItem>
        ))}
      </Swiper>

      {/* 价格区域 */}
      <View className="price-section">
        <View className="price-row">
          <Text className="current-price">¥{product.price}</Text>
          {product.originalPrice && product.originalPrice > product.price && (
            <Text className="original-price">¥{product.originalPrice}</Text>
          )}
        </View>
        {product.sales_count !== undefined && (
          <Text className="sales-count">{product.sales_count}人已购买</Text>
        )}
        {product.stock !== undefined && (
          <Text className="stock-count">
            {product.stock > 0 ? `库存 ${product.stock} 件` : '暂时缺货'}
          </Text>
        )}
      </View>

      {/* 商品信息 */}
      <View className="info-section">
        <Text className="product-name">{product.name}</Text>
        {product.subtitle && <Text className="product-subtitle">{product.subtitle}</Text>}
        {product.tags && product.tags.length > 0 && (
          <View className="tags-row">
            {product.tags.map((tag, i) => (
              <View key={i} className="tag-item"><Text>{tag}</Text></View>
            ))}
          </View>
        )}
      </View>

      {/* 规格选择 */}
      {product.specifications?.map((spec, sIdx) => (
        <View key={sIdx} className="sku-section">
          <Text className="sku-title">{spec.name}</Text>
          <View className="sku-list">
            {spec.options.map((opt, oIdx) => (
              <View
                key={oIdx}
                className={`sku-item ${selectedSku === opt ? 'selected' : ''}`}
                onClick={() => setSelectedSku(opt)}
              >
                <Text className="sku-name">{opt}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}

      {/* 商品详情 */}
      <View className="desc-section">
        <Text className="section-title">商品详情</Text>
        {product.description ? (
          <View className="desc-html">
            <Text className="desc-text">{product.description}</Text>
          </View>
        ) : (
          <Text className="desc-text">暂无详情描述</Text>
        )}
      </View>

      {/* 合规免责文案 */}
      <View className="compliance-notice">
        <Text className="notice-text">
          {product.compliance_notice || '🍵 本品为普通食品，仅作日常食补食用，非医疗诊断，身体不适请及时就医。'}
        </Text>
      </View>

      {/* 底部操作栏 */}
      <View className="action-bar">
        <View className="action-left">
          <View className="cart-icon" onClick={() => Taro.switchTab({ url: '/pages/cart/index' })}>
            <Text>购物车</Text>
          </View>
        </View>
        <View className="action-right">
          <View className="add-cart-btn" onClick={handleAddCart}>
            <Text>{addingCart ? '加入中...' : '加入购物车'}</Text>
          </View>
          <View className="buy-btn" onClick={() => Taro.navigateTo({ url: '/pages/order/confirm' })}>
            <Text>立即购买</Text>
          </View>
        </View>
      </View>
    </View>
  )
}