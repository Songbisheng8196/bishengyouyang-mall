# 毕生优养健康管理商城 - 后台管理系统

## 项目简介

毕生优养健康管理商城后台管理系统，基于 Vue3 + Element Plus 构建。

## 技术栈

- **前端框架**: Vue 3.4+
- **UI 组件库**: Element Plus 2.6+
- **路由**: Vue Router 4.3+
- **状态管理**: Pinia 2.1+
- **构建工具**: Vite 5.1+
- **HTTP 客户端**: Axios

## 项目结构

```
admin/
├── src/
│   ├── api/                 # API 接口封装
│   │   ├── product.js       # 商品管理接口
│   │   ├── member.js        # 会员管理接口
│   │   ├── order.js         # 订单管理接口
│   │   ├── course.js        # 课程管理接口
│   │   ├── article.js       # 文章管理接口
│   │   ├── city.js          # 同城服务接口
│   │   ├── marketing.js     # 营销管理接口
│   │   └── system.js        # 系统设置接口
│   ├── components/          # 公共组件
│   ├── config/              # 配置文件
│   │   └── index.js         # API 配置
│   ├── layout/               # 后台布局
│   │   ├── index.vue        # 整体布局
│   │   ├── Sidebar.vue      # 左侧菜单
│   │   └── Header.vue       # 顶部导航
│   ├── router/              # 路由配置
│   │   └── index.js
│   ├── store/               # 状态管理
│   │   └── user.js
│   ├── utils/               # 工具函数
│   │   └── request.js      # axios 封装
│   ├── views/               # 页面视图
│   │   ├── Dashboard/       # 数据看板
│   │   ├── Product/        # 商品管理
│   │   ├── Member/         # 会员管理
│   │   ├── Order/          # 订单管理
│   │   ├── Constitution/   # 体质档案
│   │   ├── Course/         # 养生课堂
│   │   ├── Article/        # 每日养生
│   │   ├── Checkin/        # 打卡管理
│   │   ├── City/           # 武汉同城
│   │   ├── Marketing/      # 营销管理
│   │   └── System/         # 系统设置
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── index.html
├── package.json
└── vite.config.js
```

## 功能模块

### 商品管理
- 商品列表：增删改查、搜索筛选
- 分类管理：商品分类的增删改

### 会员管理
- 会员列表：查看会员信息、积分调整
- 会员等级：普通/银卡/金卡/钻石

### 订单管理
- 订单列表：状态筛选、订单详情
- 售后处理：退款/退货退款流程

### 内容管理
- 养生课堂：课程列表、新增编辑
- 课程分类：课程分类管理
- 每日养生：文章列表、富文本编辑

### 体质档案
- 测评记录：九种体质类型统计

### 打卡管理
- 打卡记录：每日打卡统计

### 武汉同城
- 门店管理：地图+门店列表
- 沙龙管理：活动列表+预约管理
- 拼团活动：团购活动管理

### 营销管理
- 优惠券：满减券/折扣券
- 积分规则：获取/消耗规则设置

### 系统设置
- 账号管理：后台用户管理
- 公告管理：系统公告发布

## 启动项目

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 接口对接

接口地址配置在 `src/config/index.js`，当前配置为 `/api/admin`，需确保后端服务已启动并配置相应的代理或 CORS。

## 环境要求

- Node.js >= 16
- npm >= 8
