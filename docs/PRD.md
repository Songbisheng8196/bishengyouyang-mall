# 毕生优养健康管理商城 PRD 文档 v1.0

> 项目代号：毕生优养商城 | 文档版本：v1.0 | 更新日期：2026-06-05
> 产品定位：女性轻养生食品微信小程序 + H5官网 | 合规定位：全程普通食品宣传，无任何医疗诊疗业务

---

## 一、产品概述

毕生优养商城是一款面向都市女性用户的轻养生食品微信小程序，集成体质测评、养生课堂、商城购物、武汉同城沙龙等功能模块。项目全程遵守普通食品宣传合规要求，禁止任何医疗诊疗类用语。

**核心价值观**：让每位用户找到适合自己的日常食补方案，轻松养生。

---

## 二、功能模块总览

### Phase1 开发模块（本期完成）

| # | 模块名称 | 功能说明 | 优先级 |
|---|---------|---------|-------|
| 1 | 首页 | 5大核心入口 + 侧边武汉同城悬浮按钮 | P0 |
| 2 | 体质测评 | 20题问卷 → 5种体质分类 → 推荐方案 | P0 |
| 3 | 每日养生 | 节气养生/四季食补/生理期膳食图文 | P1 |
| 4 | 养生课堂 | 视频课程（免费/会员/配套三分类） | P1 |
| 5 | 养生打卡 | 产品食用/饮水/作息记录 + 积分激励 | P1 |
| 6 | 商城 | 商品分类/列表/详情/购物车/订单/售后 | P0 |
| 7 | 会员体系 | 普通/银卡/金卡三级会员 + 积分体系 | P0 |
| 8 | 武汉同城 | 沙龙预约/门店地图/到店自提/拼团 | P1 |
| 9 | 个人中心 | 订单/优惠券/积分/测评报告/地址管理 | P0 |
| 10 | 后台管理 | 商品/会员/订单/内容/营销全管理面板 | P0 |

### Phase2 预留模块（二期开发）

| # | 模块名称 | 功能说明 | 备注 |
|---|---------|---------|------|
| A | 营养师咨询 | 一对一膳食咨询入口 | 预留端口 |
| B | 节气礼包 | 限定养生礼包定时上架 | 预留端口 |

---

## 三、页面清单

### 3.1 首页模块
- `pages/index/index` — 首页（含5大入口按钮：体质测评/每日养生/养生课堂/养生打卡/商城）
- `pages/index/components/*` — 首页组件

### 3.2 体质测评模块
- `pages/constitution/intro` — 测评说明页（含免责文案）
- `pages/constitution/question` — 20题问卷页
- `pages/constitution/result` — 测评结果页（5种体质）
- `pages/constitution/recommend` — 推荐方案页（花养膏/花茶搭配）

### 3.3 每日养生模块
- `pages/daily-health/list` — 图文列表页
- `pages/daily-health/detail` — 文章详情页

### 3.4 养生课堂模块
- `pages/course/list` — 课程列表页（含免费/会员/配套Tab）
- `pages/course/detail` — 课程详情页（含商品挂载）
- `pages/course/player` — 视频播放页（断点续播）

### 3.5 养生打卡模块
- `pages/checkin/record` — 打卡记录页
- `pages/checkin/summary` — 月度小结页

### 3.6 商城模块（分类占位框架，暂不上真实商品）
- `pages/category/index` — 商品分类页（花养膏/花茶/养生礼盒占位）
- `pages/product/list` — 商品列表页（占位框架）
- `pages/product/detail` — 商品详情页（含合规标注占位）
- `pages/cart/index` — 购物车页
- `pages/order/confirm` — 订单确认页
- `pages/order/list` — 订单列表页（全部/待付款/待发货/待收货/已完成）
- `pages/order/detail` — 订单详情页
- `pages/order/aftersale` — 售后申请页
- `pages/order/logistics` — 物流查询页

### 3.7 武汉同城模块
- `pages/city/index` — 同城首页（含沙龙预约入口/门店地图入口）
- `pages/city/stores` — 门店列表页（占位框架）
- `pages/city/store-detail` — 门店详情页
- `pages/city/salon` — 沙龙预约页（表单框架）
- `pages/city/group-buy` — 同城拼团页（武汉区域用户专享）

### 3.8 个人中心模块
- `pages/user/index` — 个人中心页（含会员信息入口）
- `pages/user/member` — 会员等级说明页
- `pages/user/points` — 积分明细页
- `pages/user/coupons` — 我的优惠券页
- `pages/user/constitution-reports` — 历史体质测评报告存档
- `pages/user/checkin-history` — 打卡记录
- `pages/user/address` — 收货地址管理
- `pages/user/address/edit` — 地址编辑页
- `pages/user/customer-service` — 在线客服（占位）

---

## 四、接口清单（按模块分类）

### 4.1 用户与认证
- `POST /api/auth/login` — 微信授权登录
- `GET /api/auth/userinfo` — 获取用户信息
- `PUT /api/auth/userinfo` — 更新用户信息

### 4.2 商品与商城
- `GET /api/categories` — 商品分类列表
- `GET /api/products` — 商品列表（分页）
- `GET /api/products/:id` — 商品详情

