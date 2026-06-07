import { useState, useEffect } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import { request } from '@/utils/request'
import './index.scss'

// 分类定义
const CATEGORIES = [
  { id: '', name: '全部' },
  { id: 'HYG', name: '花养膏' },
  { id: 'HUA', name: '养生花茶' },
  { id: 'GIFT', name: '节气礼盒' },
]

const SORTS = [
  { key: 'id', name: '综合' },
  { key: 'sales', name: '销量' },
  { key: 'price', name: '价格' },
]

interface Product {
  id: string
  name: string
  subtitle?: string
  cover_image: string
  price: number
  originalPrice?: number
  stock?: number
  sales_count?: number
  tags?: string[]
}

interface ProductsResponse {
  list: Product[]
  count: number
  page: number
  pageSize: number
}

export default function ProductList() {
  const [activeCategory, setActiveCategory] = useState('')
  const [activeSort, setActiveSort] = useState('id')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  //初始加载 + 切换分类/排序时重新加载
  useEffect(() => {
    loadProducts(true)
  }, [activeCategory, activeSort])

  const loadProducts = async (reset = false) => {
    if (loading) return
    const targetPage = reset ? 1 : page
    try {
      setLoading(true)
      const params: Record<string, string> = {
        page: String(targetPage),
        pageSize: '10',
        sort: activeSort,
        order: activeSort === 'price' ? 'asc' : 'desc',
      }
      if (activeCategory) params.categoryId = activeCategory

      const res = await request<ProductsResponse>('/products?' + new URLSearchParams(params).toString())
      const list = Array.isArray(res.list) ? res.list : []
      if (reset) {
        setProducts(list)
        setPage(2)
      } else {
        setProducts(prev => [...prev, ...list])
        setPage(targetPage + 1)
      }
      setHasMore(list.length === 10)
    } catch (err) {
      console.error('获取商品列表失败:', err)
      Taro.showToast({ title: '加载失败，请重试', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (id: string) => {
    if (id === activeCategory) return
    setActiveCategory(id)
    setProducts([])
    setPage(1)
    setHasMore(true)
  }

  const handleSortChange = (key: string) => {
    if (key === activeSort) return
    setActiveSort(key)
    setProducts([])
    setPage(1)
    setHasMore(true)
  }

  const getImageUrl = (cover_image: string) => {
    if (!cover_image) return '/assets/images/product-placeholder.jpg'
    if (cover_image.startsWith('http')) return cover_image
    // 相对路径 →拼接后端地址
    return `http://localhost:3000${cover_image}`
  }

  return (
    <View className="product-list-page">
      {/* 分类Tab */}
      <ScrollView scrollX className="category-tabs">
        {CATEGORIES.map(cat => (
          <View
            key={cat.id}
            className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => handleCategoryChange(cat.id)}
          >
            <Text>{cat.name}</Text>
          </View>
        ))}
      </ScrollView>

      {/* 排序栏 */}
      <View className="sort-bar">
        {SORTS.map(s => (
          <View
            key={s.key}
            className={`sort-item ${activeSort === s.key ? 'active' : ''}`}
            onClick={() => handleSortChange(s.key)}
          >
            <Text>{s.name}</Text>
            {activeSort === s.key && s.key === 'price' && (
              <Text className="sort-arrow">↑</Text>
            )}
          </View>
        ))}
      </View>

      {/* 商品列表 */}
      <ScrollView scrollY className="product-grid" onScrollToLower={() => hasMore && !loading && loadProducts(false)}>
        {products.length === 0 && !loading ? (
          <View className="empty-state">
            <Text className="empty-text">暂无商品</Text>
          </View>
        ) : (
          products.map(product => (
            <View
              key={product.id}
              className="product-card"
              onClick={() => Taro.navigateTo({ url: `/pages/product/detail?id=${product.id}` })}
            >
              <Image
                src={getImageUrl(product.cover_image)}
                className="product-image"
                mode="aspectFill"
                lazyLoad
              />
              <View className="product-info">
                <Text className="product-name">{product.name}</Text>
                {product.subtitle &&<Text className="product-subtitle">{product.subtitle}</Text>}
                <View className="product-price-row">
                  <Text className="product-price">¥{product.price}</Text>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <Text className="product-original">¥{product.originalPrice}</Text>
                  )}
                </View>
                {product.sales_count !== undefined && (
                  <Text className="product-sales">{product.sales_count}人购买</Text>
                )}
              </View>
            </View>
          ))
        )}
        {loading && (
          <View className="loading-more">
            <Text className="loading-text">加载中...</Text>
          </View>
        )}
        {!hasMore && products.length > 0 && (
          <View className="no-more">
            <Text className="no-more-text">— 没有更多了 —</Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}