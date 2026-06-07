/**
 * 统一响应格式中间件
 * 毕生优养商城后端 API
 */

const { success } = require('../utils/response');

/**
 * 统一响应辅助函数
 */
const response = {
  ok: (res, data, message = 'success') => {
    return res.json(success(data, message));
  },
  
  created: (res, data, message = '创建成功') => {
    return res.status(201).json(success(data, message));
  },
  
  noContent: (res) => {
    return res.status(204).send();
  }
};

module.exports = response;