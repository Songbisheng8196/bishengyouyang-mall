# 毕生优养商城 Phase1 WBS任务包

> 任务编号规则：PDP-产品 / FEP-前端 / BEP-后端 / TEP-测试 / ADP-后台
> 验收标准：每项任务完成后必须写入 `deliverable.md`，汇总输出文件路径
> 最后更新：2026-06-05

---

## 任务总览

| 任务编号 | 任务名称 | 指派Agent | 依赖关系 | 优先级 | 验收标准 |
|---------|---------|-----------|---------|--------|---------|
| PDP-001 | PRD文档编写 | mini-product | 无 | P0 | PRD.md写入D:\bisheng-youyang\docs\ ✅ |
| PDP-002 | WBS任务包编写 | mini-product | 无 | P0 | 本文档写入D:\bisheng-youyang\docs\ ✅ |
| FEP-001 | 前端项目骨架初始化 | mini-frontend | PDP-001 | P0 | Taro项目目录结构完整 |
| FEP-002 | TabBar 6页面搭建 | mini-frontend | FEP-001 | P0 | 6个TabBar页面均有框架 |
| FEP-003 | 首页5大入口页面搭建 | mini-frontend | FEP-001 | P0 | 5个入口页面均有框架+合规占位 |
| FEP-004 | 商城模块页面搭建 | mini-frontend | FEP-001 | P0 | 9个商城页面均有框架 |
| FEP-005 | 会员模块页面搭建 | mini-frontend | FEP-001 | P0 | 4个会员页面均有框架 |
| FEP-006 | 武汉同城模块页面搭建 | mini-frontend | FEP-001 | P0 | 5个同城页面均有框架 |
| FEP-007 | 个人中心完善 | mini-frontend | FEP-001 | P0 | 8个个人中心页面均有框架 |
| FEP-008 | API请求封装 | mini-frontend | BEP-001 | P1 | 按模块封装请求，接口地址占位 |
| FEP-009 | 前端交付清单整理 | mini-frontend | FEP-002~008 | P0 | 交付清单.md输出到frontend目录 |
| BEP-001 | 后端项目骨架初始化 | mini-backend | PDP-001 | P0 | Express+Sequelize项目目录完整 |
| BEP-002 | 数据库表结构设计 | mini-backend | BEP-001 | P0 | 19张数据表DDL脚本完整 |
| BEP-003 | 用户认证接口 | mini-backend | BEP-002 | P0 | 微信登录+用户信息接口 |
| BEP-004 | 商品商城接口 | mini-backend | BEP-002 | P0 | 分类/商品/购物车/订单接口 |
| BEP-005 | 会员积分接口 | mini-backend | BEP-002 | P0 | 会员信息/积分/优惠券接口 |
| BEP-006 | 体质测评接口 | mini-backend | BEP-002 | P0 | 测评提交/报告查询接口 |
| BEP-007 | 养生打卡接口 | mini-backend | BEP-002 | P0 | 打卡提交/记录/小结接口 |
| BEP-008 | 养生内容接口 | mini-backend | BEP-002 | P1 | 课程/文章接口 |
| BEP-009 | 武汉同城接口 | mini-backend | BEP-002 | P1 | 门店/沙龙/拼团结口 |
| BEP-010 | 后端部署文档 | mini-backend | BEP-001 | P0 | README.md+环境变量示例 |
| TEP-001 | 测试用例编写 | mini-tester | FEP/BEP/ADP | P0 | 测试用例.md含30+用例 |
| TEP-002 | 第一轮框架验收 | mini-tester | FEP/BEP/ADP | P0 | Phase1验收报告.md输出 |
| ADP-001 | 后台管理面板骨架 | mini-frontend | PDP-001 | P0 | Vue+ElementPlus项目完整 |
| ADP-002 | 后台10+功能模块页面 | mini-frontend | ADP-001 | P0 | 每个模块均有列表+搜索+分页框架 |
| PDP-003 | 部署文档编写 | mini-product | TEP-002 | P0 | 部署文档.md面向小龙虾 |

---

## 详细任务说明

### 前端任务（FEP）

**FEP-001: 前端项目骨架初始化**
- 技术选型：Taro.js + React + TypeScript
- 目录要求：src/pages/, src/components/, src/api/, src/store/, src/utils/, config/
- 交付物：项目目录结构完整，package.json配置正确

**FEP-002: TabBar 6页面搭建**
- 页面：首页/分类/购物车/养生打卡/我的
- 验收：每个页面目录含index.tsx + index.config.ts + index.scss

**FEP-003: 首页5大入口页面搭建**
- 页面：体质测评/每日养生/养生课堂/养生打卡/商城入口
- 要求：每个页面包含合规免责文案占位注释
- 验收：5个入口均可访问，无空白白屏

**FEP-004~007: 各模块页面**
- 商城9页、会员4页、武汉同城5页、个人中心8页
- 要求：有框架、有按钮、有跳转逻辑占位
- 禁止：出现空白无内容白屏页面

### 后端任务（BEP）

**BEP-001: 后端项目骨架**
- 技术选型：Node.js + Express + Sequelize + SQLite
- 目录：src/routes/, src/controllers/, src/models/, src/middleware/, config/
- 验收：npm install 成功，npm start 可启动

**BEP-002: 数据库表结构**
- 19张表：users/members/points/constitution_records/questions/categories/products/orders/order_items/cart_items/addresses/coupons/checkin_records/courses/events/stores/group_buying/articles/announcements
- 验收：SQLite数据库文件存在，可执行迁移脚本

**BEP-003~009: 各模块接口**
- 统一响应格式：`{code: 0, message: 'success', data: {...}}`
- 统一错误格式：`{code: 40001, message: '中文错误提示', data: null}`
- Phase1商品/课程接口返回空列表占位，不含真实数据

### 测试任务（TEP）

**TEP-001: 测试用例编写**
- 前端：页面存在性/导航/合规文案检查，不少于15条
- 后端：接口存在性/响应格式/错误码，不少于10条
- 后台：菜单完整性/页面框架完整性，不少于5条

**TEP-002: 第一轮框架验收**
- 验收范围：frontend/ + backend/ + admin/ + docs/
- 输出：Phase1验收报告.md（含PASS/FAIL统计+问题清单+交付物清单）

### 后台任务（ADP）

**ADP-001: 后台管理面板骨架**
- 技术选型：Vue3 + Element Plus
- 目录：src/views/, src/api/, src/router/, src/layout/
- 验收：项目可启动，有菜单，有基本布局

**ADP-002: 后台10+功能模块**
- 页面：商品管理/会员管理/订单管理/体质档案/养生课堂/每日养生/打卡管理/同城管理/营销管理/系统管理/售后处理
- 验收：每个模块有列表页（表格+搜索+分页框架）

---

## 任务优先级说明

| 优先级 | 定义 | 时效要求 |
|--------|------|---------|
| P0 | 核心框架，必须完成 | Phase1必须完成 |
| P1 | 重要功能，应完成 | Phase1应完成 |
| P2 | 扩展功能，可延后 | Phase2或后续迭代 |

---

*本WBS由mini-product维护更新。*
