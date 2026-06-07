<template>
  <div class="health-list">
    <el-card>
      <template #header>
        <span>健康档案</span>
      </template>

      <!-- 搜索表单 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="会员">
          <el-input v-model="searchForm.memberName" placeholder="请输入会员名" clearable />
        </el-form-item>
        <el-form-item label="健康状况">
          <el-select v-model="searchForm.healthStatus" placeholder="请选择" clearable>
            <el-option label="健康" :value="1" />
            <el-option label="亚健康" :value="2" />
            <el-option label="需关注" :value="3" />
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
        <el-table-column prop="memberName" label="会员" width="120" />
        <el-table-column prop="mobile" label="手机号" width="130" />
        <el-table-column prop="age" label="年龄" width="80" />
        <el-table-column prop="gender" label="性别" width="80">
          <template #default="{ row }">
            {{ row.gender === 1 ? '男' : '女' }}
          </template>
        </el-table-column>
        <el-table-column prop="constitutionType" label="体质类型" width="120">
          <template #default="{ row }">
            <el-tag type="success">{{ row.constitutionType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="healthStatus" label="健康状况" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.healthStatus)" size="small">
              {{ getStatusName(row.healthStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastCheckTime" label="最近体检" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)">查看详情</el-button>
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

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailDialogVisible" title="健康档案详情" width="800px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="姓名">{{ currentRecord.memberName }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ currentRecord.mobile }}</el-descriptions-item>
        <el-descriptions-item label="年龄">{{ currentRecord.age }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ currentRecord.gender === 1 ? '男' : '女' }}</el-descriptions-item>
        <el-descriptions-item label="体质类型">
          <el-tag type="success">{{ currentRecord.constitutionType }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="健康状况">
          <el-tag :type="getStatusType(currentRecord.healthStatus)">
            {{ getStatusName(currentRecord.healthStatus) }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
      
      <el-divider content-position="left">健康摘要</el-divider>
      <div class="health-summary">
        <p>{{ currentRecord.healthSummary || '暂无健康摘要信息' }}</p>
      </div>
      
      <el-divider content-position="left">健康建议</el-divider>
      <div class="health-advice">
        <p>{{ currentRecord.healthAdvice || '暂无健康建议' }}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const searchForm = reactive({
  memberName: '',
  healthStatus: ''
})

const tableData = ref([])
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const detailDialogVisible = ref(false)
const currentRecord = ref({})

const statusMap = {
  1: { name: '健康', type: 'success' },
  2: { name: '亚健康', type: 'warning' },
  3: { name: '需关注', type: 'danger' }
}

const getStatusName = (status) => statusMap[status]?.name || '-'
const getStatusType = (status) => statusMap[status]?.type || 'info'

const handleSearch = () => {
  console.log('搜索健康档案')
}

const handleReset = () => {
  searchForm.memberName = ''
  searchForm.healthStatus = ''
  handleSearch()
}

const handleView = (row) => {
  currentRecord.value = row
  detailDialogVisible.value = true
}
</script>

<style scoped>
.health-list {
  padding: 20px;
}

.search-form {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.health-summary,
.health-advice {
  padding: 10px;
  line-height: 1.8;
  color: #333;
}
</style>
