/**
 * 中间件统一导出
 * 毕生优养商城后端 API
 */

const { notFoundHandler, errorHandler, asyncHandler, ApiError } = require('./errorHandler');
const { validate, validators } = require('./validator');
const { authenticate, optionalAuth, requireMemberLevel, generateToken } = require('./auth');
const response = require('./response');

module.exports = {
  notFoundHandler,
  errorHandler,
  asyncHandler,
  ApiError,
  validate,
  validators,
  authenticate,
  optionalAuth,
  requireMemberLevel,
  generateToken,
  response
};