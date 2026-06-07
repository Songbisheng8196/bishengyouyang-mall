/**
 * 统一错误处理中间件
 * 毕生优养商城后端 API
 */

const { error } = require('../utils/response');
const ErrorCodes = require('../utils/errorCodes');

/**
 * 404 处理中间件
 */
function notFoundHandler(req, res) {
  res.status(404).json(error(404, '接口不存在'));
}

/**
 * 全局错误处理中间件
 */
function errorHandler(err, req, res, next) {
  console.error('服务器错误:', err);

  // 开发环境返回详细错误
  if (process.env.NODE_ENV === 'development') {
    return res.status(500).json({
      code: 500,
      message: err.message || '服务器内部错误',
      errors: err.errors,
      stack: err.stack
    });
  }

  // 生产环境返回通用错误
  res.status(500).json(error(500, '服务器内部错误'));
}

/**
 * 异步处理包装器
 * 统一处理 async 函数中的错误
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * 自定义业务错误类
 */
class ApiError extends Error {
  constructor(errorCode) {
    const { code, message } = errorCode;
    super(message);
    this.code = code;
    this.status = code >= 1000 ? 200 : code; // 业务错误返回200
  }
}

module.exports = {
  notFoundHandler,
  errorHandler,
  asyncHandler,
  ApiError
};