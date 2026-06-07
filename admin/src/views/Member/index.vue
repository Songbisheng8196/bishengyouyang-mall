<template>
  <div class="member-list">
    <el-card>
      <template #header>
        <span>会员列表</span>
      </template>

      <!-- 搜索表单 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="手机号">
          <el-input v-model="searchForm.mobile" placeholder="请输入手机号" clearable />
        </el-form-item>
        <el-form-item label="会员等级">
          <el-select v-model="searchForm.level" placeholder="请选择等级" clearable>
            <el-option label="普通会员" :value="1" />
            <el-option label="银卡会员" :value="2" />
            <el-option label="金卡会员" :value="3" />
            <el-option label="钻石会员" :value="4" />
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
        <el-table-column prop="nickname" label="昵称" width="120" />
        <el-table-column prop="mobile" label="手机号" width="130" />
        <el-table-column prop="avatar" label="头像" width="80">
          <template #default="{ row }">
            <el-avatar :size="40" :src="row.avatar" />
          </template>
        </el-table-column>
        <el-table-column prop="level" label="会员等级" width="120">
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.level)" size="small">
              {{ getLevelName(row.level) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="points" label="积分" width="100" />
        <el-table-column prop="balance" label="余额" width="100">
          <template #default="{ row }">
            ¥{{ row.balance }}
          </template>
        </el-table-column>
        <el-table-column prop="constitutionType" label="体质" width="100" />
        <el-table-column prop="createTime" label="注册时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)">查看</el-button>
            <el-button type="warning" size="small" @click="handleAdjustPoints(row)">调积分</el-button>
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

    <!-- 积分调整弹窗 -->
    <el-dialog v-model="pointsDialogVisible" title="调整积分" width="400px">
      <el-form :model="pointsForm" label-width="80px">
        <el-form-item label="当前积分">
          <span>{{ pointsForm.currentPoints }}</span>
        </el-form-item>
        <el-form-item label="调整类型">
          <el-radio-group v-model="pointsForm.type">
            <el-radio label="add">增加</el-radio>
            <el-radio label="reduce">减少</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="积分数量">
          <el-input-number v-model="pointsForm.points" :min="0" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="pointsForm.remark" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="pointsDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handlePointsSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 会员详情弹窗 -->
    <el-dialog v-model="detailDialogVisible" title="会员详情" width="700px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="昵称">{{ currentMember.nickname }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ currentMember.mobile }}</el-descriptions-item>
        <el-descriptions-item label="会员等级">{{ getLevelName(currentMember.level) }}</el-descriptions-item>
        <el-descriptions-item label="积分">{{ currentMember.points }}</el-descriptions-item>
        <el-descriptions-item label="余额">¥{{ currentMember.balance }}</el-descriptions-item>
        <el-descriptions-item label="体质">{{ currentMember.constitutionType }}</el-descriptions-item>
        <el-descriptions-item label="注册时间">{{ currentMember.createTime }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({
  mobile: '',
  level: ''
})

const tableData = ref([])
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const pointsDialogVisible = ref(false)
const pointsForm = reactive({
  memberId: null,
  currentPoints: 0,
  type: 'add',
  points: 0,
  remark: ''
})

const detailDialogVisible = ref(false)
const currentMember = ref({})

const getLevelName = (level) => {
  const map = { 1: '普通会员', 2: '银卡会员', 3: '金卡会员', 4: '钻石会员' }
  return map[level] || '普通会员'
}

const getLevelType = (level) => {
  const map = { 1: 'info', 2: 'success', 3: 'warning', 4: 'danger' }
  return map[level] || 'info'
}

const handleSearch = () => {
  console.log('搜索会员')
}

const handleReset = () => {
  searchForm.mobile = ''
  searchForm.level = ''
  handleSearch()
}

const handleView = (row) => {
  currentMember.value = row
  detailDialogVisible.value = true
}

const handleAdjustPoints = (row) => {
  pointsForm.memberId = row.id
  pointsForm.currentPoints = row.points
  pointsForm.type = 'add'
  pointsForm.points = 0
  pointsForm.remark = ''
  pointsDialogVisible.value = true
}

const handlePointsSubmit = () => {
  ElMessage.success('积分调整成功')
  pointsDialogVisible.value = false
}
</script>

<style scoped>
.member-list {
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
</style>
