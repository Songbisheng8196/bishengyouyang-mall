# 毕生优养商城后端 API 服务

## 环境要求

- Node.js >= 16.x
- npm >= 8.x

## 环境变量配置

复制 `.env.example` 为 `.env` 并修改配置：

```bash
cp .env.example .env
```

### 配置项说明

| 变量名 | 说明 | 默认值 |
|-------|------|-------|
| `API_PORT` | API 服务端口 | `3000` |
| `API_HOST` | API 服务地址 | `http://localhost` |
| `DB_PATH` | SQLite 数据库文件路径 | `./database/shop.db` |
| `JWT_SECRET` | JWT 密钥（生产环境请修改） | `bisheng-youyang-secret-key-2024` |
| `JWT_EXPIRES_IN` | JWT 过期时间 | `7d` |
| `NODE_ENV` | 运行环境 | `development` |

## 启动命令

### 安装依赖

```bash
npm install
```

### 初始化数据库

```bash
npm run db:init
```

### 启动服务

```bash
# 开发模式（自动重启）
npm run dev

# 生产模式
npm start
```

## 接口规范

### 统一响应格式

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 错误码说明

| code | 说明 |
|-----|------|
| 0 | 成功 |
| 400 | 参数错误 |
| 401 | 未授权 / 登录失效 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

### 请求示例

```bash
# 微信登录
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"code": "微信授权code"}'

# 获取用户信息
curl -X GET http://localhost:3000/api/auth/userinfo \
  -H "Authorization: Bearer <token>"

# 获取商品分类
curl -X GET http://localhost:3000/api/categories
```

## Phase1 接口列表

### 用户与认证
- `POST /api/auth/login` - 微信授权登录
- `GET /api/auth/userinfo` - 获取用户信息
- `PUT /api/auth/userinfo` - 更新用户信息

### 商品与商城
- `GET /api/categories` - 商品分类列表
- `GET /api/products` - 商品列表
- `GET /api/products/:id` - 商品详情

### 购物车与订单
- `GET /api/cart` - 获取购物车
- `POST /api/cart` - 添加购物车
- `PUT /api/cart/:id` - 更新购物车商品
- `DELETE /api/cart/:id` - 删除购物车商品
- `POST /api/orders` - 创建订单
- `GET /api/orders` - 订单列表
- `GET /api/orders/:id` - 订单详情
- `PUT /api/orders/:id/cancel` - 取消订单

## Phase2 新增接口

### 图片上传（管理员）
- `POST /api/admin/upload/image` - 单图上传（multipart/form-data）
  - 参数：`image`（图片文件，必填）、`productId`（商品ID）、`fileType`（main/detail）
  - 返回：`{ url, filename, originalName, size, mimetype }`
- `POST /api/admin/upload/images` - 多图上传（最多9张）
  - 参数：`images`（图片文件数组）、`productId`
  - 返回：`{ images: [{ url, filename, ... }], count }`

### 商品管理（管理员）
- `POST /api/admin/products/batch-import` - 批量导入商品
  - 参数：`{ products: [{ name, price, category_id, ... }] }`
  - 返回：`{ total, success, failed, errors }`

### 商品查询参数（Phase2 扩展）
- `GET /api/products` 支持参数：
  - `categoryId` - 按分类筛选
  - `keyword` - 关键词搜索
  - `page` / `pageSize` - 分页
  - `sort` / `order` - 排序

### 商品数据结构（Phase2 扩展字段）
```json
{
  "id": 1,
  "name": "花养膏·红枣枸杞味",
  "subtitle": "补气养血日常食补",
  "images": ["url1", "url2"],
  "price": 168.00,
  "originalPrice": 198.00,
  "stock": 200,
  "weight": 150,
  "tags": ["气虚质", "补气养血"],
  "status": 1
}
```

### 会员与积分
- `GET /api/member/info` - 会员信息查询
- `GET /api/points/balance` - 积分余额查询
- `GET /api/points/records` - 积分明细列表
- `GET /api/coupons` - 优惠券列表

### 体质测评
- `POST /api/constitution/submit` - 提交测评结果
- `GET /api/constitution/reports` - 查询历史报告
- `GET /api/constitution/recommend` - 获取推荐方案

### 养生打卡
- `POST /api/checkin` - 提交打卡记录
- `GET /api/checkin/records` - 打卡记录列表
- `GET /api/checkin/summary` - 月度小结

### 养生课堂
- `GET /api/courses` - 视频课程列表
- `GET /api/courses/:id` - 课程详情
- `GET /api/articles` - 每日养生文章列表
- `GET /api/articles/:id` - 文章详情

### 武汉同城
- `GET /api/stores` - 门店列表
- `GET /api/stores/:id` - 门店详情
- `GET /api/salons` - 沙龙活动列表
- `POST /api/salons/reserve` - 沙龙预约提交
- `GET /api/group-buyings` - 同城拼团列表

## 合规说明

⚠️ 本商城所有内容仅作日常膳食参考，非医疗诊断，身体不适请及时就医。

🍵 本品为普通食品，仅作日常食补食用。

---

© 2024 毕生优养健康管理商城