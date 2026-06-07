/**
 * 参数校验中间件
 * 毕生优养商城后端 API
 */

const { validationResult } = require('express-validator');
const { error } = require('../utils/response');

/**
 * 校验结果处理中间件
 * 必须在路由验证规则之后使用
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }));
    return res.status(400).json(error(400, '参数校验失败', errorMessages));
  }
  next();
}

/**
 * 通用校验规则工厂函数
 */
const validators = {
  // 必填字符串
  requiredString: (field, min = 1, max = 255) => ({
    field,
    rules: {
      notEmpty: { errorMessage: `${field}不能为空` },
      isString: { errorMessage: `${field}必须是字符串` },
      isLength: { 
        options: { min, max },
        errorMessage: `${field}长度必须在${min}-${max}之间`
      }
    }
  }),

  // 可选字符串
  optionalString: (field, min = 0, max = 255) => ({
    field,
    rules: {
      optional: true,
      isString: { errorMessage: `${field}必须是字符串` },
      isLength: {
        options: { min, max },
        errorMessage: `${field}长度必须在${min}-${max}之间`
      }
    }
  }),

  // 手机号
  phone: (field = 'phone') => ({
    field,
    rules: {
      notEmpty: { errorMessage: '手机号不能为空' },
      isMobilePhone: {
        options: 'zh-CN',
        errorMessage: '手机号格式不正确'
      }
    }
  }),

  // 邮箱
  email: (field = 'email') => ({
    field,
    rules: {
      notEmpty: { errorMessage: '邮箱不能为空' },
      isEmail: { errorMessage: '邮箱格式不正确' }
    }
  }),

  // 正整数
  positiveInt: (field) => ({
    field,
    rules: {
      notEmpty: { errorMessage: `${field}不能为空` },
      isInt: {
        options: { min: 1 },
        errorMessage: `${field}必须是正整数`
      }
    }
  }),

  // ID校验
  id: (field = 'id') => ({
    field,
    rules: {
      notEmpty: { errorMessage: 'ID不能为空' },
      isInt: {
        options: { min: 1 },
        errorMessage: 'ID必须是正整数'
      }
    }
  }),

  // 分页参数
  pagination: () => ({
    field: 'pagination',
    rules: {
      optional: true,
      isInt: {
        options: { min: 1 },
        errorMessage: '分页参数必须是正整数'
      }
    }
  })
};

module.exports = {
  validate,
  validators
};