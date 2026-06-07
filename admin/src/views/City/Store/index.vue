<template>
  <div class="store-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>门店管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增门店
          </el-button>
        </div>
      </template>

      <el-row :gutter="20">
        <el-col :xs="24" :lg="12">
          <!-- 地图占位 -->
          <div class="map-container">
            <el-empty description="地图占位 - 需接入高德/百度地图">
              <template #image>
                <div class="map-placeholder">
                  <el-icon :size="60"><Location /></el-icon>
                </div>
              </template>
            </el-empty>
          </div>
        </el-col>
        <el-col :xs="24" :lg="12">
          <!-- 门店列表 -->
          <div class="store-list-container">
            <div class="search-bar">
              <el-input v-model="searchKeyword" placeholder="搜索门店" clearable>
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </div>
            <div class="store-list">
              <div v-for="item in storeList" :key="item.id" class="store-item">
                <div class="store-info">
                  <div class="store-name">{{ item.name }}</div>
                  <div class="store-address">{{ item.address }}</div>
                  <div class="store-contact">电话: {{ item.mobile }}</div>
                </div>
                <div class="store-actions">
                  <el-button type="primary" size="small" @click="handleEdit(item)">编辑</el-button>
                  <el-button type="danger" size="small" @click="handleDelete(item)">删除</el-button>
                </div>
              </div>
              <el-empty v-if="storeList.length === 0" description="暂无门店数据" />
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="门店名称">
          <el-input v-model="formData.name" placeholder="请输入门店名称" />
        </el-form-item>
        <el-form-item label="门店地址">
          <el-input v-model="formData.address" placeholder="请输入门店地址" />
        </el-form-item>
        <el-form-item label="经度">
          <el-input-number v-model="formData.longitude" :precision="6" />
        </el-form-item>
        <el-form-item label="纬度">
          <el-input-number v-model="formData.latitude" :precision="6" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="formData.mobile" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="营业时间">
          <el-input v-model="formData.businessHours" placeholder="如: 09:00-21:00" />
        </el-form-item>
        <el-form-item label="门店简介">
          <el-input v-model="formData.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Plus, Location, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchKeyword = ref('')
const storeList = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增门店')
const formData = reactive({
  id: null,
  name: '',
  address: '',
  longitude: 0,
  latitude: 0,
  mobile: '',
  businessHours: '',
  description: '',
  status: 1
})

const handleAdd = () => {
  dialogTitle.value = '新增门店'
  resetForm()
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑门店'
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该门店吗？', '提示', {
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleSubmit = () => {
  ElMessage.success('操作成功')
  dialogVisible.value = false
}

const resetForm = () => {
  formData.id = null
  formData.name = ''
  formData.address = ''
  formData.longitude = 0
  formData.latitude = 0
  formData.mobile = ''
  formData.businessHours = ''
  formData.description = ''
  formData.status = 1
}
</script>

<style scoped>
.store-list {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.map-container {
  height: 500px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}

.map-placeholder {
  color: #909399;
}

.store-list-container {
  padding: 10px;
}

.search-bar {
  margin-bottom: 15px;
}

.store-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  margin-bottom: 10px;
}

.store-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.store-address {
  margin-top: 5px;
  font-size: 14px;
  color: #666;
}

.store-contact {
  margin-top: 5px;
  font-size: 14px;
  color: #999;
}

.store-actions {
  display: flex;
  gap: 10px;
}
</style>
