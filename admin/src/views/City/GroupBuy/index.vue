<template>
  <div class="groupbuy-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>拼团活动管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增活动
          </el-button>
        </div>
      </template>

      <!-- 搜索表单 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="活动名称">
          <el-input v-model="searchForm.title" placeholder="请输入活动名称" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="进行中" :value="1" />
            <el-option label="已结束" :value="2" />
            <el-option label="未开始" :value="0" />
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
        <el-table-column prop="title" label="活动名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="productName" label="商品" width="150" show-overflow-tooltip />
        <el-table-column prop="groupPrice" label="拼团价" width="100">
          <template #default="{ row }">
            <span style="color: #F56C6C; font-weight: bold">¥{{ row.groupPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="originalPrice" label="原价" width="100">
          <template #default="{ row }">
            <span style="text-decoration: line-through; color: #999">¥{{ row.originalPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="groupSize" label="成团人数" width="100" />
        <el-table-column prop="signUpCount" label="已参与" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusName(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="info" size="small" @click="handleGroups(row)">查看团</el-button>
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
        <el-form-item label="活动名称">
          <el-input v-model="formData.title" placeholder="请输入活动名称" />
        </el-form-item>
        <el-form-item label="选择商品">
          <el-select v-model="formData.productId" placeholder="请选择商品">
            <el-option label="商品1" :value="1" />
            <el-option label="商品2" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="拼团价格">
          <el-input-number v-model="formData.groupPrice" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="成团人数">
          <el-input-number v-model="formData.groupSize" :min="2" />
        </el-form-item>
        <el-form-item label="活动时间">
          <el-date-picker
            v-model="formData.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="活动规则">
          <el-input v-model="formData.rule" type="textarea" :rows="3" placeholder="请输入活动规则" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 查看团弹窗 -->
    <el-dialog v-model="groupsDialogVisible" title="团购详情" width="900px">
      <el-table :data="groupList" border stripe>
        <el-table-column prop="groupNo" label="团编号" width="150" />
        <el-table-column prop="leaderName" label="团长" width="120" />
        <el-table-column prop="memberCount" label="已参团人数" width="120">
          <template #default="{ row }">
            {{ row.memberCount }}/{{ row.groupSize }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
              {{ row.status === 1 ? '已成团' : '拼团中' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="截止时间" width="180" />
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button type="primary" size="small">查看详情</el-button>
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
const dialogTitle = ref('新增活动')
const formData = reactive({
  id: null,
  title: '',
  productId: '',
  groupPrice: 0,
  groupSize: 2,
  dateRange: '',
  rule: ''
})

const groupsDialogVisible = ref(false)
const groupList = ref([])

const statusMap = {
  0: { name: '未开始', type: 'info' },
  1: { name: '进行中', type: 'success' },
  2: { name: '已结束', type: 'warning' }
}

const getStatusName = (status) => statusMap[status]?.name || '-'
const getStatusType = (status) => statusMap[status]?.type || 'info'

const handleSearch = () => {
  console.log('搜索拼团活动')
}

const handleReset = () => {
  searchForm.title = ''
  searchForm.status = ''
  handleSearch()
}

const handleAdd = () => {
  dialogTitle.value = '新增活动'
  resetForm()
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑活动'
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleSubmit = () => {
  ElMessage.success('操作成功')
  dialogVisible.value = false
}

const handleGroups = (row) => {
  groupList.value = []
  groupsDialogVisible.value = true
}

const resetForm = () => {
  formData.id = null
  formData.title = ''
  formData.productId = ''
  formData.groupPrice = 0
  formData.groupSize = 2
  formData.dateRange = ''
  formData.rule = ''
}
</script>

<style scoped>
.groupbuy-list {
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
