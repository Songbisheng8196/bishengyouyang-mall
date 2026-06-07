<template>
  <div class="sidebar">
    <div class="logo">
      <h2>毕生优养</h2>
      <p>后台管理</p>
    </div>
    <el-menu
      :default-active="activeMenu"
      class="sidebar-menu"
      background-color="#2E7D32"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
    >
      <el-menu-item index="/dashboard">
        <el-icon><HomeFilled /></el-icon>
        <span>数据看板</span>
      </el-menu-item>

      <el-sub-menu index="1">
        <template #title>
          <el-icon><Goods /></el-icon>
          <span>商品管理</span>
        </template>
        <el-menu-item index="/product">商品列表</el-menu-item>
        <el-menu-item index="/product/category">分类管理</el-menu-item>
      </el-sub-menu>
      
      <el-menu-item index="/member">
        <el-icon><User /></el-icon>
        <span>会员管理</span>
      </el-menu-item>
      
      <el-sub-menu index="3">
        <template #title>
          <el-icon><ShoppingCart /></el-icon>
          <span>订单管理</span>
        </template>
        <el-menu-item index="/order">订单列表</el-menu-item>
        <el-menu-item index="/order/aftersale">售后处理</el-menu-item>
      </el-sub-menu>
      
      <el-menu-item index="/constitution">
        <el-icon><Document /></el-icon>
        <span>体质档案</span>
      </el-menu-item>

      <el-menu-item index="/health">
        <el-icon><FirstAidKit /></el-icon>
        <span>健康档案</span>
      </el-menu-item>
      
      <el-sub-menu index="5">
        <template #title>
          <el-icon><VideoPlay /></el-icon>
          <span>内容管理</span>
        </template>
        <el-menu-item index="/course">养生课堂</el-menu-item>
        <el-menu-item index="/course/category">课程分类</el-menu-item>
        <el-menu-item index="/article">每日养生</el-menu-item>
      </el-sub-menu>
      
      <el-menu-item index="/checkin">
        <el-icon><Calendar /></el-icon>
        <span>打卡管理</span>
      </el-menu-item>

      <el-menu-item index="/activity">
        <el-icon><MagicStick /></el-icon>
        <span>活动管理</span>
      </el-menu-item>
      
      <el-sub-menu index="7">
        <template #title>
          <el-icon><Location /></el-icon>
          <span>武汉同城</span>
        </template>
        <el-menu-item index="/city/store">门店管理</el-menu-item>
        <el-menu-item index="/city/salon">沙龙管理</el-menu-item>
        <el-menu-item index="/city/groupbuy">拼团活动</el-menu-item>
      </el-sub-menu>
      
      <el-sub-menu index="8">
        <template #title>
          <el-icon><Tickets /></el-icon>
          <span>营销管理</span>
        </template>
        <el-menu-item index="/marketing/coupon">优惠券</el-menu-item>
        <el-menu-item index="/marketing/points">积分规则</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="9">
        <template #title>
          <el-icon><DataAnalysis /></el-icon>
          <span>数据统计</span>
        </template>
        <el-menu-item index="/report">数据报表</el-menu-item>
        <el-menu-item index="/statistics">统计分析</el-menu-item>
      </el-sub-menu>
      
      <el-sub-menu index="10">
        <template #title>
          <el-icon><Setting /></el-icon>
          <span>系统设置</span>
        </template>
        <el-menu-item index="/system/user">账号管理</el-menu-item>
        <el-menu-item index="/system/announcement">公告管理</el-menu-item>
        <el-menu-item index="/config">系统配置</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  HomeFilled, Goods, User, ShoppingCart, Document, VideoPlay,
  Calendar, Location, Tickets, Setting, FirstAidKit, MagicStick, DataAnalysis
} from '@element-plus/icons-vue'

const route = useRoute()
const activeMenu = computed(() => route.path)
</script>

<style scoped>
.sidebar {
  width: 200px;
  height: 100vh;
  background-color: #2E7D32;
  overflow-y: auto;
}

.logo {
  padding: 20px;
  text-align: center;
  color: #fff;
}

.logo h2 {
  margin: 0;
  font-size: 20px;
}

.logo p {
  margin: 5px 0 0;
  font-size: 12px;
  opacity: 0.8;
}

.sidebar-menu {
  border-right: none;
}
</style>
