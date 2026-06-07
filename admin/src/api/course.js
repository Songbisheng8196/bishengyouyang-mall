import request from '@/utils/request'

// 获取课程列表
export const getCourseList = (params) => {
  // 接口路径: /api/admin/course/list
  return request.get('/course/list', { params })
}

// 获取课程详情
export const getCourseDetail = (id) => {
  // 接口路径: /api/admin/course/detail
  return request.get('/course/detail', { params: { id } })
}

// 新增课程
export const addCourse = (data) => {
  // 接口路径: /api/admin/course/add
  return request.post('/course/add', data)
}

// 编辑课程
export const updateCourse = (data) => {
  // 接口路径: /api/admin/course/update
  return request.post('/course/update', data)
}

// 删除课程
export const deleteCourse = (id) => {
  // 接口路径: /api/admin/course/delete
  return request.post('/course/delete', { id })
}

// 获取课程分类列表
export const getCourseCategoryList = (params) => {
  // 接口路径: /api/admin/course/category/list
  return request.get('/course/category/list', { params })
}

// 新增课程分类
export const addCourseCategory = (data) => {
  // 接口路径: /api/admin/course/category/add
  return request.post('/course/category/add', data)
}

// 编辑课程分类
export const updateCourseCategory = (data) => {
  // 接口路径: /api/admin/course/category/update
  return request.post('/course/category/update', data)
}

// 删除课程分类
export const deleteCourseCategory = (id) => {
  // 接口路径: /api/admin/course/category/delete
  return request.post('/course/category/delete', { id })
}
