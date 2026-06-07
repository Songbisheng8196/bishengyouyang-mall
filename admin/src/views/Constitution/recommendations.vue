<template>
  <div class="recommendations-manage">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>体质推荐方案管理</span>
          <el-button type="primary" @click="handleSaveAll">保存全部</el-button>
        </div>
      </template>

      <el-tabs v-model="activeType" class="type-tabs">
        <el-tab-pane
          v-for="type in constitutionTypes"
          :key="type"
          :label="type"
          :name="type"
        >
          <el-form :model="recommendations[type]" label-width="100px" size="default">
            <el-alert type="info" :closable="false" style="margin-bottom: 16px">
              体质类型：{{ type }} — 根据用户测评结果推荐相应产品、食谱和课程
            </el-alert>

            <!--日常调理建议 -->
            <el-form-item label="调理建议">
              <el-input
                v-model="recommendations[type].dailyTipsText"
                type="textarea"
                :rows="3"
                placeholder="每条建议一行"
              />
            </el-form-item>

            <!-- 推荐产品 -->
            <el-form-item label="推荐产品">
              <div class="product-list-editor">
                <div
                  v-for="(prod, i) in recommendations[type].products"
                  :key="i"
                  class="product-row"
                >
                  <el-input v-model="prod.sku" placeholder="SKU" style="width: 120px" />
                  <el-input v-model="prod.name" placeholder="产品名称" style="flex: 1" />
                  <el-input-number v-model="prod.price" :min="0" placeholder="价格" />
                  <el-button type="danger" link @click="removeProduct(type, i)">删除</el-button>
                </div>
                <el-button size="small" @click="addProduct(type)">+ 添加产品</el-button>
              </div>
            </el-form-item>

            <!-- 推荐食谱 -->
            <el-form-item label="推荐食谱">
              <div class="recipe-list-editor">
                <div
                  v-for="(recipe, i) in recommendations[type].recipes"
                  :key="i"
                  class="recipe-row"
                >
                  <el-input v-model="recipe.name" placeholder="食谱名称" style="width: 140px" />
                  <el-input v-model="recipe.ingredientsText" placeholder="食材（逗号分隔）" style="flex: 1" />
                  <el-button type="danger" link @click="removeRecipe(type, i)">删除</el-button>
                </div>
                <el-button size="small" @click="addRecipe(type)">+ 添加食谱</el-button>
              </div>
            </el-form-item>

            <!-- 推荐课程 -->
            <el-form-item label="推荐课程">
              <div class="course-editor">
                <el-input v-model="recommendations[type].course.sku" placeholder="课程SKU" style="width: 160px" />
                <el-input v-model="recommendations[type].course.name" placeholder="课程名称" style="flex: 1" />
                <el-input-number v-model="recommendations[type].course.price" :min="0" placeholder="价格" />
              </div>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const API_BASE = '/api/admin'

const constitutionTypes = [
  '平和质', '气虚质', '阳虚质', '阴虚质', '痰湿质',
  '湿热质', '血瘀质', '气郁质', '特禀质',
]

const activeType = ref('气虚质')

interface Product { sku: string; name: string; price: number; cover_image?: string; tags?: string[] }
interface Recipe { name: string; ingredients: string[]; method?: string; suitable?: string }

interface TypeRecommendation {
  dailyTips: string[]
  dailyTipsText: string
  products: Product[]
  recipes: Recipe[]
  course: { sku: string; name: string; description?: string; type: string; price: number }
}

const recommendations = reactive<Record<string, TypeRecommendation>>(
  Object.fromEntries(
    constitutionTypes.map(t => [
      t,
      {
        dailyTips: [],
        dailyTipsText: '',
        products: [],
        recipes: [],
        course: { sku: '', name: '', type: '免费科普课', price: 0 },
      },
    ])
  )
)

const loadData = async () => {
  try {
    const res = await axios.get(`${API_BASE}/constitution/recommendations`)
    const data = res.data.data || {}
    for (const type of constitutionTypes) {
      const rec = data[type] || {}
      Object.assign(recommendations[type], {
        dailyTips: rec.dailyTips || [],
        dailyTipsText: (rec.dailyTips || []).join('\n'),
        products: rec.products || [],
        recipes: rec.recipes || [],
        course: rec.course || { sku: '', name: '', type: '免费科普课', price: 0 },
      })
    }
  } catch {
    ElMessage.error('加载推荐方案失败')
  }
}

const addProduct = (type: string) => {
  recommendations[type].products.push({ sku: '', name: '', price: 0 })
}

const removeProduct = (type: string, index: number) => {
  recommendations[type].products.splice(index, 1)
}

const addRecipe = (type: string) => {
  recommendations[type].recipes.push({ name: '', ingredients: [] })
}

const removeRecipe = (type: string, index: number) => {
  recommendations[type].recipes.splice(index, 1)
}

const handleSaveAll = async () => {
  try {
    const payload: Record<string, any> = {}
    for (const type of constitutionTypes) {
      const rec = recommendations[type]
      payload[type] = {
        dailyTips: rec.dailyTipsText.split('\n').filter((t: string) => t.trim()),
        products: rec.products,
        recipes: rec.recipes.map(r => ({
          ...r,
          ingredients: typeof r.ingredients === 'string'
            ? (r.ingredients as string).split(',').map(s => s.trim()).filter(Boolean)
            : r.ingredients,
        })),
        course: rec.course,
      }
    }
    await axios.put(`${API_BASE}/constitution/recommendations`, payload)
    ElMessage.success('保存成功')
  } catch {
    ElMessage.error('保存失败')
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.product-list-editor .product-row,
.recipe-list-editor .recipe-row,
.course-editor {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
</style>