<template>
  <div class="course-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>养生课堂</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增课程
          </el-button>
        </div>
      </template>

      <!-- 搜索表单 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="课程名称">
          <el-input v-model="searchForm.name" placeholder="请输入课程名称" clearable />
        </el-form-item>
        <el-form-item label="课程分类">
          <el-select v-model="searchForm.categoryId" placeholder="请选择分类" clearable>
            <el-option label="养生知识" :value="1" />
            <el-option label="食疗养生" :value="2" />
            <el-option label="运动养生" :value="3" />
            <el-option label="经络穴位" :value="4" />
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
        <el-table-column prop="cover" label="封面" width="120">
          <template #default="{ row }">
            <el-image :src="row.cover" fit="cover" style="width: 80px; height: 60px" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="课程名称" min-width="200" />
        <el-table-column prop="categoryName" label="分类" width="120" />
        <el-table-column prop="teacher" label="讲师" width="100" />
        <el-table-column prop="duration" label="时长(分钟)" width="120" />
        <el-table-column prop="studyCount" label="学习人数" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
              {{ row.status === 1 ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
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

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
      @close="handleDialogClose"
    >
      <el-form :model="formData" label-width="100px">
        <el-form-item label="课程名称">
          <el-input v-model="formData.name" placeholder="请输入课程名称" />
        </el-form-item>
        <el-form-item label="课程分类">
          <el-select v-model="formData.categoryId" placeholder="请选择分类">
            <el-option label="养生知识" :value="1" />
            <el-option label="食疗养生" :value="2" />
            <el-option label="运动养生" :value="3" />
            <el-option label="经络穴位" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="讲师">
          <el-input v-model="formData.teacher" placeholder="请输入讲师名称" />
        </el-form-item>
        <el-form-item label="课程封面">
          <el-upload
            action="#"
            :auto-upload="false"
            :show-file-list="false"
          >
            <el-button>上传封面</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="课程时长">
          <el-input-number v-model="formData.duration" :min="1" />
          <span style="margin-left: 10px">分钟</span>
        </el-form-item>
        <el-form-item label="课程内容">
          <el-input v-model="formData.content" type="textarea" :rows="4" placeholder="请输入课程内容简介" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">发布</el-radio>
            <el-radio :label="0">草稿</el-radio>
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
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({
  name: '',
  categoryId: ''
})

const tableData = ref([])
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const dialogVisible = ref(false)
const dialogTitle = ref('新增课程')
const formData = reactive({
  id: null,
  name: '',
  categoryId: '',
  teacher: '',
  cover: '',
  duration: 30,
  content: '',
  status: 1
})

const handleSearch = () => {
  console.log('搜索课程')
}

const handleReset = () => {
  searchForm.name = ''
  searchForm.categoryId = ''
  handleSearch()
}

const handleAdd = () => {
  dialogTitle.value = '新增课程'
  resetForm()
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑课程'
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该课程吗？', '提示', {
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleSubmit = () => {
  ElMessage.success('操作成功')
  dialogVisible.value = false
}

const handleDialogClose = () => {
  resetForm()
}

const resetForm = () => {
  formData.id = null
  formData.name = ''
  formData.categoryId = ''
  formData.teacher = ''
  formData.cover = ''
  formData.duration = 30
  formData.content = ''
  formData.status = 1
}
</script>

<style scoped>
.course-list {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
