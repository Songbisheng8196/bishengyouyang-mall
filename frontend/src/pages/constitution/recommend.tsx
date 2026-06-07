import { useState, useEffect } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import { request } from '@/utils/request'
import './index.scss'

interface RecommendData {
  constitution_type: number
  constitution_name: string
  description: string
  daily_tips: string[]
  products: Array<{
    sku: string
    name: string
    subtitle?: string
    price: number
    cover_image?: string
    tags?: string[]
  }>
  recipes: Array<{
    name: string
    ingredients: string[]
    method?: string
    suitable?: string
  }>
  course: {
    sku: string
    name: string
    description?: string
    type: string
    price: number
  } | null
  compliance_notice?: string
}

export default function ConstitutionRecommend() {
  const [data, setData] = useState<RecommendData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecommend()
  }, [])

  const fetchRecommend = async () => {
    try {
      setLoading(true)
      const params = (Taro.getCurrentInstance() as any).router?.params || {}
      const type = params.type || '平和质'

      const res = await request<RecommendData>(`/constitution/recommend/${encodeURIComponent(type)}`)
      setData(res)
    } catch (err) {
      console.error('获取推荐方案失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const getImageUrl = (url?: string) => {
    if (!url) return '/assets/images/product-placeholder.jpg'
    if (url.startsWith('http')) return url
    return `http://localhost:3000${url}`
  }

  if (loading) {
    return (
      <View className="recommend-page">
        <View className="loading-container"><Text className="loading-text">加载中...</Text></View>
      </View>
    )
  }

  if (!data) {
    return (
      <View className="recommend-page">
        <View className="loading-container"><Text className="loading-text">加载失败</Text></View>
      </View>
    )
  }

  return (
    <View className="recommend-page">
      {/* 头部 */}
      <View className="header">
        <Text className="header-title">{data.constitution_name}专属方案</Text>
        <Text className="header-subtitle">{data.description}</Text>
      </View>

      <ScrollView scrollY className="content">
        {/* 日常调理建议 */}
        {data.daily_tips?.length > 0 && (
          <View className="section">
            <View className="section-header">
              <Text className="section-title">日常调理建议</Text>
            </View>
            <View className="tips-list">
              {data.daily_tips.map((tip, index) => (
                <View key={index} className="tip-item">
                  <View className="tip-num"><Text>{index + 1}</Text></View>
                  <Text className="tip-text">{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 推荐食补产品 */}
        {data.products?.length > 0 && (
          <View className="section">
            <View className="section-header">
              <Text className="section-title">推荐食补产品</Text>
              <Text className="section-count">共{data.products.length}款</Text>
            </View>
            <View className="products-list">
              {data.products.map(product => (
                <View
                  key={product.sku}
                  className="product-card"
                  onClick={() => Taro.navigateTo({ url: `/pages/product/detail?id=${product.sku}` })}
                >
                  <Image
                    src={getImageUrl(product.cover_image)}
                    className="product-image"
                    mode="aspectFill"
                  />
                  <View className="product-info">
                    <Text className="product-name">{product.name}</Text>
                    {product.subtitle && (
                      <Text className="product-reason">{product.subtitle}</Text>
                    )}
                    <View className="product-bottom">
                      <Text className="product-price">¥{product.price}</Text>
                      <View className="add-cart-btn">
                        <Text>加入购物车</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 食疗方 */}
        {data.recipes?.length > 0 && (
          <View className="section">
            <View className="section-header">
              <Text className="section-title">日常食疗方</Text>
            </View>
            <View className="recipes-list">
              {data.recipes.map((recipe, index) => (
                <View key={index} className="recipe-card">
                  <View className="recipe-header">
                    <Text className="recipe-name">{recipe.name}</Text>
                  </View>
                  <View className="recipe-content">
                    <Text className="recipe-label">食材：</Text>
                    <Text className="recipe-ingredients">
                      {recipe.ingredients.join(' + ')}
                    </Text>
                  </View>
                  {recipe.method && (
                    <View className="recipe-content">
                      <Text className="recipe-label">做法：</Text>
                      <Text className="recipe-method">{recipe.method}</Text>
                    </View>
                  )}
                  {recipe.suitable && (
                    <View className="recipe-suitable">
                      <Text className="suitable-text">适合：{recipe.suitable}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 推荐课程 */}
        {data.course && (
          <View className="section">
            <View className="section-header">
              <Text className="section-title">推荐课程</Text>
            </View>
            <View
              className="course-card"
              onClick={() => Taro.navigateTo({ url: `/pages/course/detail?id=${data.course?.sku}` })}
            >
              <View className="course-info">
                <Text className="course-name">{data.course.name}</Text>
                {data.course.description && (
                  <Text className="course-desc">{data.course.description}</Text>
                )}
                <View className="course-tag">
                  <Text>{data.course.type}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* 合规免责文案 */}
      <View className="compliance-notice">
        <Text className="notice-text">
          {data.compliance_notice || '⚠️ 测评结果仅日常膳食参考，非医疗诊断，身体不适请及时就医。'}
        </Text>
      </View>
    </View>
  )
}