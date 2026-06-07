<template>
  <div class="coupon-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>优惠券管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增优惠券
          </el-button>
        </div>
      </template>

      <!-- 搜索表单 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="优惠券名称">
          <el-input v-model="searchForm.name" placeholder="请输入优惠券名称" clearable />
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
        <el-table-column prop="name" label="优惠券名称" min-width="180" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 1 ? 'success' : 'primary'" size="small">
              {{ row.type === 1 ? '满减券' : '折扣券' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="优惠金额" width="100">
          <template #default="{ row }">
            {{ row.type === 1 ? '¥' + row.value : row.value + '折' }}
          </template>
        </el-table-column>
        <el-table-column prop="minAmount" label="使用门槛" width="120">
          <template #default="{ row }">
            满{{ row.minAmount }}元
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="发放数量" width="100" />
        <el-table-column prop="usedCount" label="已使用" width="100">
          <template #default="{ row }">
            <span style="color: #67C23A">{{ row.usedCount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusName(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="有效期" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="success" size="small" @click="handleDistribute(row)">发放</el-button>
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
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="优惠券名称">
          <el-input v-model="formData.name" placeholder="请输入优惠券名称" />
        </el-form-item>
        <el-form-item label="优惠券类型">
          <el-radio-group v-model="formData.type">
            <el-radio :label="1">满减券</el-radio>
            <el-radio :label="2">折扣券</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="优惠金额">
          <el-input-number v-model="formData.value" :min="0" />
        </el-form-item>
        <el-form-item label="使用门槛">
          <el-input-number v-model="formData.minAmount" :min="0" />
          <span style="margin-left: 10px">元</span>
        </el-form-item>
        <el-form-item label="发放数量">
          <el-input-number v-model="formData.stock" :min="1" />
        </el-form-item>
        <el-form-item label="有效期">
          <el-date-picker
            v-model="formData.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="使用说明">
          <el-input v-model="formData.description" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 发放弹窗 -->
    <el-dialog v-model="distributeDialogVisible" title="发放优惠券" width="500px">
      <el-form :model="distributeForm" label-width="100px">
        <el-form-item label="发放方式">
          <el-radio-group v-model="distributeForm.type">
            <el-radio label="all">全部会员</el-radio>
            <el-radio label="level">指定等级</el-radio>
            <el-radio label="member">指定会员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="distributeForm.type === 'level'" label="会员等级">
          <el-select v-model="distributeForm.level" placeholder="请选择等级">
            <el-option label="普通会员" :value="1" />
            <el-option label="银卡会员" :value="2" />
            <el-option label="金卡会员" :value="3" />
            <el-option label="钻石会员" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="distributeForm.type === 'member'" label="选择会员">
          <el-select v-model="distributeForm.memberIds" multiple placeholder="请选择会员">
            <el-option label="会员1" :value="1" />
            <el-option label="会员2" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="发放数量">
          <el-input-number v-model="distributeForm.count" :min="1" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="distributeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleDistributeSubmit">确认发放</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({
  name: '',
  status: ''
})

const tableData = ref([])
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const dialogVisible = ref(false)
const dialogTitle = ref('新增优惠券')
const formData = reactive({
  id: null,
  name: '',
  type: 1,
  value: 10,
  minAmount: 100,
  stock: 100,
  dateRange: '',
  description: ''
})

const distributeDialogVisible = ref(false)
const distributeForm = reactive({
  type: 'all',
  level: '',
  memberIds: [],
  count: 1
})

const statusMap = {
  0: { name: '未开始', type: 'info' },
  1: { name: '进行中', type: 'success' },
  2: { name: '已结束', type: 'warning' }
}

const getStatusName = (status) => statusMap[status]?.name || '-'
const getStatusType = (status) => statusMap[status]?.type || 'info'

const handleSearch = () => {
  console.log('搜索优惠券')
}

const handleReset = () => {
  searchForm.name = ''
  searchForm.status = ''
  handleSearch()
}

const handleAdd = () => {
  dialogTitle.value = '新增优惠券'
  resetForm()
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑优惠券'
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleSubmit = () => {
  ElMessage.success('操作成功')
  dialogVisible.value = false
}

const handleDistribute = (row) => {
  distributeForm.type = 'all'
  distributeForm.level = ''
  distributeForm.memberIds = []
  distributeForm.count = 1
  distributeDialogVisible.value = true
}

const handleDistributeSubmit = () => {
  ElMessage.success('发放成功')
  distributeDialogVisible.value = false
}

const resetForm = () => {
  formData.id = null
  formData.name = ''
  formData.type = 1
  formData.value = 10
  formData.minAmount = 100
  formData.stock = 100
  formData.dateRange = ''
  formData.description = ''
}
</script>

<style scoped>
.coupon-list {
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