### 4.3 购物车与订单
- `GET /api/cart` — 获取购物车
- `POST /api/cart` — 添加购物车
- `PUT /api/cart/:id` — 更新购物车商品
- `DELETE /api/cart/:id` — 删除购物车商品
- `POST /api/orders` — 创建订单
- `GET /api/orders` — 订单列表
- `GET /api/orders/:id` — 订单详情
- `PUT /api/orders/:id/cancel` — 取消订单
- `POST /api/orders/:id/aftersale` — 申请售后
- `GET /api/logistics/:id` — 物流查询

### 4.4 会员与积分
- `GET /api/member/info` — 会员信息查询
- `GET /api/points/balance` — 积分余额查询
- `GET /api/points/records` — 积分明细列表
- `GET /api/coupons` — 优惠券列表

### 4.5 体质测评
- `POST /api/constitution/submit` — 提交测评结果
- `GET /api/constitution/reports` — 查询历史报告
- `GET /api/constitution/recommend` — 获取推荐方案

### 4.6 养生打卡
- `POST /api/checkin` — 提交打卡记录
- `GET /api/checkin/records` — 打卡记录列表
- `GET /api/checkin/summary` — 月度小结

### 4.7 养生课堂
- `GET /api/courses` — 视频课程列表
- `GET /api/courses/:id` — 课程详情
- `GET /api/articles` — 每日养生文章列表
- `GET /api/articles/:id` — 文章详情

### 4.8 武汉同城
- `GET /api/stores` — 门店列表
- `GET /api/stores/:id` — 门店详情
- `GET /api/salons` — 沙龙活动列表
- `POST /api/salons/reserve` — 沙龙预约提交
- `GET /api/group-buyings` — 同城拼团列表（武汉区域过滤）

### 4.9 后台管理接口（受保护）
- `GET /api/admin/dashboard` — 数据看板
- `GET/POST/PUT/DELETE /api/admin/products` — 商品管理
- `GET/POST/PUT/DELETE /api/admin/categories` — 分类管理
- `GET/POST/PUT/DELETE /api/admin/orders` — 订单管理
- `GET/POST/PUT/DELETE /api/admin/members` — 会员管理
- `GET/POST/PUT/DELETE /api/admin/courses` — 课程管理
- `GET/POST/PUT/DELETE /api/admin/articles` — 文章管理
- `GET/POST/PUT/DELETE /api/admin/checkins` — 打卡记录管理
- `GET/POST/PUT/DELETE /api/admin/stores` — 门店管理
- `GET/POST/PUT/DELETE /api/admin/salons` — 沙龙管理
- `GET/POST/PUT/DELETE /api/admin/coupons` — 优惠券管理
- `GET/POST/PUT/DELETE /api/admin/announcements` — 公告管理

---

## 五、会员与积分体系

### 5.1 会员等级
| 等级 | 名称 | 购物折扣 | 专属权益 |
|------|------|---------|---------|
| Lv.0 | 普通会员 | 原价 | 基础权益 |
| Lv.1 | 银卡会员 | 9.5折 | 免费观看银卡课程 |
| Lv.2 | 金卡会员 | 9折 | 免费观看金卡课程 + 专属客服 |

### 5.2 积分获取途径
- 每日签到：+5积分
- 下单消费：每消费1元+1积分
- 分享好友：+10积分/次
- 课程学习：+20积分/课程
- 日常打卡：+3积分/次

### 5.3 积分消耗用途
- 兑换产品试用小样
- 兑换购物优惠券
- 解锁付费养生课程

---

## 六、合规文案规范（全平台强制执行）

### 6.1 通用免责文案
所有涉及产品/测评/课程的页面必须包含以下固定文案占位：

> ⚠️ **本页内容仅作日常膳食参考，非医疗诊断，身体不适请及时就医。**

> 🍵 **本品为普通食品，仅作日常食补食用。**

### 6.2 禁止使用词汇（严格禁止）
- 治病、改善疾病、药用疗效
- 妇科治疗、治疗、治愈
- 医疗、诊断、诊疗
- 任何疾病名称作为产品功效描述
- 任何医疗相关承诺或保证

### 6.3 合规标注位置
| 页面类型 | 标注位置 | 文案 |
|---------|---------|------|
| 体质测评结果页 | 页面顶部固定文案 | 免责文案1 |
| 商品详情页 | 页面中部固定位置 | 免责文案2 |
| 养生课堂视频页 | 视频播放器下方 | 免责文案1 |
| 每日养生文章页 | 文章正文尾部 | 免责文案1 |
| 会员等级说明页 | 权益说明下方 | 免责文案2 |

---

## 七、Phase1 占位说明

| 模块 | 占位内容 | 说明 |
|------|---------|------|
| 商品分类页 | 品类占位，无真实SKU | 商品素材后续批量导入 |
| 视频课程 | 空列表占位，无真实视频 | 视频素材由用户后续提供 |
| 体质测评问卷 | 20题框架，无内置题目 | 题目由用户后续提供 |
| 拼团活动 | 武汉区域用户限定框架 | 活动由后台配置 |

---

*本文档由 mini-product 维护更新，如需调整请联系产品负责人评审。*
