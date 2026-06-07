# 毕生优养商城 Phase2 WBS 任务包 v1.0

> 任务编号规则：P2-产品 / P2F-前端 / P2B-后端 / P2T-测试 / P2A-后台
> 上游：Phase1 PRD.md + Phase2-PRD补充.md
> 启动日期：2026-06-05 | 预计周期：按任务并行执行

---

## 一、任务总览

| 任务编号 | 任务名称 | 指派Agent | 依赖关系 | 优先级 |
|---------|---------|-----------|---------|--------|
| P2-001 | Phase2 PRD补充文档编写 | mini-product | 无 | P0 |
| P2-002 | Phase2 WBS任务包编写 | mini-product | P2-001 | P0 |
| P2B-001 | 后端商品数据模型扩展 | mini-backend | P2-001 | P0 |
| P2B-002 | 后端图片上传接口开发 | mini-backend | P2B-001 | P0 |
| P2B-003 | 体质测评题目录入 | mini-backend | P2-001 | P0 |
| P2B-004 | 后端课程视频接口开发 | mini-backend | P2-001 | P0 |
| P2B-005 | 后端文章管理接口完善 | mini-backend | P2-001 | P1 |
| P2F-001 | 前端商品列表接入真实数据 | mini-frontend | P2B-001 | P0 |
| P2F-002 | 前端商品详情页接入真实数据 | mini-frontend | P2F-001 | P0 |
| P2F-003 | 前端体质问卷接入真实题目 | mini-frontend | P2B-003 | P0 |
| P2F-004 | 前端课程列表接入真实视频 | mini-frontend | P2B-004 | P0 |
| P2F-005 | 前端首页Banner内容填充 | mini-frontend | P2-001 | P1 |
| P2A-001 | 后台商品管理图片上传 | mini-frontend | P2B-002 | P0 |
| P2A-002 | 后台体质题目管理页面 | mini-frontend | P2B-003 | P0 |
| P2A-003 | 后台课程管理视频上传 | mini-frontend | P2B-004 | P0 |
| P2T-001 | Phase2 验收测试 | mini-tester | P2F/P2B/P2A | P0 |
| P2T-002 | Phase2 验收报告 | mini-tester | P2T-001 | P0 |

---

## 二、并行 Track 说明

### Track A：产品素材导入（可与 Track B/C 并行）
用户自有产品图 + 文案 → 后端入库 → 前端展示 → 后台管理

### Track B：体质测评题目（可与 Track A/C 并行）
AI 起草20题 → 用户审核 → 后端录入 → 前端问卷接入

### Track C：AI 视频课程（可与 Track A/B 并行）
课程脚本 → AI 生成视频+封面 → 后端录入 → 前端播放器接入

---

## 三、详细任务说明

### P2B-001: 后端商品数据模型扩展
- 扩展 `products` 模型：新增 images/tags/stock/weight/originalPrice 字段
- 更新 `database/init.js` 数据迁移脚本
- 更新 `models/product.js` 字段定义
- 扩展 `GET /api/products` 接口支持筛选/分页参数
- 扩展 `GET /api/products/:id` 返回完整商品信息
- 更新 `backend/database/products.json` 录入首批商品数据

**首批商品清单（用户提供素材）：**
- 花养膏系列：3个SKU
- 养生花茶系列：5个SKU
- 节气养生礼盒：2个SKU
- 共计：10个SKU

### P2B-002: 后端图片上传接口开发
- 新增 `POST /api/admin/products/upload` 图片上传接口
- 配置 `multer` 中间件处理 multipart/form-data
- 图片存储到 `backend/uploads/products/` 目录
- 返回图片 CDN URL
- 新增 `POST /api/admin/products/batch-import` 批量导入接口（接收 JSON 格式产品列表）

### P2B-003: 体质测评题目录入
- 创建 `database/questions.json` 录入 20 道题目
- 每题包含：id/title/options(含label/score)/dimension/weightType
- 扩展 `GET /api/constitution/questions` 接口返回题目列表
- 扩展 `GET /api/constitution/recommend` 根据体质类型返回推荐方案（产品+食谱+课程绑定）

### P2B-004: 后端课程视频接口开发
- 扩展 `courses` 模型：新增 videoUrl/coverImage/script/chapters 字段
- 新增 `POST /api/admin/courses/upload-video` 视频上传接口
- 更新 `GET /api/courses` 返回视频 URL
- 更新 `backend/database/courses.json` 录入首批 10 门课程信息

**首批课程清单：**
- 免费科普课×3：体质自测指南/花养膏功效解读/日常养生基础
- 会员专享课×5：花茶搭配指南/生理期养护/四季食补/九种体质调理/二十四节气养生
- 配套课程×2：花养膏配餐课/节气礼盒解读

### P2B-005: 后端文章管理接口完善
- 扩展 Article 模型支持 richText 字段
- 新增 `GET /api/articles/:id` 返回完整文章内容（含 HTML）
- 新增 `POST /api/admin/articles` 创建文章（富文本内容）
- 新增 `PUT /api/admin/articles/:id` 更新文章

