import request from '@/utils/request'

// 获取文章列表
export const getArticleList = (params) => {
  // 接口路径: /api/admin/article/list
  return request.get('/article/list', { params })
}

// 获取文章详情
export const getArticleDetail = (id) => {
  // 接口路径: /api/admin/article/detail
  return request.get('/article/detail', { params: { id } })
}

// 新增文章
export const addArticle = (data) => {
  // 接口路径: /api/admin/article/add
  return request.post('/article/add', data)
}

// 编辑文章
export const updateArticle = (data) => {
  // 接口路径: /api/admin/article/update
  return request.post('/article/update', data)
}

// 删除文章
export const deleteArticle = (id) => {
  // 接口路径: /api/admin/article/delete
  return request.post('/article/delete', { id })
}

// 发布/下架文章
export const updateArticleStatus = (data) => {
  // 接口路径: /api/admin/article/updateStatus
  return request.post('/article/updateStatus', data)
}
