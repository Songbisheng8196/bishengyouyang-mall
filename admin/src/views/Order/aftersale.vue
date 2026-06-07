<template>
  <div class="aftersale-list">
    <el-card>
      <template #header>
        <span>售后处理</span>
      </template>

      <!-- 状态Tab -->
      <el-tabs v-model="activeTab" @tab-change="handleTabChange" class="aftersale-tabs">
        <el-tab-pane label="全部" name="all" />
        <el-tab-pane label="待处理" name="pending" />
        <el-tab-pane label="处理中" name="processing" />
        <el-tab-pane label="已完成" name="completed" />
        <el-tab-pane label="已拒绝" name="rejected" />
      </el-tabs>

      <!-- 数据表格 -->
      <el-table :data="tableData" border stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column prop="memberName" label="申请人" width="120" />
        <el-table-column prop="type" label="售后类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 1 ? 'warning' : 'primary'" size="small">
              {{ row.type === 1 ? '退款' : '退货退款' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="退款金额" width="100">
          <template #default="{ row }">
            ¥{{ row.amount }}
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="售后原因" min-width="200" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusName(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="申请时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)">处理</el-button>
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

    <!-- 处理弹窗 -->
    <el-dialog v-model="dialogVisible" title="处理售后" width="600px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单号">{{ currentAftersale.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="申请人">{{ currentAftersale.memberName }}</el-descriptions-item>
        <el-descriptions-item label="售后类型">
          {{ currentAftersale.type === 1 ? '退款' : '退货退款' }}
        </el-descriptions-item>
        <el-descriptions-item label="退款金额">¥{{ currentAftersale.amount }}</el-descriptions-item>
        <el-descriptions-item label="售后原因" :span="2">{{ currentAftersale.reason }}</el-descriptions-item>
        <el-descriptions-item label="申请时间">{{ currentAftersale.createTime }}</el-descriptions-item>
      </el-descriptions>

      <el-divider />

      <el-form :model="handleForm" label-width="100px">
        <el-form-item label="处理结果">
          <el-radio-group v-model="handleForm.result">
            <el-radio label="approve">同意</el-radio>
            <el-radio label="reject">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="handleForm.remark" type="textarea" :rows="3" placeholder="请输入处理备注" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('all')
const tableData = ref([])
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const dialogVisible = ref(false)
const currentAftersale = ref({})
const handleForm = reactive({
  result: 'approve',
  remark: ''
})

const statusMap = {
  0: { name: '待处理', type: 'warning' },
  1: { name: '处理中', type: 'primary' },
  2: { name: '已完成', type: 'success' },
  3: { name: '已拒绝', type: 'danger' }
}

const getStatusName = (status) => statusMap[status]?.name || '-'
const getStatusType = (status) => statusMap[status]?.type || 'info'

const handleTabChange = (tab) => {
  console.log('切换Tab:', tab)
}

const handleView = (row) => {
  currentAftersale.value = row
  handleForm.result = 'approve'
  handleForm.remark = ''
  dialogVisible.value = true
}

const handleSubmit = () => {
  ElMessage.success('处理成功')
  dialogVisible.value = false
}
</script>

<style scoped>
.aftersale-list {
  padding: 20px;
}

.aftersale-tabs {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
