<template>
  <div class="checkin-manage">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>打卡记录管理</span>
          <el-button type="primary" @click="loadData">刷新</el-button>
        </div>
      </template>

      <!-- 统计卡片 -->
      <el-row :gutter="20" class="stat-cards">
        <el-col :span="6">
          <el-statistic title="今日打卡人数" :value="stats.todayCount" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="本周打卡人数" :value="stats.weekCount" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="本月打卡人数" :value="stats.monthCount" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="累计积分发放" :value="stats.totalPoints" suffix="积分" />
        </el-col>
      </el-row>

      <!-- 筛选表单 -->
      <el-form :inline="true" class="search-form">
        <el-form-item label="打卡类型">
          <el-select v-model="query.type" placeholder="全部" clearable style="width: 160px">
            <el-option label="产品食用" value="product" />
            <el-option label="饮水记录" value="water" />
            <el-option label="作息记录" value="sleep" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker v-model="query.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 240px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 记录列表 -->
      <el-table :data="tableData" border stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="userNickname" label="用户昵称" width="120" />
        <el-table-column prop="type" label="打卡类型" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.type === 'product'" type="success">产品食用</el-tag>
            <el-tag v-else-if="row.type === 'water'" type="primary">饮水记录</el-tag>
            <el-tag v-else type="warning">作息记录</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="note" label="打卡备注" min-width="200" show-overflow-tooltip />
        <el-table-column prop="points" label="获得积分" width="100" />
        <el-table-column prop="createdAt" label="打卡时间" width="180" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="viewDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrap">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          @size-change="loadData"
          @current-change="loadData"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

const stats = ref({ todayCount: 0, weekCount: 0, monthCount: 0, totalPoints: 0 })
const tableData = ref<any[]>([])
const query = reactive({ type: '', dateRange: [] as any[] })
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

function loadData() {
  // TODO: 调用 GET /api/admin/checkins 接口
  tableData.value = []
  pagination.total = 0
}

function resetQuery() {
  query.type = ''
  query.dateRange = []
  loadData()
}

function viewDetail(row: any) {
  // TODO: 查看打卡详情
  console.log('查看详情', row)
}

onMounted(loadData)
</script>

<style scoped lang="scss">
.checkin-manage {
  padding: 20px;
  .stat-cards {
    margin-bottom: 20px;
  }
  .search-form {
    margin-bottom: 16px;
  }
  .pagination-wrap {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>