<template>
  <div class="constitution-manage">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>体质档案管理</span>
          <el-button type="primary" @click="loadData">刷新</el-button>
        </div>
      </template>

      <!-- 体质分布统计 -->
      <el-row :gutter="20" class="stat-cards">
        <el-col v-for="item in stats" :key="item.type" :span="4">
          <div class="stat-item">
            <span class="stat-label">{{ item.typeName }}</span>
            <span class="stat-value">{{ item.count }}人</span>
          </div>
        </el-col>
      </el-row>

      <!-- 筛选 -->
      <el-form :inline="true" class="search-form">
        <el-form-item label="体质类型">
          <el-select v-model="query.constitutionType" placeholder="全部" clearable style="width: 140px">
            <el-option v-for="s in stats" :key="s.type" :label="s.typeName" :value="s.type" />
          </el-select>
        </el-form-item>
        <el-form-item label="提交时间">
          <el-date-picker v-model="query.dateRange" type="daterange" range-separator="至" start-placeholder="开始" end-placeholder="结束" style="width: 240px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 列表 -->
      <el-table :data="tableData" border stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="userNickname" label="用户昵称" width="120" />
        <el-table-column prop="constitutionType" label="体质类型" width="100">
          <template #default="{ row }">
            <el-tag type="success">{{ row.constitutionTypeName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="score" label="匹配度" width="80" />
        <el-table-column prop="createdAt" label="测评时间" width="180" />
        <el-table-column prop="recommendProducts" label="推荐产品" min-width="200" show-overflow-tooltip />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="viewReport(row)">查看报告</el-button>
            <el-button type="info" link size="small" @click="viewRecommend(row)">推荐方案</el-button>
          </template>
        </el-table-column>
      </el-table>

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

const stats = ref<any[]>([])
const tableData = ref<any[]>([])
const query = reactive({ constitutionType: '', dateRange: [] as any[] })
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

function loadData() {
  // TODO: 调用 GET /api/admin/constitution 接口
  stats.value = [
    { type: 'qiXu', typeName: '气虚质', count: 0 },
    { type: 'yinXu', typeName: '阴虚质', count: 0 },
    { type: 'yangXu', typeName: '阳虚质', count: 0 },
    { type: 'qiYe', typeName: '气郁质', count: 0 },
    { type: 'teNi', typeName: '特禀质', count: 0 },
    { type: 'pingHe', typeName: '平和质', count: 0 },
    { type: 'tanShi', typeName: '痰湿质', count: 0 },
    { type: 'shiRe', typeName: '湿热质', count: 0 },
    { type: 'xueYu', typeName: '血瘀质', count: 0 },
  ]
  tableData.value = []
  pagination.total = 0
}

function resetQuery() {
  query.constitutionType = ''
  query.dateRange = []
  loadData()
}

function viewReport(row: any) { console.log('查看报告', row) }
function viewRecommend(row: any) { console.log('推荐方案', row) }

onMounted(loadData)
</script>

<style scoped lang="scss">
.constitution-manage {
  padding: 20px;
  .stat-cards {
    margin-bottom: 20px;
  }
  .stat-item {
    text-align: center;
    padding: 12px;
    background: #f5f7fa;
    border-radius: 8px;
    .stat-label { display: block; font-size: 13px; color: #666; }
    .stat-value { display: block; font-size: 20px; color: #333; font-weight: bold; margin-top: 4px; }
  }
  .search-form { margin-bottom: 16px; }
  .pagination-wrap { margin-top: 16px; display: flex; justify-content: flex-end; }
  .card-header { display: flex; justify-content: space-between; align-items: center; }
}
</style>