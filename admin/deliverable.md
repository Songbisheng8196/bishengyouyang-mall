# 交付清单：毕生优养后台管理面板骨架

## Summary

已为毕生优养健康管理商城完成后台管理面板骨架搭建，包含 Vue3 + Element Plus 技术栈的项目结构、后台布局组件、18个功能模块页面、路由配置、API封装文件。所有页面均包含表格+搜索表单+分页组件的完整占位框架。

## Changed Files

### 根目录文件
- `D:\bisheng-youyang\admin\package.json` - 项目配置（Vue3 + Vite + Element Plus）
- `D:\bisheng-youyang\admin\vite.config.js` - Vite 构建配置
- `D:\bisheng-youyang\admin\index.html` - 入口 HTML
- `D:\bisheng-youyang\admin\README.md` - 项目说明文档

### src/ 核心文件
- `src/main.js` - Vue3 应用入口
- `src/App.vue` - 根组件
- `src/style.css` - 全局样式

### src/config/
- `src/config/index.js` - API 配置（baseURL: '/api/admin'）

### src/layout/ 后台布局
- `src/layout/index.vue` - 整体布局（左侧菜单 + 顶部导航 + 内容区）
- `src/layout/Sidebar.vue` - 左侧导航菜单（9个一级菜单项）
- `src/layout/Header.vue` - 顶部导航（面包屑 + 用户信息 + 退出登录）

### src/router/
- `src/router/index.js` - 路由配置（18个路由）

### src/store/
- `src/store/user.js` - 用户状态管理

### src/utils/
- `src/utils/request.js` - Axios 请求封装

### src/api/ API 封装
- `src/api/product.js` - 商品管理接口（8个接口）
- `src/api/member.js` - 会员管理接口（4个接口）
- `src/api/order.js` - 订单管理接口（5个接口）
- `src/api/course.js` - 课程管理接口（9个接口）
- `src/api/article.js` - 文章管理接口（5个接口）
- `src/api/city.js` - 同城服务接口（14个接口）
- `src/api/marketing.js` - 营销管理接口（9个接口）
- `src/api/system.js` - 系统设置接口（11个接口）

### src/views/ 功能模块页面（18个）

**Dashboard**
- `src/views/Dashboard/index.vue` - 数据看板（6个统计卡片 + 图表占位）

**Product 商品管理**
- `src/views/Product/index.vue` - 商品列表（表格+搜索+新增/编辑/删除）
- `src/views/Product/category.vue` - 分类管理

**Member 会员管理**
- `src/views/Member/index.vue` - 会员列表（等级/积分/体质）

**Order 订单管理**
- `src/views/Order/index.vue` - 订单列表（状态Tab筛选）
- `src/views/Order/aftersale.vue` - 售后处理

**Constitution 体质档案**
- `src/views/Constitution/index.vue` - 体质档案（9种体质统计）

**Course 养生课堂**
- `src/views/Course/index.vue` - 课程列表（新增表单）
- `src/views/Course/category.vue` - 课程分类

**Article 每日养生**
- `src/views/Article/index.vue` - 文章列表（富文本编辑占位）

**Checkin 打卡管理**
- `src/views/Checkin/index.vue` - 打卡管理（统计卡片+记录列表）

**City 武汉同城**
- `src/views/City/store.vue` - 门店管理（地图+门店列表）
- `src/views/City/salon.vue` - 沙龙管理（预约管理）
- `src/views/City/groupbuy.vue` - 拼团活动管理

**Marketing 营销管理**
- `src/views/Marketing/coupon.vue` - 优惠券管理
- `src/views/Marketing/points.vue` - 积分规则设置

**System 系统设置**
- `src/views/System/user.vue` - 账号管理
- `src/views/System/announcement.vue` - 公告管理

## Notes

1. **接口对接**: 所有 API 接口均以 `/api/admin/xxx` 占位，需对接 `D:\bisheng-youyang\backend\` 接口后端服务
2. **数据占位**: 所有页面表格数据初始为空数组，接口调用逻辑已用注释标注
3. **图表占位**: Dashboard 页面图表区域使用 el-empty 占位，需接入 ECharts 等图表库
4. **地图占位**: 门店管理页面地图使用 el-empty 占位，需接入高德/百度地图 SDK
5. **富文本占位**: 文章管理页面使用 el-empty 占位，需接入富文本编辑器（如 wangeditor）
6. **启动命令**: `npm install && npm run dev`
7. **端口**: 开发服务器默认端口 3000
