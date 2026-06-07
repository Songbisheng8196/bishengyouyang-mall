/**
 * 工具函数统一导出
 * 毕生优养商城后端 API
 */

const response = require('./response');
const ErrorCodes = require('./errorCodes');

module.exports = {
  ...response,
  ErrorCodes
};