<template>
  <div class="points-rule">
    <el-card>
      <template #header>
        <span>积分规则设置</span>
      </template>

      <el-form :model="formData" label-width="150px">
        <el-divider content-position="left">获取规则</el-divider>
        
        <el-form-item label="注册赠送积分">
          <el-input-number v-model="formData.registerPoints" :min="0" />
          <span style="margin-left: 10px">分</span>
        </el-form-item>
        
        <el-form-item label="每日签到赠送积分">
          <el-input-number v-model="formData.checkinPoints" :min="0" />
          <span style="margin-left: 10px">分</span>
        </el-form-item>
        
        <el-form-item label="连续签到额外奖励">
          <el-input-number v-model="formData.continuousCheckinBonus" :min="0" />
          <span style="margin-left: 10px">分/天</span>
          <span style="margin-left: 20px; color: #909399">（连续7天额外奖励）</span>
        </el-form-item>
        
        <el-form-item label="订单消费积分比例">
          <el-input-number v-model="formData.consumeRate" :min="0" :precision="1" />
          <span style="margin-left: 10px">%（每消费1元获得积分）</span>
        </el-form-item>
        
        <el-form-item label="评价商品赠送积分">
          <el-input-number v-model="formData.reviewPoints" :min="0" />
          <span style="margin-left: 10px">分</span>
        </el-form-item>
        
        <el-form-item label="分享课程赠送积分">
          <el-input-number v-model="formData.sharePoints" :min="0" />
          <span style="margin-left: 10px">分</span>
        </el-form-item>

        <el-divider content-position="left">消耗规则</el-divider>
        
        <el-form-item label="积分抵现比例">
          <el-input-number v-model="formData.exchangeRate" :min="0" :precision="0" />
          <span style="margin-left: 10px">积分 = 1元</span>
        </el-form-item>
        
        <el-form-item label="最低兑换积分">
          <el-input-number v-model="formData.minExchangePoints" :min="0" />
          <span style="margin-left: 10px">分</span>
        </el-form-item>
        
        <el-form-item label="积分过期规则">
          <el-select v-model="formData.expireType" style="width: 300px">
            <el-option label="永不过期" :value="0" />
            <el-option label="每年年底过期" :value="1" />
            <el-option label="获取后1年过期" :value="2" />
          </el-select>
        </el-form-item>

        <el-divider content-position="left">其他设置</el-divider>
        
        <el-form-item label="积分说明">
          <el-input 
            v-model="formData.description" 
            type="textarea" 
            :rows="4" 
            style="width: 500px"
            placeholder="请输入积分规则说明"
          />
        </el-form-item>
      </el-form>

      <div class="form-footer">
        <el-button type="primary" @click="handleSubmit">保存设置</el-button>
      </div>
    </el-card>

    <el-card style="margin-top: 20px;">
      <template #header>
        <span>积分记录</span>
      </template>

      <!-- 搜索表单 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="会员">
          <el-input v-model="searchForm.memberName" placeholder="请输入会员名" clearable />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="searchForm.type" placeholder="请选择类型" clearable>
            <el-option label="获得" :value="1" />
            <el-option label="消耗" :value="2" />
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
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 1 ? 'success' : 'warning'" size="small">
              {{ row.type === 1 ? '获得' : '消耗' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="points" label="积分变动" width="120">
          <template #default="{ row }">
            <span :style="{ color: row.type === 1 ? '#67C23A' : '#F56C6C' }">
              {{ row.type === 1 ? '+' : '-' }}{{ row.points }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="balance" label="变动后积分" width="120" />
        <el-table-column prop="source" label="来源" min-width="150" />
        <el-table-column prop="createTime" label="时间" width="180" />
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

const formData = reactive({
  registerPoints: 100,
  checkinPoints: 10,
  continuousCheckinBonus: 5,
  consumeRate: 1,
  reviewPoints: 5,
  sharePoints: 3,
  exchangeRate: 100,
  minExchangePoints: 100,
  expireType: 0,
  description: ''
})

const searchForm = reactive({
  memberName: '',
  type: ''
})

const tableData = ref([])
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const handleSubmit = () => {
  ElMessage.success('保存成功')
}

const handleSearch = () => {
  console.log('搜索积分记录')
}

const handleReset = () => {
  searchForm.memberName = ''
  searchForm.type = ''
  handleSearch()
}
</script>

<style scoped>
.points-rule {
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

.form-footer {
  margin-top: 20px;
  text-align: center;
}
</style>
