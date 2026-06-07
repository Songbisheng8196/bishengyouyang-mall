<template>
  <div class="statistics-page">
    <el-card>
      <template #header>
        <span>统计分析</span>
      </template>

      <!-- 统计概览 -->
      <el-row :gutter="20" class="stats-overview">
        <el-col :xs="12" :sm="8" :md="6" v-for="item in overviewStats" :key="item.title">
          <div class="stat-card" :style="{ backgroundColor: item.color }">
            <div class="stat-icon">
              <el-icon :size="32"><component :is="item.icon" /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ item.value }}</div>
              <div class="stat-title">{{ item.title }}</div>
            </div>
          </div>
        </el-col>
      </el-row>

      <!-- 图表区域 -->
      <el-row :gutter="20" class="charts-row">
        <el-col :xs="24" :lg="12">
          <el-card>
            <template #header>
              <span>销售趋势</span>
            </template>
            <div class="chart-placeholder">
              <el-empty description="图表占位 - 需接入 ECharts" />
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :lg="12">
          <el-card>
            <template #header>
              <span>会员增长</span>
            </template>
            <div class="chart-placeholder">
              <el-empty description="图表占位 - 需接入 ECharts" />
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="charts-row">
        <el-col :xs="24" :lg="12">
          <el-card>
            <template #header>
              <span>商品销量排行</span>
            </template>
            <div class="chart-placeholder">
              <el-empty description="图表占位 - 需接入 ECharts" />
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :lg="12">
          <el-card>
            <template #header>
              <span>门店业绩排行</span>
            </template>
            <div class="chart-placeholder">
              <el-empty description="图表占位 - 需接入 ECharts" />
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 数据表格 -->
      <el-card style="margin-top: 20px;">
        <template #header>
          <span>热门课程排行</span>
        </template>
        <el-table :data="tableData" border stripe>
          <el-table-column prop="rank" label="排名" width="80">
            <template #default="{ $index }">
              <el-tag :type="$index < 3 ? 'danger' : 'info'" size="small">
                TOP {{ $index + 1 }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="课程名称" min-width="200" />
          <el-table-column prop="category" label="分类" width="120" />
          <el-table-column prop="teacher" label="讲师" width="120" />
          <el-table-column prop="studyCount" label="学习人数" width="120" />
          <el-table-column prop="duration" label="总时长" width="120" />
        </el-table>
      </el-card>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Money, ShoppingCart, User, Calendar, TrendCharts, VideoPlay } from '@element-plus/icons-vue'

const overviewStats = ref([
  { title: '今日销售额', value: '¥0', icon: Money, color: '#409EFF' },
  { title: '今日订单', value: '0', icon: ShoppingCart, color: '#67C23A' },
  { title: '会员总数', value: '0', icon: User, color: '#E6A23C' },
  { title: '今日打卡', value: '0', icon: Calendar, color: '#F56C6C' },
  { title: '课程学习', value: '0', icon: VideoPlay, color: '#9C27B0' },
  { title: '转化率', value: '0%', icon: TrendCharts, color: '#00BCD4' }
])

const tableData = ref([])
</script>

<style scoped>
.statistics-page {
  padding: 20px;
}

.stats-overview {
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 8px;
  color: #fff;
  margin-bottom: 20px;
}

.stat-icon {
  margin-right: 15px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
}

.stat-title {
  font-size: 14px;
  opacity: 0.9;
}

.charts-row {
  margin-bottom: 20px;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
