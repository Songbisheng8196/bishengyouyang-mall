/**
 * 认证中间件
 * 毕生优养商城后端 API
 */

const jwt = require('jsonwebtoken');
const { error } = require('../utils/response');
const ErrorCodes = require('../utils/errorCodes');
const { User } = require('../../database/init');

/**
 * JWT 认证中间件
 * 验证请求头中的 Authorization token
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(ErrorCodes.UNAUTHORIZED);
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'bisheng-youyang-secret-key-2024');
      
      // 查询用户信息
      const user = await User.findByPk(decoded.userId);
      
      if (!user) {
        return res.status(401).json(ErrorCodes.USER_NOT_FOUND);
      }

      if (user.status !== 1) {
        return res.status(401).json(error(401, '账号已被禁用'));
      }

      // 将用户信息挂载到请求对象
      req.user = {
        id: user.id,
        openid: user.openid,
        nickname: user.nickname,
        avatar: user.avatar,
        member_level: user.member_level,
        points: user.points
      };
      
      next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json(ErrorCodes.TOKEN_EXPIRED);
      }
      return res.status(401).json(ErrorCodes.TOKEN_INVALID);
    }
  } catch (err) {
    console.error('认证中间件错误:', err);
    return res.status(500).json(error(500, '认证失败'));
  }
}

/**
 * 可选的认证中间件
 * 如果请求中没有token，不会报错，但会设置 req.user
 */
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'bisheng-youyang-secret-key-2024');
      const user = await User.findByPk(decoded.userId);
      req.user = user ? {
        id: user.id,
        openid: user.openid,
        nickname: user.nickname,
        avatar: user.avatar,
        member_level: user.member_level,
        points: user.points
      } : null;
    } catch (jwtError) {
      req.user = null;
    }
    
    next();
  } catch (err) {
    req.user = null;
    next();
  }
}

/**
 * 会员等级验证中间件
 * @param {number} requiredLevel 需要的会员等级
 */
function requireMemberLevel(requiredLevel) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(ErrorCodes.UNAUTHORIZED);
    }

    if (req.user.member_level < requiredLevel) {
      const levelNames = ['普通会员', '银卡会员', '金卡会员'];
      return res.status(403).json(error(403, `该功能需要${levelNames[requiredLevel] || '更高等级会员'}才可使用`));
    }

    next();
  };
}

/**
 * 生成JWT Token
 * @param {number} userId 用户ID
 * @returns {string} JWT Token
 */
function generateToken(userId) {
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'bisheng-youyang-secret-key-2024',
    { expiresIn }
  );
}

module.exports = {
  authenticate,
  optionalAuth,
  requireMemberLevel,
  generateToken
};