<template>
  <div class="course-form">
    <el-card>
      <template #header>
        <div class="card-header">
          <el-button text @click="$router.back()">
            <el-icon><ArrowLeft /></el-icon> 返回
          </el-button>
          <span>{{ isEdit ? '编辑课程' : '新增课程' }}</span>
        </div>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="110px" size="default">
        <!-- 基本信息 -->
        <el-divider content-position="left">课程信息</el-divider>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="课程标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入课程标题" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程类型" prop="categoryType">
              <el-select v-model="form.categoryType" placeholder="请选择课程类型">
                <el-option label="免费科普课" value="免费" />
                <el-option label="会员专享课" value="会员" />
                <el-option label="配套课程" value="配套" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程时长（秒）">
              <el-input-number v-model="form.duration" :min="60" :step="60" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col v-if="form.categoryType === '会员'" :span="12">
            <el-form-item label="会员等级">
              <el-select v-model="form.memberLevel" placeholder="请选择会员等级">
                <el-option label="银卡会员" :value="1" />
                <el-option label="金卡会员" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="课程简介">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入课程简介" />
        </el-form-item>

        <!-- 封面图 -->
        <el-divider content-position="left">封面图</el-divider>
        <el-form-item label="课程封面">
          <div class="cover-uploader">
            <el-image
              v-if="form.coverImage"
              :src="getImageUrl(form.coverImage)"
              fit="cover"
              class="cover-preview"
            />
            <el-upload
              :show-file-list="false"
              :before-upload="beforeImageUpload"
              :http-request="handleCoverUpload"
              accept="image/jpg,image/jpeg,image/png,image/webp"
            >
              <el-button size="small">
                <el-icon><UploadFilled /></el-icon>
                {{ form.coverImage ? '更换封面' : '上传封面' }}
              </el-button>
            </el-upload>
          </div>
        </el-form-item>

        <!-- 视频上传 -->
        <el-divider content-position="left">课程视频</el-divider>
        <el-form-item label="课程视频">
          <div class="video-uploader">
            <div v-if="form.videoUrl" class="video-info">
              <el-icon><VideoPlay /></el-icon>
              <span>已上传：{{ form.videoUrl }}</span>
              <el-button type="danger" size="small" link @click="form.videoUrl = ''">移除</el-button>
            </div>
            <el-upload
              v-else
              :show-file-list="false"
              :before-upload="beforeVideoUpload"
              :http-request="handleVideoUpload"
              accept="video/mp4"
            >
              <el-button size="small">
                <el-icon><UploadFilled /></el-icon>
                上传视频（mp4，最大500MB）
              </el-button>
            </el-upload>
            <div class="upload-tip">支持 mp4 格式，视频将在 Phase3 通过 Seedance AI 自动生成后替换</div>
          </div>
        </el-form-item>

        <!-- 章节编辑 -->
        <el-divider content-position="left">章节设置</el-divider>
        <el-form-item label="课程章节">
          <div class="chapters-editor">
            <div v-for="(ch, i) in form.chapters" :key="i" class="chapter-row">
              <span class="chapter-num">{{ i + 1 }}</span>
              <el-input v-model="ch.title" placeholder="章节标题" style="flex: 2" />
              <el-input v-model="ch.startTime" placeholder="起始时间（如00:00）" style="flex: 1" />
              <el-input v-model="ch.content" placeholder="章节内容摘要" style="flex: 3" />
              <el-button type="danger" link @click="removeChapter(i)">删除</el-button>
            </div>
            <el-button size="small" @click="addChapter">+ 添加章节</el-button>
          </div>
        </el-form-item>

        <!-- 讲义脚本 -->
        <el-divider content-position="left">讲义脚本</el-divider>
        <el-form-item label="课程讲义">
          <el-input
            v-model="form.script"
            type="textarea"
            :rows="8"
            placeholder="输入课程讲义内容（支持 Markdown格式）"
            style="font-family: monospace"
          />
        </el-form-item>

        <!-- 上下架 -->
        <el-form-item label="课程状态">
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
import { UploadFilled, VideoPlay, ArrowLeft } from '@element-plus/icons-vue'
import axios from 'axios'

