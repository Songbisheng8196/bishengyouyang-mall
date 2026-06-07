<template>
  <div class="product-form">
    <el-card>
      <template #header>
        <div class="card-header">
          <el-button text @click="$router.back()">
            <el-icon><ArrowLeft /></el-icon> 返回
          </el-button>
          <span>{{ isEdit ? '编辑商品' : '新增商品' }}</span>
        </div>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="110px" size="default">
        <!-- 基本信息 -->
        <el-divider content-position="left">基本信息</el-divider>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入商品名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品分类" prop="categoryId">
              <el-select v-model="form.categoryId" placeholder="请选择分类">
                <el-option label="花养膏系列" value="HYG" />
                <el-option label="养生花茶系列" value="HUA" />
                <el-option label="节气养生礼盒" value="GIFT" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品价格" prop="price">
              <el-input-number v-model="form.price" :min="0" :precision="2" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="划线价格">
              <el-input-number v-model="form.originalPrice" :min="0" :precision="2" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品库存" prop="stock">
              <el-input-number v-model="form.stock" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 商品标签 -->
        <el-form-item label="商品标签">
          <el-select v-model="form.tags" multiple filterable allow-create default-first-option placeholder="输入后回车添加标签">
            <el-option v-for="tag in form.tags" :key="tag" :label="tag" :value="tag" />
          </el-select>
        </el-form-item>

        <!-- 商品图片上传 -->
        <el-divider content-position="left">商品图片（最多9张）</el-divider>
        <el-form-item label="商品图片">
          <div class="image-uploader">
            <div class="image-list">
              <div v-for="(img, i) in form.images" :key="i" class="image-item">
                <el-image :src="getImageUrl(img)" fit="cover" class="image-preview" />
                <div class="image-actions">
                  <el-icon @click="moveImage(i, -1)"><ArrowLeft /></el-icon>
                  <el-icon @click="moveImage(i, 1)"><ArrowRight /></el-icon>
                  <el-icon @click="removeImage(i)"><Delete /></el-icon>
                </div>
              </div>
              <el-upload
                v-if="form.images.length < 9"
                class="upload-trigger"
                :show-file-list="false"
                :before-upload="beforeImageUpload"
                :http-request="handleImageUpload"
                accept="image/jpg,image/jpeg,image/png,image/webp"
              >
                <el-icon><Plus /></el-icon>
                <span>上传图片</span>
              </el-upload>
            </div>
            <div class="upload-tip">支持 jpg/png/webp，单张不超过 5MB，拖拽可调整顺序</div>
          </div>
        </el-form-item>

        <!-- 商品详情 -->
        <el-divider content-position="left">商品详情</el-divider>
        <el-form-item label="商品描述">
          <el-input v-model="form.description" type="textarea" :rows="5" placeholder="请输入商品详情描述，支持富文本" />
        </el-form-item>

        <!-- 规格设置 -->
        <el-divider content-position="left">规格设置</el-divider>
        <el-form-item label="商品规格">
          <div class="specs-editor">
            <div v-for="(spec, i) in form.specifications" :key="i" class="spec-row">
              <el-input v-model="spec.name" placeholder="规格名称（如：口味）" style="width: 120px" />
              <el-input
                v-model="spec.optionsText"
                placeholder="规格选项（逗号分隔，如：红枣味,玫瑰味）"
                style="flex: 1"
              />
              <el-button type="danger" link @click="removeSpec(i)">删除</el-button>
            </div>
            <el-button size="small" @click="addSpec">+ 添加规格</el-button>
          </div>
        </el-form-item>

        <!-- 上下架状态 -->
        <el-divider content-position="left">其他</el-divider>
        <el-form-item label="商品状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="0">下架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <div class="form-footer">
        <el-button @click="$router.back()">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSubmit">
          {{ isEdit ? '保存修改' : '确认新增' }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Delete, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import axios from 'axios'

const route = useRoute()
const API_BASE = '/api/admin'
const isEdit = computed(() => !!route.query.id)
const formRef = ref()
const saving = ref(false)

const form = reactive({
  name: '',
  categoryId: '',
  price: 0,
  originalPrice: 0,
  stock: 0,
  tags: [] as string[],
  images: [] as string[],
  description: '',
  specifications: [] as Array<{ name: string; optionsText: string }>,
  status: 1,
})

const rules = {
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  stock: [{ required: true, message: '请输入库存', trigger: 'blur' }],
}

const getImageUrl = (url: string) => {
  if (!url) return ''
  return url.startsWith('http') ? url : `http://localhost:3000${url}`
}

const beforeImageUpload = (file: File) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp']
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!validTypes.includes(file.type)) {
    ElMessage.error('仅支持 jpg/png/webp 格式')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB')
    return false
  }
  return true
}

const handleImageUpload = async (options: any) => {
  const { file } = options
  const fd = new FormData()
  fd.append('file', file)
  try {
    const res = await axios.post(`${API_BASE}/upload/image`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    const url = res.data.data?.url || res.data.data?.path
    if (url) {
      form.images.push(url)
      ElMessage.success('图片上传成功')
    }
  } catch {
    ElMessage.error('图片上传失败')
  }
}

const moveImage = (index: number, direction: number) => {
  const newIndex = index + direction
  if (newIndex < 0 || newIndex >= form.images.length) return
  const temp = form.images[index]
  form.images[index] = form.images[newIndex]
  form.images[newIndex] = temp
}

const removeImage = (index: number) => {
  form.images.splice(index, 1)
}

const addSpec = () => {
  form.specifications.push({ name: '', optionsText: '' })
}

const removeSpec = (index: number) => {
  form.specifications.splice(index, 1)
}

const loadData = async () => {
  if (!route.query.id) return
  try {
    const res = await axios.get(`${API_BASE}/products/${route.query.id}`)
    const data = res.data.data || {}
    Object.assign(form, {
      name: data.name || '',
      categoryId: data.categoryId || '',
      price: data.price || 0,
      originalPrice: data.originalPrice || 0,
      stock: data.stock || 0,
      tags: data.tags || [],
      images: data.images || [],
      description: data.description || '',
      specifications: (data.specifications || []).map((s: any) => ({
        name: s.name || '',
        optionsText: Array.isArray(s.options) ? s.options.join(',') : '',
      })),
      status: data.status || 1,
    })
  } catch {
    ElMessage.error('加载商品数据失败')
  }
}

const handleSubmit = async () => {
  try {
    await (formRef.value as any).validate()
    saving.value = true
    const payload = {
      ...form,
      specifications: form.specifications.map(s => ({
        name: s.name,
        options: s.optionsText.split(',').map(o => o.trim()).filter(Boolean),
      })),
    }
    if (isEdit.value) {
      await axios.put(`${API_BASE}/products/${route.query.id}`, payload)
    } else {
      await axios.post(`${API_BASE}/products`, payload)
    }
    ElMessage.success(isEdit.value ? '保存成功' : '新增成功')
    // eslint-disable-next-line no-undef
    history.back()
  } catch {
    ElMessage.error('保存失败，请检查表单')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.image-item {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #ebeef5;
}
.image-preview {
  width: 100%;
  height: 100%;
}
.image-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 4px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}
.upload-trigger {
  width: 100px;
  height: 100px;
  border: 2px dashed #dcdfe6;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #909399;
  cursor: pointer;
  font-size: 12px;
}
.upload-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}
.specs-editor .spec-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 0 0;
  border-top: 1px solid #ebeef5;
  margin-top: 16px;
}
</style>