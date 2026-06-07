<template>
  <div class="product-import">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>批量导入商品</span>
          <el-button text @click="$router.back()">
            <el-icon><ArrowLeft /></el-icon> 返回
          </el-button>
        </div>
      </template>

      <el-steps :active="step" finish-status="success" style="margin-bottom: 32px">
        <el-step title="粘贴或上传JSON" />
        <el-step title="预览导入数据" />
        <el-step title="确认导入" />
      </el-steps>

      <!-- Step 1: 粘贴或上传 -->
      <div v-if="step === 0" class="step-content">
        <el-alert type="info" :closable="false" style="margin-bottom: 16px">
          请粘贴 JSON 格式的商品列表，或上传 .json 文件。单个文件不超过 100 条记录。
         <el-link href="/templates/product-import.json" style="margin-left: 8px" download>下载模板</el-link>
        </el-alert>

        <el-radio-group v-model="inputMode" style="margin-bottom: 16px">
          <el-radio label="paste">粘贴 JSON</el-radio>
          <el-radio label="upload">上传文件</el-radio>
        </el-radio-group>

        <div v-if="inputMode === 'paste'">
          <el-input
            v-model="jsonText"
            type="textarea"
            :rows="12"
            placeholder='[{"name":"花养膏·红枣味","categoryId":"HYG","price":128,"stock":100}, ...]'
            style="font-family: monospace"
          />
         <el-button type="primary" style="margin-top: 12px" @click="parseJson">解析数据</el-button>
        </div>

        <div v-else>
          <el-upload
            ref="uploadRef"
            :auto-upload="false"
            :limit="1"
            accept=".json"
            :on-change="handleFileChange"
            drag
          >
            <el-icon><UploadFilled /></el-icon>
            <div>将 JSON 文件拖到此处，或 <em>点击上传</em></div>
          </el-upload>
          <el-button type="primary" style="margin-top: 12px" @click="parseFile">解析文件</el-button>
        </div>

        <div v-if="jsonError" class="error-msg">
          <el-alert type="error" :title="jsonError" :closable="false" />
        </div>
      </div>

      <!-- Step 2: 预览 -->
      <div v-if="step === 1" class="step-content">
        <el-alert type="success" style="margin-bottom: 16px">
          共 {{ previewData.length }} 条商品待导入，其中 {{ errorCount }} 条存在格式问题（已标红）
        </el-alert>

        <el-table :data="previewData" border stripe max-height="400">
          <el-table-column prop="name" label="商品名称" min-width="180">
            <template #default="{ row }">
              <span :class="{ 'row-error': row._error }">{{ row.name || '(未填)' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="categoryId" label="分类" width="100">
            <template #default="{ row }">
              <span :class="{ 'row-error': row._error }">{{ row.categoryId || '(未填)' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="价格" width="90">
            <template #default="{ row }">
              <span :class="{ 'row-error': row._error }">{{ row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="stock" label="库存" width="90" />
          <el-table-column label="错误信息" min-width="150">
            <template #default="{ row }">
              <span v-if="row._error" class="error-text">{{ row._error }}</span>
            </template>
          </el-table-column>
        </el-table>

        <div style="margin-top: 16px; display: flex; gap: 12px">
          <el-button @click="step = 0">上一步</el-button>
          <el-button type="primary" :disabled="errorCount > 0" @click="doImport">
            确认导入
          </el-button>
        </div>
      </div>

      <!-- Step 3: 结果 -->
      <div v-if="step === 2" class="step-content">
        <el-result
          :icon="importResult.success > 0 ? 'success' : 'error'"
          :title="importResult.success > 0 ? '导入完成' : '导入失败'"
        >
          <template #sub-title>
            <p>成功：{{ importResult.success }} 条</p>
            <p v-if="importResult.failed > 0">失败：{{ importResult.failed }} 条</p>
          </template>
          <template #extra>
            <el-button @click="reset">重新导入</el-button>
           <el-button type="primary" @click="$router.back()">返回列表</el-button>
          </template>
        </el-result>

        <el-table v-if="importResult.errors?.length" :data="importResult.errors" border stripe style="margin-top: 16px">
          <el-table-column prop="index" label="行号" width="70" />
          <el-table-column prop="message" label="错误原因" />
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled, ArrowLeft } from '@element-plus/icons-vue'
import axios from 'axios'

const API_BASE = '/api/admin'
const step = ref(0)
const inputMode = ref('paste')
const jsonText = ref('')
const jsonError = ref('')
const previewData = ref<any[]>([])
const errorCount = ref(0)
const importResult = reactive({ success: 0, failed: 0, errors: [] as any[] })

const validateRow = (row: any, index: number) => {
  const errors: string[] = []
  if (!row.name) errors.push('name 不能为空')
  if (row.price === undefined || row.price === null) errors.push('price 不能为空')
  if (!row.categoryId) errors.push('categoryId 不能为空')
  if (errors.length) {
    row._error = errors.join('；')
  }
  return errors.length === 0
}

const parseJson = () => {
  jsonError.value = ''
  try {
    const data = JSON.parse(jsonText.value)
    if (!Array.isArray(data)) throw new Error('JSON根节点必须是数组 []')
    previewData.value = data.map((row, i) => ({ ...row, _index: i }))
    errorCount.value = previewData.value.filter(r => validateRow(r, i)).length
    //故意把有错误的也计为 valid，然后 step up
    errorCount.value = previewData.value.filter(r => r._error).length
    step.value = 1
  } catch (e: any) {
    jsonError.value = `JSON 格式错误：${e.message}`
  }
}

const handleFileChange = (file: any) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    jsonText.value = e.target?.result as string || ''
  }
  reader.readAsText(file.raw)
}

const parseFile = () => {
  parseJson()
}

const doImport = async () => {
  try {
    const res = await axios.post(`${API_BASE}/products/batch-import`, {
      products: previewData.value.map(({ _error, _index, ...rest }) => rest),
    })
    const data = res.data.data || {}
    importResult.success = data.success || 0
    importResult.failed = data.failed || 0
    importResult.errors = data.errors || []
    step.value = 2
  } catch {
    ElMessage.error('导入请求失败')
  }
}

const reset = () => {
  step.value = 0
  jsonText.value = ''
  previewData.value = []
  errorCount.value = 0
}
</script>

<style scoped>
.step-content {
  padding: 8px 0;
}
.error-msg {
  margin-top: 12px;
}
.row-error {
  color: #f56c6c;
  text-decoration: line-through;
}
.error-text {
  color: #f56c6c;
  font-size: 12px;
}
</style>