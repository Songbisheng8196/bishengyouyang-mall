<template>
  <div class="report-list">
    <el-card>
      <template #header>
        <span>数据报表</span>
      </template>

      <!-- 报表类型Tab -->
      <el-tabs v-model="activeTab" @tab-change="handleTabChange" class="report-tabs">
        <el-tab-pane label="销售报表" name="sales" />
        <el-tab-pane label="会员报表" name="member" />
        <el-tab-pane label="商品报表" name="product" />
        <el-tab-pane label="订单报表" name="order" />
      </el-tabs>

      <!-- 筛选条件 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>

      <!-- 销售统计卡片 -->
      <el-row :gutter="20" class="stats-row" v-if="activeTab === 'sales'">
        <el-col :xs="12" :sm="6">
          <div class="stat-card">
            <div class="stat-value">¥0</div>
            <div class="stat-label">总销售额</div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="6">
          <div class="stat-card">
            <div class="stat-value">0</div>
            <div class="stat-label">订单数量</div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="6">
          <div class="stat-card">
            <div class="stat-value">0</div>
            <div class="stat-label">客单价</div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="6">
          <div class="stat-card">
            <div class="stat-value">0%</div>
            <div class="stat-label">转化率</div>
          </div>
        </el-col>
      </el-row>

      <!-- 数据表格 -->
      <el-table :data="tableData" border stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="报表名称" min-width="200" />
        <el-table-column prop="value" label="数值" width="150" />
        <el-table-column prop="change" label="环比变化" width="120">
          <template #default="{ row }">
            <span :style="{ color: row.change >= 0 ? '#67C23A' : '#F56C6C' }">
              {{ row.change >= 0 ? '↑' : '↓' }} {{ Math.abs(row.change) }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="统计时间" width="180" />
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
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('sales')
const searchForm = reactive({
  dateRange: ''
})

const tableData = ref([])
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const handleTabChange = (tab) => {
  console.log('切换Tab:', tab)
}

const handleSearch = () => {
  console.log('查询报表')
}

const handleExport = () => {
  ElMessage.success('导出成功')
}
</script>

<style scoped>
.report-list {
  padding: 20px;
}

.report-tabs {
  margin-bottom: 20px;
}

.search-form {
  margin-bottom: 20px;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  background: linear-gradient(135deg, #409EFF 0%, #67C23A 100%);
  color: #fff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
}

.stat-label {
  margin-top: 10px;
  font-size: 14px;
  opacity: 0.9;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
