<template>
  <div class="city-manage">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>武汉同城管理</span>
          <el-button-group>
            <el-button @click="activeTab = 'store'">门店管理</el-button>
            <el-button @click="activeTab = 'salon'">沙龙管理</el-button>
            <el-button @click="activeTab = 'groupbuy'">拼团活动</el-button>
          </el-button-group>
        </div>
      </template>

      <!-- 门店管理 -->
      <div v-if="activeTab === 'store'">
        <el-button type="primary" style="margin-bottom: 16px" @click="addStore">新增门店</el-button>
        <el-table :data="storeData" border stripe>
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="门店名称" min-width="160" />
          <el-table-column prop="address" label="地址" min-width="240" show-overflow-tooltip />
          <el-table-column prop="phone" label="联系电话" width="130" />
          <el-table-column prop="status" label="状态" width="80">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'info'">{{ row.status === 1 ? '营业中' : '休息' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="editStore(row)">编辑</el-button>
              <el-button type="danger" link size="small" @click="deleteStore(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 沙龙管理 -->
      <div v-if="activeTab === 'salon'">
        <el-button type="primary" style="margin-bottom: 16px" @click="addSalon">新增沙龙</el-button>
        <el-table :data="salonData" border stripe>
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="title" label="沙龙主题" min-width="200" />
          <el-table-column prop="date" label="活动时间" width="120" />
          <el-table-column prop="location" label="活动地点" min-width="160" />
          <el-table-column prop="capacity" label="名额" width="80" />
          <el-table-column prop="registered" label="已报名" width="80" />
          <el-table-column label="操作" width="160" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="viewReservations(row)">预约管理</el-button>
              <el-button type="primary" link size="small" @click="editSalon(row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 拼团活动 -->
      <div v-if="activeTab === 'groupbuy'">
        <el-button type="primary" style="margin-bottom: 16px" @click="addGroupBuy">新建拼团</el-button>
        <el-table :data="groupBuyData" border stripe>
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="productName" label="商品名称" min-width="160" />
          <el-table-column prop="groupPrice" label="拼团价" width="100" />
          <el-table-column prop="originalPrice" label="原价" width="100" />
          <el-table-column prop="startDate" label="开始时间" width="120" />
          <el-table-column prop="endDate" label="结束时间" width="120" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag v-if="row.status === 'ongoing'" type="success">进行中</el-tag>
              <el-tag v-else-if="row.status === 'pending'" type="warning">未开始</el-tag>
              <el-tag v-else type="info">已结束</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="editGroupBuy(row)">编辑</el-button>
              <el-button type="danger" link size="small" @click="deleteGroupBuy(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pagination-wrap">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          layout="total, prev, pager, next"
          @current-change="loadData"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

const activeTab = ref('store')
const storeData = ref<any[]>([])
const salonData = ref<any[]>([])
const groupBuyData = ref<any[]>([])
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

function loadData() {
  // TODO: 根据 activeTab 调用不同接口
  storeData.value = []
  salonData.value = []
  groupBuyData.value = []
  pagination.total = 0
}

function addStore() { console.log('新增门店') }
function editStore(row: any) { console.log('编辑门店', row) }
function deleteStore(row: any) { console.log('删除门店', row) }
function addSalon() { console.log('新增沙龙') }
function editSalon(row: any) { console.log('编辑沙龙', row) }
function viewReservations(row: any) { console.log('查看预约', row) }
function addGroupBuy() { console.log('新建拼团') }
function editGroupBuy(row: any) { console.log('编辑拼团', row) }
function deleteGroupBuy(row: any) { console.log('删除拼团', row) }

onMounted(loadData)
</script>

<style scoped lang="scss">
.city-manage { padding: 20px; }
.pagination-wrap { margin-top: 16px; display: flex; justify-content: flex-end; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>