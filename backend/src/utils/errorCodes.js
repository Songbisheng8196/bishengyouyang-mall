/**
 * 错误码定义
 * 毕生优养商城后端 API
 */

const ErrorCodes = {
  // 成功
  SUCCESS: { code: 0, message: 'success' },
  
  // 客户端错误 4xx
  BAD_REQUEST: { code: 400, message: '参数错误' },
  UNAUTHORIZED: { code: 401, message: '未授权，请先登录' },
  FORBIDDEN: { code: 403, message: '权限不足' },
  NOT_FOUND: { code: 404, message: '资源不存在' },
  METHOD_NOT_ALLOWED: { code: 405, message: '请求方法不允许' },
  
  // 服务器错误 5xx
  INTERNAL_ERROR: { code: 500, message: '服务器内部错误' },
  SERVICE_UNAVAILABLE: { code: 503, message: '服务暂不可用' },
  
  // 业务错误 1xxx
  USER_NOT_FOUND: { code: 1001, message: '用户不存在' },
  USER_ALREADY_EXISTS: { code: 1002, message: '用户已存在' },
  INVALID_CREDENTIALS: { code: 1003, message: '用户名或密码错误' },
  TOKEN_EXPIRED: { code: 1004, message: '登录已过期，请重新登录' },
  TOKEN_INVALID: { code: 1005, message: '无效的登录凭证' },
  
  // 业务错误 2xxx
  PRODUCT_NOT_FOUND: { code: 2001, message: '商品不存在' },
  PRODUCT_STOCK_NOT_ENOUGH: { code: 2002, message: '商品库存不足' },
  CART_EMPTY: { code: 2003, message: '购物车为空' },
  ORDER_NOT_FOUND: { code: 2004, message: '订单不存在' },
  ORDER_CANNOT_CANCEL: { code: 2005, message: '该订单无法取消' },
  
  // 业务错误 3xxx
  COUPON_NOT_FOUND: { code: 3001, message: '优惠券不存在' },
  COUPON_EXPIRED: { code: 3002, message: '优惠券已过期' },
  COUPON_USED: { code: 3003, message: '优惠券已使用' },
  POINTS_NOT_ENOUGH: { code: 3004, message: '积分不足' },
  
  // 业务错误 4xxx
  CONSTITUTION_REPORT_NOT_FOUND: { code: 4001, message: '体质报告不存在' },
  CHECKIN_ALREADY_EXISTS: { code: 4002, message: '今日已打卡' },
  STORE_NOT_FOUND: { code: 4001, message: '门店不存在' },
  SALON_NOT_FOUND: { code: 4002, message: '沙龙活动不存在' },
  SALON_FULL: { code: 4003, message: '沙龙预约已满' }
};

module.exports = ErrorCodes;