### P2F-001: 前端商品列表接入真实数据
- `pages/product/list.tsx` — 替换 mock 数据，调用 `GET /api/products`
- 实现分页加载、上拉刷新
- 实现分类筛选、价格排序
- 商品卡片显示真实图片/价格/名称

### P2F-002: 前端商品详情页接入真实数据
- `pages/product/detail.tsx` — 调用 `GET /api/products/:id`
- 接入商品图片轮播（真实图片）
- 接入价格/库存显示
- 接入产品功效描述（富文本渲染）
- 确认合规免责文案仍然显示
- 接入"相关阅读"文章推荐区域

### P2F-003: 前端体质问卷接入真实题目
- `pages/constitution/question.tsx` — 调用 `GET /api/constitution/questions`
- 替换 mock 题目为真实 20 题
- 保留进度条、选项交互逻辑
- 提交后调用 `POST /api/constitution/submit` 并跳转结果页
- `pages/constitution/result.tsx` — 调用 `GET /api/constitution/recommend`
- 显示真实体质类型 + 推荐方案

### P2F-004: 前端课程列表接入真实视频
- `pages/course/list.tsx` — 调用 `GET /api/courses`，按分类（免费/会员/配套）展示
- `pages/course/detail.tsx` — 接入课程简介 + 章节讲义
- `pages/course/player.tsx` — 接入真实视频 URL（支持断点续播）
- 视频播放器下方必须显示合规免责文案

### P2F-005: 前端首页Banner内容填充
- 接入真实活动 Banner（来自后端 `/api/announcements` 或固定配置）
- 首批 Banner：主推花养膏新品 + 体质测评入口 + 武汉同城沙龙

### P2A-001: 后台商品管理图片上传
- `views/Product/index.vue` — 商品表格新增"图片"列（缩略图）
- 新增商品表单增加图片上传组件（支持多图上传+预览+删除）
- 批量导入页面支持 JSON 格式产品列表导入

### P2A-002: 后台体质题目管理页面
- `views/Constitution/index.vue` — 题目列表（9种体质分组展示）
- 新增题目：表单包含 title/options/dimension/weightType
- 编辑题目：修改题目内容
- 题目顺序调整：拖拽排序功能

### P2A-003: 后台课程管理视频上传
- `views/Course/index.vue` — 课程列表新增"视频状态"列
- 课程新增/编辑表单新增：
  - 视频上传组件（支持 mp4，最大 500MB）
  - 课程封面图上传
  - 课程脚本编辑（富文本）
  - 章节讲义编辑

### P2T-001: Phase2 验收测试
- 前端测试：商品列表/详情真实数据展示、问卷真实题目、课程真实视频播放
- 后端测试：图片上传接口、批量导入接口、测评题目接口、课程视频接口
- 后台测试：商品图片上传/批量导入、题目增删改、课程视频上传
- 合规测试：商品详情页免责文案显示、视频播放器下方免责文案

### P2T-002: Phase2 验收报告
- 输出到 `D:\bisheng-youyang\docs\Phase2验收报告.md`
- 包含：测试用例结果、问题清单、交付物清单

---

## 四、Phase2 AI 视频生成任务包

> 由 mini-product 主导，使用 Seedance 2.0 生成

### 视频生成清单（10门课程）

| 序号 | 课程名称 | 类型 | 时长 | 脚本状态 | 视频状态 |
|------|---------|------|------|---------|---------|
| 1 | 体质自测指南 | 免费 | 3min | 待生成 | 待生成 |
| 2 | 花养膏功效解读 | 免费 | 4min | 待生成 | 待生成 |
| 3 | 日常养生基础 | 免费 | 3min | 待生成 | 待生成 |
| 4 | 花茶搭配指南 | 会员 | 5min | 待生成 | 待生成 |
| 5 | 生理期养护 | 会员 | 5min | 待生成 | 待生成 |
| 6 | 四季食补指南 | 会员 | 5min | 待生成 | 待生成 |
| 7 | 九种体质调理 | 会员 | 5min | 待生成 | 待生成 |
| 8 | 二十四节气养生 | 会员 | 5min | 待生成 | 待生成 |
| 9 | 花养膏配餐课 | 配套 | 4min | 待生成 | 待生成 |
| 10 | 节气礼盒解读 | 配套 | 3min | 待生成 | 待生成 |

### AI 视频生成流程
1. **脚本生成** → AI 根据课程主题生成 500-800字讲解脚本
2. **封面图生成** → AI 生成课程封面（4:3 比例）
3. **视频生成** → Seedance 2.0 根据脚本生成讲解视频
4. **视频上传 CDN** → 获取可访问的播放 URL
5. **数据录入后台** → 录入课程信息 + 视频 URL

---

## 五、任务优先级说明

| 优先级 | 定义 | Phase2 必须完成 |
|--------|------|----------------|
| P0 | 核心功能，必须完成 | 是 |
| P1 | 重要功能，应完成 | 是 |

---

*本WBS由mini-product维护更新，Phase2目标：让产品可售、课程可看、测评可用。*