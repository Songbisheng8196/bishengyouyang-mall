<template>
  <div class="article-manage">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>每日养生文章管理</span>
          <el-button type="primary" @click="addArticle">新增文章</el-button>
        </div>
      </template>

      <!-- 搜索 -->
      <el-form :inline="true" class="search-form">
        <el-form-item label="文章分类">
          <el-select v-model="query.category" placeholder="全部" clearable style="width: 140px">
            <el-option label="节气养生" value="jieqi" />
            <el-option label="四季食补" value="siji" />
            <el-option label="生理期膳食" value="shengli" />
          </el-select>
        </el-form-item>
        <el-form-item label="文章标题">
          <el-input v-model="query.keyword" placeholder="输入标题搜索" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 列表 -->
      <el-table :data="tableData" border stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="文章标题" min-width="240" />
        <el-table-column prop="category" label="分类" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.category === 'jieqi'" type="success">节气养生</el-tag>
            <el-tag v-else-if="row.category === 'siji'" type="primary">四季食补</el-tag>
            <el-tag v-else type="warning">生理期膳食</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="author" label="作者" width="120" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">{{ row.status === 1 ? '已发布' : '草稿' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pv" label="阅读量" width="100" />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="editArticle(row)">编辑</el-button>
            <el-button :type="row.status === 1 ? 'warning' : 'success'" link size="small" @click="toggleStatus(row)">
              {{ row.status === 1 ? '下架' : '发布' }}
            </el-button>
            <el-button type="danger" link size="small" @click="deleteArticle(row)">删除</el-button>
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

const tableData = ref<any[]>([])
const query = reactive({ category: '', keyword: '' })
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

function loadData() {
  // TODO: 调用 GET /api/admin/articles 接口
  tableData.value = []
  pagination.total = 0
}

function resetQuery() {
  query.category = ''
  query.keyword = ''
  loadData()
}

function addArticle() { console.log('新增文章') }
function editArticle(row: any) { console.log('编辑文章', row) }
function toggleStatus(row: any) { console.log('切换状态', row) }
function deleteArticle(row: any) { console.log('删除文章', row) }

onMounted(loadData)
</script>

<style scoped lang="scss">
.article-manage { padding: 20px; }
.search-form { margin-bottom: 16px; }
.pagination-wrap { margin-top: 16px; display: flex; justify-content: flex-end; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>