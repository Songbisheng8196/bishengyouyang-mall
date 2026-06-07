/**
 * 课程路由
 * 毕生优养商城后端 API
 * Phase2 - 视频上传接口
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const courseController = require('../controllers/courseController');
const articleController = require('../controllers/articleController');
const { success, error } = require('../utils/response');
const { Course } = require('../../database/init');

// ===================== 视频上传配置 =====================

// 配置 multer 存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const fs = require('fs');
    const uploadDir = path.join(__dirname, '../../uploads/courses');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `video_${uuidv4()}${ext}`;
    cb(null, filename);
  }
});

// 文件过滤器 - 只允许 mp4 格式
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['video/mp4', 'video/x-msvideo', 'video/quicktime'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('仅支持 MP4 视频格式'), false);
  }
};

// 配置 multer 实例
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB
  },
  fileFilter: fileFilter
});

// ===================== 课程公开接口 =====================

// GET /api/courses - 视频课程列表
router.get('/courses', courseController.getCourses);

// GET /api/courses/categories - 课程分类
router.get('/courses/categories', courseController.getCourseCategories);

// GET /api/courses/:id - 课程详情
router.get('/courses/:id', courseController.getCourseDetail);

// ===================== 课程管理接口 =====================

/**
 * POST /api/admin/courses/upload-video
 * 上传课程视频
 * 
 * 请求: multipart/form-data, field: video (mp4文件)
 *       field: courseId (可选，关联课程ID)
 * 
 * 响应: { code: 0, message: 'success', data: { videoUrl, filename, size } }
 */
router.post('/admin/courses/upload-video', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json(error('请上传视频文件'));
    }

    const { courseId } = req.body;
    const videoUrl = `/uploads/courses/${req.file.filename}`;
    const filename = req.file.filename;
    const size = req.file.size;

    // 如果提供了 courseId，更新课程记录
    if (courseId) {
      await Course.update(
        { videoUrl: videoUrl },
        { where: { id: parseInt(courseId) } }
      );
    }

    res.json(success({
      videoUrl: videoUrl,
      filename: filename,
      size: size,
      originalName: req.file.originalname,
      courseId: courseId ? parseInt(courseId) : null
    }, '视频上传成功'));

  } catch (err) {
    console.error('视频上传失败:', err);
    res.status(500).json(error('视频上传失败: ' + err.message));
  }
});

/**
 * PUT /api/admin/courses/:id
 * 更新课程信息
 */
router.put('/admin/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const allowedFields = [
      'title', 'subtitle', 'description', 'coverImage', 'videoUrl',
      'duration', 'type', 'memberLevel', 'status', 'chapters', 'script',
      'categoryType', 'viewCount'
    ];

    const data = {};
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        data[field] = updateData[field];
      }
    }

    const [updated] = await Course.update(data, { where: { id: parseInt(id) } });

    if (updated === 0) {
      return res.status(404).json(error('课程不存在'));
    }

    const course = await Course.findByPk(id);
    res.json(success(course, '课程更新成功'));

  } catch (err) {
    console.error('更新课程失败:', err);
    res.status(500).json(error('更新课程失败: ' + err.message));
  }
});

/**
 * POST /api/admin/courses
 * 创建新课程
 */
router.post('/admin/courses', async (req, res) => {
  try {
    const courseData = {
      title: req.body.title || '未命名课程',
      subtitle: req.body.subtitle || '',
      description: req.body.description || '',
      coverImage: req.body.coverImage || '/images/courses/cover-default.jpg',
      videoUrl: req.body.videoUrl || '',
      duration: req.body.duration || 0,
      type: req.body.type || 1,
      memberLevel: req.body.memberLevel || 0,
      status: req.body.status !== undefined ? req.body.status : 1,
      chapters: req.body.chapters || [],
      script: req.body.script || '',
      categoryType: req.body.categoryType || '免费',
      viewCount: 0
    };

    const course = await Course.create(courseData);
    res.json(success(course, '课程创建成功'));

  } catch (err) {
    console.error('创建课程失败:', err);
    res.status(500).json(error('创建课程失败: ' + err.message));
  }
});

/**
 * DELETE /api/admin/courses/:id
 * 删除课程
 */
router.delete('/admin/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Course.destroy({ where: { id: parseInt(id) } });

    if (deleted === 0) {
      return res.status(404).json(error('课程不存在'));
    }

    res.json(success(null, '课程删除成功'));

  } catch (err) {
    console.error('删除课程失败:', err);
    res.status(500).json(error('删除课程失败: ' + err.message));
  }
});

/**
 * GET /api/admin/courses
 * 获取所有课程（包含未发布的）
 */
router.get('/admin/courses', async (req, res) => {
  try {
    const { page = 1, pageSize = 20 } = req.query;

    const { count, rows } = await Course.findAndCountAll({
      order: [['created_at', 'DESC']],
      limit: parseInt(pageSize),
      offset: (parseInt(page) - 1) * parseInt(pageSize)
    });

    res.json({
      code: 0,
      message: 'success',
      data: {
        list: rows,
        total: count,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      }
    });

  } catch (err) {
    console.error('获取课程列表失败:', err);
    res.status(500).json(error('获取课程列表失败'));
  }
});

// ===================== 文章接口 =====================

// GET /api/articles - 每日养生文章列表
router.get('/articles', articleController.getArticles);

// GET /api/articles/categories - 文章分类
router.get('/articles/categories', articleController.getArticleCategories);

// GET /api/articles/:id - 文章详情
router.get('/articles/:id', articleController.getArticleDetail);

module.exports = router;