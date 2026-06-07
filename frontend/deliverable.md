# 毕生优养前端骨架交付文档

## 项目概述

**项目名称**: 毕生优养健康管理商城前端
**技术栈**: Taro.js (React) + TypeScript
**目标平台**: 微信小程序 + H5 响应式官网
**状态**: 前端骨架已完成 ✅

---

## 项目结构

```
D:\bisheng-youyang\frontend\
├── package.json                    # 依赖配置
├── tsconfig.json                  # TypeScript 配置
├── config/
│   └── index.js                  # 构建环境配置
└── src/
    ├── app.tsx                    # 应用入口（含 TabBar 配置）
    ├── assets/
    │   └── styles/
    │       └── variables.scss     # 全局样式变量
    ├── utils/
    │   ├── compliance.ts          # 合规文案常量
    │   ├── auth.ts                # 鉴权工具
    │   └── request.ts             # 请求封装
    ├── api/                       # API 模块（共10 个）
    │   ├── user.ts
    │   ├── cart.ts
    │   ├── product.ts
    │   ├── order.ts
    │   ├── constitution.ts
    │   ├── checkin.ts
    │   ├── course.ts
    │   ├── city.ts
    │   ├── member.ts
    │   └── address.ts
    ├── store/                      # 状态管理（Zustand）
    │   ├── user.ts
    │   └── cart.ts
    └── pages/                      # 页面模块
        ├── index/                  # 首页（TabBar）
        ├── category/               # 分类页（TabBar）
        ├── cart/ # 购物车（TabBar）
        ├── checkin/                # 打卡（TabBar）
        │   ├── index/              # 打卡首页
        │   ├── record/             # 打卡记录
        │   └── summary/            # 打卡汇总
        ├── user/                   # 个人中心（TabBar）
        │   ├── index/              # 个人中心首页
        │   ├── member/             # 会员中心
        │   ├── points/             # 积分明细
        │   ├── coupons/            # 优惠券
        │   ├── constitution-reports/# 体质报告
        │   ├── checkin-history/    # 打卡历史
        │   ├── address/            # 地址管理
        │   │   ├── index/          # 地址列表
        │   │   └── edit/           # 地址编辑
        │   └── customer-service/   # 客服中心
        ├── constitution/            # 体质辨识模块
        │   ├── intro/              # 介绍页
        │   ├── question/           # 答题页
        │   ├── result/             # 结果页
        │   └── recommend/          # 推荐页
        ├── daily-health/           # 每日健康模块
        │   ├── list/              # 健康列表
        │   └── detail/            # 健康详情
        ├── course/                 # 课程模块
        │   ├── list/              # 课程列表
        │   ├── detail/             # 课程详情
        │   └── player/             # 课程播放
        ├── product/                # 商品模块
        │   ├── list/              # 商品列表
        │   └── detail/            # 商品详情
        ├── order/                  # 订单模块
        │   ├── confirm/            # 确认订单
        │   ├── list/              # 订单列表
        │   ├── detail/             # 订单详情
        │   ├── aftersale/          # 售后申请
        │   └── logistics/          # 物流查询
        └── city/                   # 城市生活模块
            ├── index/              # 城市首页
            ├── stores/            # 门店列表
            ├── store-detail/      # 门店详情
            ├── salon/             # 沙龙活动
            └── group-buy/         # 团购优惠
```

---

## 页面清单

### TabBar 页面（5个）

| 页面路径 | 文件名 | 说明 |
|---------|--------|------|
| pages/index/index | 首页 | 首页轮播、推荐商品、热门课程 |
| pages/category/index | 分类 | 商品分类导航 |
| pages/cart/index | 购物车 | 购物车商品管理 |
| pages/checkin/index | 打卡 | 健康打卡入口 |
| pages/user/index | 个人中心 | 用户信息、快捷入口 |

### 个人中心子页面（8个）

| 页面路径 | 文件名 | 说明 |
|---------|--------|------|
| pages/user/member | 会员中心 | 会员等级、权益展示 |
| pages/user/points | 积分明细 | 积分记录、积分商城入口 |
| pages/user/coupons | 优惠券 | 优惠券列表、领取 |
| pages/user/constitution-reports | 体质报告 | 历史体质报告查看 |
| pages/user/checkin-history | 打卡历史 | 打卡记录列表 |
| pages/user/address | 地址管理 | 收货地址列表 |
| pages/user/address/edit | 地址编辑 | 新增/编辑地址 |
| pages/user/customer-service | 客服中心 | 客服入口、常见问题 |

### 体质辨识模块（4个）

| 页面路径 | 文件名 | 说明 | 合规标注 |
|---------|--------|------|----------|
| pages/constitution/intro | 介绍页 | 体质辨识说明 | ✅ |
| pages/constitution/question | 答题页 | 60题问卷 | ✅ |
| pages/constitution/result | 结果页 | 9种体质结果 | ✅ |
| pages/constitution/recommend | 推荐页 | 个性化调理方案 | ✅ |

