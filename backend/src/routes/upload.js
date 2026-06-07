/**
 * 图片上传路由
 * 毕生优养商城后端 API
 * Phase2 新增功能
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// 上传目录配置
const UPLOAD_DIR = path.join(__dirname, '../../uploads/products');
const CDN_BASE_URL = process.env.CDN_BASE_URL || '/uploads/products';

// 确保上传目录存在
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// 配置文件上传存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // 生成唯一文件名: {productId}_{type}_{uuid}.{ext}
    const productId = req.body.productId || 'temp';
    const fileType = req.body.fileType || 'main';
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${productId}_${fileType}_${uuidv4()}${ext}`;
    cb(null, filename);
  }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('仅支持 JPG/PNG/WEBP 格式图片'), false);
  }
};

// 配置 multer 中间件
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB 限制
  }
});

// 统一响应格式
const { success, error } = require('../utils/response');

/**
 * POST /api/admin/upload/image
 * 图片上传接口
 * 
 * 请求方式: multipart/form-data
 * 参数:
 *   - image: 图片文件 (必填)
 *   - productId: 商品ID (可选，用于命名)
 *   - fileType: 文件类型 main/detail (可选，默认 main)
 */
router.post('/image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json(error('请选择要上传的图片', 400));
    }

    // 生成 CDN URL
    const cdnUrl = `${CDN_BASE_URL}/${req.file.filename}`;

    res.json(success({
      url: cdnUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    }));
  } catch (err) {
    console.error('图片上传失败:', err);
    res.status(500).json(error('图片上传失败', 500));
  }
});

/**
 * POST /api/admin/upload/images
 * 多图上传接口
 * 
 * 请求方式: multipart/form-data
 * 参数:
 *   - images: 图片文件数组 (必填)
 *   - productId: 商品ID (可选)
 */
router.post('/images', upload.array('images', 9), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json(error('请选择要上传的图片', 400));
    }

    const images = req.files.map(file => ({
      url: `${CDN_BASE_URL}/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size
    }));

    res.json(success({
      images,
      count: images.length
    }));
  } catch (err) {
    console.error('图片上传失败:', err);
    res.status(500).json(error('图片上传失败', 500));
  }
});

// 错误处理中间件
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json(error('图片大小不能超过 5MB', 400));
    }
    return res.status(400).json(error(err.message, 400));
  }
  if (err.message) {
    return res.status(400).json(error(err.message, 400));
  }
  next(err);
});

module.exports = router;