/**
 * 统一响应格式工具
 * 毕生优养商城后端 API
 */

/**
 * 成功响应
 * @param {*} data 返回数据
 * @param {string} message 成功消息
 * @returns {Object} 统一响应格式
 */
function success(data = null, message = 'success') {
  return {
    code: 0,
    message,
    data
  };
}

/**
 * 错误响应
 * @param {number} code 错误码
 * @param {string} message 错误消息
 * @param {*} errors 详细错误信息
 * @returns {Object} 统一响应格式
 */
function error(code = 500, message = '服务器内部错误', errors = null) {
  const response = {
    code,
    message
  };
  if (errors) {
    response.errors = errors;
  }
  return response;
}

/**
 * 分页响应
 * @param {Array} list 数据列表
 * @param {number} total 总数
 * @param {number} page 当前页码
 * @param {number} pageSize 每页数量
 * @returns {Object} 分页响应格式
 */
function paginate(list, total, page = 1, pageSize = 10) {
  return {
    code: 0,
    message: 'success',
    data: {
      list,
      pagination: {
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        totalPages: Math.ceil(total / pageSize)
      }
    }
  };
}

module.exports = {
  success,
  error,
  paginate
};