const route = useRoute()
const API_BASE = '/api/admin'
const isEdit = computed(() => !!route.query.id)
const formRef = ref()
const saving = ref(false)

const form = reactive({
  title: '',
  categoryType: '免费',
  duration: 1800,
  memberLevel: 0,
  description: '',
  coverImage: '',
  videoUrl: '',
  chapters: [] as Array<{ title: string; startTime: string; content: string }>,
  script: '',
  status: 1,
})

const rules = {
  title: [{ required: true, message: '请输入课程标题', trigger: 'blur' }],
  categoryType: [{ required: true, message: '请选择课程类型', trigger: 'change' }],
}

const getImageUrl = (url: string) => {
  if (!url) return ''
  return url.startsWith('http') ? url : `http://localhost:3000${url}`
}

const beforeImageUpload = (file: File) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!validTypes.includes(file.type)) {
    ElMessage.error('仅支持 jpg/png/webp')
    return false
  }
  if (file.size / 1024 / 1024 > 5) {
    ElMessage.error('图片大小不能超过 5MB')
    return false
  }
  return true
}

const beforeVideoUpload = (file: File) => {
  if (!file.type.includes('mp4')) {
    ElMessage.error('仅支持 mp4 格式')
    return false
  }
  if (file.size / 1024 / 1024 > 500) {
    ElMessage.error('视频大小不能超过 500MB')
    return false
  }
  return true
}

const handleCoverUpload = async (options: any) => {
  const fd = new FormData()
  fd.append('file', options.file)
  try {
    const res = await axios.post(`${API_BASE}/upload/image`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    form.coverImage = res.data.data?.url || res.data.data?.path || ''
    ElMessage.success('封面上传成功')
  } catch {
    ElMessage.error('封面上传失败')
  }
}

const handleVideoUpload = async (options: any) => {
  const fd = new FormData()
  fd.append('file', options.file)
  try {
    const res = await axios.post(`${API_BASE}/courses/upload-video`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    form.videoUrl = res.data.data?.url || res.data.data?.path || ''
    ElMessage.success('视频上传成功')
  } catch {
    ElMessage.error('视频上传失败')
  }
}

const addChapter = () => {
  form.chapters.push({ title: '', startTime: '', content: '' })
}

const removeChapter = (index: number) => {
  form.chapters.splice(index, 1)
}

const loadData = async () => {
  if (!route.query.id) return
  try {
    const res = await axios.get(`${API_BASE}/courses/${route.query.id}`)
    const data = res.data.data || {}
    Object.assign(form, {
      title: data.title || '',
      categoryType: data.categoryType || data.type_text?.includes('免费') ? '免费' : '会员',
      duration: data.duration || 1800,
      memberLevel: data.memberLevel || 0,
      description: data.description || '',
      coverImage: data.coverImage || '',
      videoUrl: data.videoUrl || '',
      chapters: data.chapters || [],
      script: data.script || '',
      status: data.status || 1,
    })
  } catch {
    ElMessage.error('加载课程数据失败')
  }
}

const handleSubmit = async () => {
  try {
    await (formRef.value as any).validate()
    saving.value = true
    if (isEdit.value) {
      await axios.put(`${API_BASE}/courses/${route.query.id}`, form)
    } else {
      await axios.post(`${API_BASE}/courses`, form)
    }
    ElMessage.success(isEdit.value ? '保存成功' : '新增成功')
    history.back()
  } catch {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.cover-uploader {
  display: flex;
  align-items: center;
  gap: 16px;
}
.cover-preview {
  width: 200px;
  height: 120px;
  border-radius: 6px;
}
.video-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 4px;
}
.chapters-editor .chapter-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.chapter-num {
  width: 24px;
  text-align: center;
  color: #909399;
  font-size: 12px;
}
.upload-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 6px;
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