### 每日健康模块（2个）

| 页面路径 | 文件名 | 说明 |
|---------|--------|------|
| pages/daily-health/list | 健康列表 | 每日健康内容列表 |
| pages/daily-health/detail | 健康详情 | 养生知识详情 |

### 课程模块（3个）

| 页面路径 | 文件名 | 说明 |
|---------|--------|------|
| pages/course/list | 课程列表 | 视频课程分类 |
| pages/course/detail | 课程详情 | 课程介绍、目录 |
| pages/course/player | 课程播放 | 视频播放器 |

### 商品模块（2个）

| 页面路径 | 文件名 | 说明 |
|---------|--------|------|
| pages/product/list | 商品列表 | 商品搜索、筛选 |
| pages/product/detail | 商品详情 | 商品信息、加入购物车 |

### 订单模块（6个）

| 页面路径 | 文件名 | 说明 |
|---------|--------|------|
| pages/order/confirm | 确认订单 | 提交订单、支付 |
| pages/order/list | 订单列表 | 全部/待付款/已完成 |
| pages/order/detail | 订单详情 | 订单信息、状态 |
| pages/order/aftersale | 售后申请 | 退款/退货申请 |
| pages/order/logistics | 物流查询 | 快递信息追踪 |

### 城市生活模块（5个）

| 页面路径 | 文件名 | 说明 |
|---------|--------|------|
| pages/city/index | 城市首页 | 城市生活入口 |
| pages/city/stores | 门店列表 | 线下门店查询 |
| pages/city/store-detail | 门店详情 | 门店信息、预约 |
| pages/city/salon | 沙龙活动 | 健康沙龙活动 |
| pages/city/group-buy | 团购优惠 | 团购套餐 |

### 打卡子页面（2个）

| 页面路径 | 文件名 | 说明 |
|---------|--------|------|
| pages/checkin/record | 打卡记录 | 打卡历史记录 |
| pages/checkin/summary | 打卡汇总 | 周/月打卡统计 |

---

## API 模块清单（10个）

| 文件 | 主要接口 |
|------|----------|
| api/user.ts | 登录、注册、用户信息、修改资料 |
| api/cart.ts | 获取购物车、加购、减购、删除 |
| api/product.ts | 商品列表、商品详情、搜索 |
| api/order.ts | 创建订单、订单列表、订单详情、取消订单 |
| api/constitution.ts | 获取题目、提交答题、获取结果 |
| api/checkin.ts | 打卡、记录列表、打卡统计 |
| api/course.ts | 课程列表、课程详情、学习进度 |
| api/city.ts | 城市门店、沙龙活动、团购套餐 |
| api/member.ts | 会员信息、积分、优惠券 |
| api/address.ts | 地址列表、新增地址、编辑地址、删除地址 |

---

## 状态管理（Zustand）

| Store | 主要状态 |
|-------|----------|
| store/user.ts | 用户信息、登录状态、Token |
| store/cart.ts | 购物车列表、商品数量、选中状态 |

---

## 合规标注

所有体质辨识相关页面均包含以下合规标注：

**配置文件（.config.ts）**:
```typescript
/**
 * 【合规说明】
 * 本页面涉及健康检测/体质辨识功能
 * - 仅提供健康信息参考，不作为医学诊断依据
 * - 具体健康问题请咨询专业医疗机构
 * - 页面内容需符合《互联网广告法》及《医疗器械监督管理条例》相关规定
 */
```

**页面组件（.tsx）**:
```tsx
<View className="compliance-notice">
  <Text>温馨提示：本测试结果仅供参考，不作为医学诊断依据。如有健康问题，请咨询专业医生。</Text>
</View>
```

---

## 环境配置

API基础地址通过环境变量配置：

```typescript
// 开发环境
process.env.API_BASE  // 开发服务器地址

// 生产环境
process.env.API_BASE  // 生产服务器地址
```

**配置位置**: `config/index.js`

---

## 适配说明

### 微信小程序适配
- 使用 Taro 标准组件确保跨端兼容
- 所有页面配置 `navigationBarTitleText`
- TabBar 图标使用本地资源

### H5 响应式适配
- 使用 SCSS 变量统一管理尺寸
- 支持主流机型：iPhone 12/13、小米、华为、OPPO
- 关键尺寸使用 `rpx` 单位转换

---

## 后续工作

### 待 mini-backend提供的接口
- [ ] 所有 API 接口联调
- [ ] 真实数据对接
- [ ] 支付接口集成

### 待小龙虾配置的
- [ ] 小程序 AppID 配置
- [ ] 服务器域名配置
- [ ] SSL 证书配置

### 待 mini-product 确认的
- [ ] 页面细节交互
- [ ] UI 设计稿对齐
- [ ] 动效需求

---

## 已知问题

1. 所有 API 接口使用 Mock 数据，需对接真实接口
2. 部分页面样式待视觉验收后调整

---

**交付时间**: 2026-05-19
**前端开发**: mini-frontend Agent