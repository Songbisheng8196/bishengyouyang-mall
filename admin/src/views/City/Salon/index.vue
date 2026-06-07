<template>
  <div class="salon-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>沙龙管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增沙龙
          </el-button>
        </div>
      </template>

      <!-- 搜索表单 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="沙龙主题">
          <el-input v-model="searchForm.title" placeholder="请输入沙龙主题" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="报名中" :value="1" />
            <el-option label="进行中" :value="2" />
            <el-option label="已结束" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 数据表格 -->
      <el-table :data="tableData" border stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="cover" label="封面" width="120">
          <template #default="{ row }">
            <el-image :src="row.cover" fit="cover" style="width: 80px; height: 60px" />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="沙龙主题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="storeName" label="所属门店" width="150" />
        <el-table-column prop="salonTime" label="沙龙时间" width="180" />
        <el-table-column prop="capacity" label="人数上限" width="100" />
        <el-table-column prop="signUpCount" label="已报名" width="100">
          <template #default="{ row }">
            <span style="color: #67C23A">{{ row.signUpCount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusName(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="success" size="small" @click="handleBooking(row)">预约管理</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="700px">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="沙龙主题">
          <el-input v-model="formData.title" placeholder="请输入沙龙主题" />
        </el-form-item>
        <el-form-item label="所属门店">
          <el-select v-model="formData.storeId" placeholder="请选择门店">
            <el-option label="门店1" :value="1" />
            <el-option label="门店2" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="沙龙时间">
          <el-date-picker
            v-model="formData.salonTime"
            type="datetime"
            placeholder="选择沙龙时间"
          />
        </el-form-item>
        <el-form-item label="人数上限">
          <el-input-number v-model="formData.capacity" :min="1" />
        </el-form-item>
        <el-form-item label="封面图片">
          <el-upload action="#" :auto-upload="false" :show-file-list="false">
            <el-button>上传封面</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="沙龙内容">
          <el-input v-model="formData.content" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">报名中</el-radio>
            <el-radio :label="2">进行中</el-radio>
            <el-radio :label="3">已结束</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 预约管理弹窗 -->
    <el-dialog v-model="bookingDialogVisible" title="预约管理" width="900px">
      <el-table :data="bookingList" border stripe>
        <el-table-column prop="memberName" label="预约人" width="120" />
        <el-table-column prop="mobile" label="手机号" width="130" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
              {{ row.status === 1 ? '已签到' : '待签到' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="bookTime" label="预约时间" width="180" />
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button v-if="row.status === 0" type="success" size="small">签到</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({
  title: '',
  status: ''
})

const tableData = ref([])
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const dialogVisible = ref(false)
const dialogTitle = ref('新增沙龙')
const formData = reactive({
  id: null,
  title: '',
  storeId: '',
  salonTime: '',
  capacity: 20,
  cover: '',
  content: '',
  status: 1
})

const bookingDialogVisible = ref(false)
const bookingList = ref([])

const statusMap = {
  1: { name: '报名中', type: 'primary' },
  2: { name: '进行中', type: 'success' },
  3: { name: '已结束', type: 'info' }
}

const getStatusName = (status) => statusMap[status]?.name || '-'
const getStatusType = (status) => statusMap[status]?.type || 'info'

const handleSearch = () => {
  console.log('搜索沙龙')
}

const handleReset = () => {
  searchForm.title = ''
  searchForm.status = ''
  handleSearch()
}

const handleAdd = () => {
  dialogTitle.value = '新增沙龙'
  resetForm()
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑沙龙'
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleSubmit = () => {
  ElMessage.success('操作成功')
  dialogVisible.value = false
}

const handleBooking = (row) => {
  bookingList.value = []
  bookingDialogVisible.value = true
}

const resetForm = () => {
  formData.id = null
  formData.title = ''
  formData.storeId = ''
  formData.salonTime = ''
  formData.capacity = 20
  formData.cover = ''
  formData.content = ''
  formData.status = 1
}
</script>

<style scoped>
.salon-list {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
