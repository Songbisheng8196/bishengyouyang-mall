<template>
  <div class="dashboard">
    <h2 class="page-title">数据看板</h2>
    
    <el-row :gutter="20" class="stat-cards">
      <el-col :xs="12" :sm="8" :md="6" v-for="item in statCards" :key="item.title">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" :style="{ backgroundColor: item.color }">
              <el-icon :size="24"><component :is="item.icon" /></el-icon>
            </div>
            <div class="stat-info">
              <p class="stat-value">{{ item.value }}</p>
              <p class="stat-title">{{ item.title }}</p>
              <p class="stat-change" :class="item.trend > 0 ? 'up' : 'down'">
                {{ item.trend > 0 ? '↑' : '↓' }} {{ Math.abs(item.trend) }}%
              </p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="charts">
      <el-col :xs="24" :lg="12">
        <el-card>
          <template #header>
            <span>销售趋势</span>
          </template>
          <div class="chart-placeholder">
            <el-empty description="图表占位" />
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card>
          <template #header>
            <span>会员增长</span>
          </template>
          <div class="chart-placeholder">
            <el-empty description="图表占位" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="charts">
      <el-col :xs="24" :lg="12">
        <el-card>
          <template #header>
            <span>课程学习排行</span>
          </template>
          <div class="chart-placeholder">
            <el-empty description="图表占位" />
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card>
          <template #header>
            <span>最近订单</span>
          </template>
          <el-table :data="recentOrders" border size="small">
            <el-table-column prop="orderNo" label="订单号" width="150" />
            <el-table-column prop="memberName" label="会员" width="100" />
            <el-table-column prop="amount" label="金额" width="100">
              <template #default="{ row }">
                ¥{{ row.amount }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getOrderStatusType(row.status)" size="small">
                  {{ row.statusText }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Money, ShoppingCart, User, Calendar, TrendCharts, VideoPlay } from '@element-plus/icons-vue'

const statCards = ref([
  { title: '今日销售额', value: '¥0', icon: Money, color: '#409EFF', trend: 0 },
  { title: '今日订单', value: '0', icon: ShoppingCart, color: '#67C23A', trend: 0 },
  { title: '会员总数', value: '0', icon: User, color: '#E6A23C', trend: 0 },
  { title: '今日打卡', value: '0', icon: Calendar, color: '#F56C6C', trend: 0 },
  { title: '课程学习', value: '0', icon: VideoPlay, color: '#9C27B0', trend: 0 },
  { title: '转化率', value: '0%', icon: TrendCharts, color: '#00BCD4', trend: 0 }
])

const recentOrders = ref([])

const getOrderStatusType = (status) => {
  const map = { 1: 'success', 2: 'warning', 3: 'danger', 0: 'info' }
  return map[status] || 'info'
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.page-title {
  margin-bottom: 20px;
  font-size: 20px;
  color: #333;
}

.stat-cards {
  margin-bottom: 20px;
}

.stat-card {
  margin-bottom: 20px;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.stat-title {
  margin: 5px 0 0;
  font-size: 14px;
  color: #666;
}

.stat-change {
  margin: 5px 0 0;
  font-size: 12px;
  color: #999;
}

.stat-change.up {
  color: #67C23A;
}

.stat-change.down {
  color: #F56C6C;
}

.charts {
  margin-bottom: 20px;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
