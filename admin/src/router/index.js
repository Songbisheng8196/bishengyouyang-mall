import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard/index.vue'),
    meta: { title: '数据看板' }
  },
  {
    path: '/product',
    name: 'Product',
    component: () => import('@/views/Product/index.vue'),
    meta: { title: '商品列表' }
  },
  {
    path: '/product/category',
    name: 'ProductCategory',
    component: () => import('@/views/Product/category.vue'),
    meta: { title: '分类管理' }
  },
  {
    path: '/member',
    name: 'Member',
    component: () => import('@/views/Member/index.vue'),
    meta: { title: '会员列表' }
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import('@/views/Order/index.vue'),
    meta: { title: '订单列表' }
  },
  {
    path: '/order/aftersale',
    name: 'OrderAftersale',
    component: () => import('@/views/Order/aftersale.vue'),
    meta: { title: '售后处理' }
  },
  {
    path: '/constitution',
    name: 'Constitution',
    component: () => import('@/views/Constitution/index.vue'),
    meta: { title: '体质档案' }
  },
  {
    path: '/course',
    name: 'Course',
    component: () => import('@/views/Course/index.vue'),
    meta: { title: '养生课堂' }
  },
  {
    path: '/course/category',
    name: 'CourseCategory',
    component: () => import('@/views/Course/category.vue'),
    meta: { title: '课程分类' }
  },
  {
    path: '/article',
    name: 'Article',
    component: () => import('@/views/Article/index.vue'),
    meta: { title: '每日养生' }
  },
  {
    path: '/checkin',
    name: 'Checkin',
    component: () => import('@/views/Checkin/index.vue'),
    meta: { title: '打卡管理' }
  },
  {
    path: '/city/store',
    name: 'CityStore',
    component: () => import('@/views/City/Store/index.vue'),
    meta: { title: '门店管理' }
  },
  {
    path: '/city/salon',
    name: 'CitySalon',
    component: () => import('@/views/City/Salon/index.vue'),
    meta: { title: '沙龙管理' }
  },
  {
    path: '/city/groupbuy',
    name: 'CityGroupBuy',
    component: () => import('@/views/City/GroupBuy/index.vue'),
    meta: { title: '拼团活动' }
  },
  {
    path: '/marketing/coupon',
    name: 'MarketingCoupon',
    component: () => import('@/views/Marketing/coupon.vue'),
    meta: { title: '优惠券' }
  },
  {
    path: '/marketing/points',
    name: 'MarketingPoints',
    component: () => import('@/views/Marketing/points.vue'),
    meta: { title: '积分规则' }
  },
  {
    path: '/system/user',
    name: 'SystemUser',
    component: () => import('@/views/System/user.vue'),
    meta: { title: '账号管理' }
  },
  {
    path: '/system/announcement',
    name: 'SystemAnnouncement',
    component: () => import('@/views/System/announcement.vue'),
    meta: { title: '公告管理' }
  },
  {
    path: '/activity',
    name: 'Activity',
    component: () => import('@/views/Activity/index.vue'),
    meta: { title: '活动管理' }
  },
  {
    path: '/report',
    name: 'Report',
    component: () => import('@/views/Report/index.vue'),
    meta: { title: '数据报表' }
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: () => import('@/views/Statistics/index.vue'),
    meta: { title: '统计分析' }
  },
  {
    path: '/health',
    name: 'Health',
    component: () => import('@/views/Health/index.vue'),
    meta: { title: '健康档案' }
  },
  {
    path: '/config',
    name: 'Config',
    component: () => import('@/views/Config/index.vue'),
    meta: { title: '系统配置' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
