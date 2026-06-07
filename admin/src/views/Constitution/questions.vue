<template>
  <div class="questions-manage">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>体质题目管理</span>
          <el-button type="primary" @click="openAddDialog">
            <el-icon><Plus /></el-icon>
            新增题目
          </el-button>
        </div>
      </template>

      <!-- 按体质分类展示题目 -->
      <div v-for="group in questionGroups" :key="group.type" class="question-group">
        <div class="group-header">
          <el-tag type="info">{{ group.type }}</el-tag>
          <span class="group-count">{{ group.questions.length }} 题</span>
        </div>
        <el-table :data="group.questions" border stripe size="small">
          <el-table-column prop="id" label="ID" width="60" />
          <el-table-column prop="sortOrder" label="排序" width="70" />
          <el-table-column prop="title" label="题目内容" min-width="300" />
          <el-table-column prop="dimension" label="维度" width="100" />
          <el-table-column prop="weightType" label="权重体质" width="100">
            <template #default="{ row }">
              <el-tag size="small" type="warning">{{ row.weightType }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="选项" width="200">
            <template #default="{ row }">
              <span v-for="(opt, i) in row.options" :key="i" class="option-tag">
                {{ opt.label }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160" fixed="right">
            <template #default="{ row }">
              <el-button size="small" type="primary" link @click="openEditDialog(row)">编辑</el-button>
              <el-button size="small" type="danger" link @click="handleDelete(row.id)">删除</el-button>
             <el-button size="small" link :disabled="row.sortOrder <= getMinOrder(group.type)" @click="moveUp(row)">上移</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="editingQuestion ? '编辑题目' : '新增题目'" width="680px">
      <el-form :model="form" label-width="100px" :rules="rules" ref="formRef">
        <el-form-item label="题目内容" prop="title">
          <el-input v-model="form.title" type="textarea" :rows="3" placeholder="请输入题目内容" />
        </el-form-item>
        <el-form-item label="维度" prop="dimension">
          <el-select v-model="form.dimension" placeholder="请选择维度">
            <el-option v-for="d in dimensions" :key="d" :label="d" :value="d" />
          </el-select>
        </el-form-item>
        <el-form-item label="权重体质" prop="weightType">
          <el-select v-model="form.weightType" placeholder="请选择体质">
            <el-option v-for="t in constitutionTypes" :key="t" :label="t" :value="t" />
          </el-select>
        </el-form-item>
        <el-form-item label="选项">
          <div class="options-editor">
            <div v-for="(opt, i) in form.options" :key="i" class="option-row">
              <el-input v-model="opt.label" placeholder="选项文字" style="width: 140px" />
              <span class="score-label">分值：</span>
              <el-input-number v-model="opt.score" :min="1" :max="10" size="small" />
              <el-button size="small" type="danger" link @click="removeOption(i)">删除</el-button>
            </div>
            <el-button size="small" @click="addOption">+ 添加选项</el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import axios from 'axios'

const API_BASE = '/api/admin'

interface Question {
  id: number
  title: string
  options: Array<{ label: string; score: number }>
  dimension: string
  weightType: string
  sortOrder: number
}

const questions = ref<Question[]>([])
const dialogVisible = ref(false)
const editingQuestion = ref<Question | null>(null)
const formRef = ref()

const form = reactive({
  title: '',
  dimension: '',
  weightType: '',
  options: [
    { label: '从不', score: 1 },
    { label: '偶尔', score: 2 },
    { label: '有时', score: 3 },
    { label: '经常', score: 4 },
  ],
})

const rules = {
  title: [{ required: true, message: '请输入题目内容', trigger: 'blur' }],
  dimension: [{ required: true, message: '请选择维度', trigger: 'change' }],
  weightType: [{ required: true, message: '请选择权重体质', trigger: 'change' }],
}

const constitutionTypes = [
  '气虚质', '阳虚质', '阴虚质', '痰湿质', '湿热质',
  '血瘀质', '气郁质', '特禀质', '平和质',
]

const dimensions = [
  '精力', '畏寒', '口干', '体型', '面部', '肤色', '情绪', '过敏', '平和基准', '女性专项',
]

const questionGroups = computed(() => {
  const groups: Record<string, Question[]> = {}
  for (const q of questions.value) {
    const type = q.weightType || '其他'
    if (!groups[type]) groups[type] = []
    groups[type].push(q)
  }
  return Object.entries(groups).map(([type, qs]) => ({ type, questions: qs }))
})

const getMinOrder = (type: string) => {
  const qs = questions.value.filter(q => q.weightType === type)
  return qs.length ? Math.min(...qs.map(q => q.sortOrder)) : 0
}

const loadData = async () => {
  try {
    const res = await axios.get(`${API_BASE}/constitution/questions`)
    questions.value = res.data.data || []
  } catch {
    ElMessage.error('加载题目失败')
  }
}

const openAddDialog = () => {
  editingQuestion.value = null
  Object.assign(form, {
    title: '',
    dimension: '',
    weightType: '',
    options: [
      { label: '从不', score: 1 },
      { label: '偶尔', score: 2 },
      { label: '有时', score: 3 },
      { label: '经常', score: 4 },
    ],
  })
  dialogVisible.value = true
}

const openEditDialog = (row: Question) => {
  editingQuestion.value = row
  Object.assign(form, {
    title: row.title,
    dimension: row.dimension,
    weightType: row.weightType,
    options: row.options.map(o => ({ ...o })),
  })
  dialogVisible.value = true
}

const addOption = () => {
  form.options.push({ label: '', score: 5 })
}

const removeOption = (index: number) => {
  form.options.splice(index, 1)
}

const handleSave = async () => {
  try {
    await (formRef.value as any).validate()
    if (editingQuestion.value) {
      await axios.put(`${API_BASE}/constitution/questions/${editingQuestion.value.id}`, form)
      ElMessage.success('更新成功')
    } else {
      await axios.post(`${API_BASE}/constitution/questions`, form)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    loadData()
  } catch {
    ElMessage.error('保存失败')
  }
}

const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确认删除该题目？', '提示', { type: 'warning' })
    await axios.delete(`${API_BASE}/constitution/questions/${id}`)
    ElMessage.success('删除成功')
    loadData()
  } catch {
    // 用户取消
  }
}

const moveUp = async (row: Question) => {
  if (row.sortOrder <= getMinOrder(row.weightType)) return
  try {
    await axios.put(`${API_BASE}/constitution/questions/${row.id}/sort`, {
      sortOrder: row.sortOrder - 1,
    })
    loadData()
  } catch {
    ElMessage.error('排序失败')
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.question-group {
  margin-bottom: 24px;
}
.group-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}
.group-count {
  color: #909399;
  font-size: 13px;
}
.option-tag {
  display: inline-block;
  background: #f0f9eb;
  color: #67c23a;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 12px;
  margin-right: 4px;
}
.options-editor .option-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.score-label {
  font-size: 13px;
  color: #606266;
}
</style>