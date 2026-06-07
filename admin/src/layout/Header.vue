<template>
  <div class="header">
    <div class="header-left">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-if="currentMenu">{{ currentMenu }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="header-right">
      <el-dropdown @command="handleCommand">
        <span class="user-info">
          <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b8d3953faba0ea13c9e5b3dc62djpeg.jpg" />
          <span class="username">管理员</span>
          <el-icon><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">个人中心</el-dropdown-item>
            <el-dropdown-item command="settings">系统设置</el-dropdown-item>
            <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'

const route = useRoute()

const menuMap = {
  '/dashboard': '数据看板',
  '/product': '商品列表',
  '/product/category': '分类管理',
  '/member': '会员列表',
  '/order': '订单列表',
  '/order/aftersale': '售后处理',
  '/constitution': '体质档案',
  '/health': '健康档案',
  '/course': '养生课堂',
  '/course/category': '课程分类',
  '/article': '每日养生',
  '/checkin': '打卡管理',
  '/activity': '活动管理',
  '/city/store': '门店管理',
  '/city/salon': '沙龙管理',
  '/city/groupbuy': '拼团活动',
  '/marketing/coupon': '优惠券',
  '/marketing/points': '积分规则',
  '/report': '数据报表',
  '/statistics': '统计分析',
  '/system/user': '账号管理',
  '/system/announcement': '公告管理',
  '/config': '系统配置'
}

const currentMenu = computed(() => menuMap[route.path] || '')

const handleCommand = (command) => {
  switch (command) {
    case 'logout':
      ElMessage.success('退出登录成功')
      // TODO: 调用退出登录接口
      break
    case 'profile':
      ElMessage.info('个人中心开发中')
      break
    case 'settings':
      ElMessage.info('系统设置开发中')
      break
  }
}
</script>

<style scoped>
.header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.username {
  font-size: 14px;
  color: #333;
}
</style>
