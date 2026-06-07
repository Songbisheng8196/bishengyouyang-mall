/**
 * 课程控制器
 * 毕生优养商城后端 API
 * Phase2 - 扩展视频课程字段
 */

const { Course, User } = require('../../database/init');
const { success, paginate } = require('../utils/response');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * 获取课程列表
 * GET /api/courses
 * 
 * Query参数:
 * - page: 页码 (默认1)
 * - pageSize: 每页数量 (默认10)
 * - categoryType: 课程类型筛选 (免费/会员/配套)
 * - type: 课程类型数字 (1=免费, 2=会员, 3=配套)
 */
const getCourses = asyncHandler(async (req, res) => {
  const { page = 1, pageSize = 10, type, categoryType } = req.query;

  const where = { status: 1 };
  
  // 支持 categoryType 筛选 (免费/会员/配套)
  if (categoryType) {
    where.categoryType = categoryType;
  }
  
  // 兼容 type 参数
  if (type) {
    where.type = parseInt(type);
  }

  const { count, rows } = await Course.findAndCountAll({
    where,
    order: [['created_at', 'DESC']],
    limit: parseInt(pageSize),
    offset: (parseInt(page) - 1) * parseInt(pageSize)
  });

  // Phase2 返回完整课程信息
  const courses = rows.map(course => ({
    id: course.id,
    title: course.title,
    subtitle: course.subtitle,
    coverImage: course.coverImage || course.cover_image,
    videoUrl: course.videoUrl || course.video_url,
    duration: course.duration,
    type: course.type,
    type_text: getCourseTypeText(course.type),
    categoryType: course.categoryType || getCategoryTypeFromType(course.type),
    memberLevel: course.memberLevel || course.member_level,
    viewCount: course.viewCount || course.view_count || 0,
    description: course.description || ''
  }));

  res.json(paginate(courses, count, page, pageSize));
});

/**
 * 获取课程详情
 * GET /api/courses/:id
 * 
 * 返回完整课程信息，含 chapters/script
 */
const getCourseDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  const course = await Course.findByPk(id);

  if (!course) {
    // 返回占位数据
    return res.json(success({
      id: parseInt(id),
      title: '中医养生基础课',
      subtitle: '了解中医养生知识，开启健康生活',
      coverImage: '/images/courses/cover-default.jpg',
      videoUrl: '',
      duration: 1800,
      type: 1,
      type_text: '免费课程',
      categoryType: '免费',
      memberLevel: 0,
      description: '<p>本课程将为您介绍中医养生的基础知识，帮助您了解如何通过日常饮食和生活习惯来调养身体。</p>',
      chapters: [
        { id: 1, title: '第一章：中医基础理论', startTime: '00:00', content: '介绍中医的基本理论框架' },
        { id: 2, title: '第二章：体质辨识', startTime: '10:00', content: '学习如何辨别自身体质类型' },
        { id: 3, title: '第三章：日常养生', startTime: '20:00', content: '日常养生方法和注意事项' }
      ],
      script: '课程讲义脚本占位...',
      viewCount: 0,
      canWatch: true,
      compliance_notice: '⚠️ 本页内容仅作日常参考，非医疗诊断，身体不适请及时就医。'
    }));
  }

  // 检查用户是否有权限观看
  let canWatch = false;
  if (course.type === 1 || course.memberLevel === 0 || course.member_level === 0) {
    canWatch = true;
  } else if (userId) {
    const user = await User.findByPk(userId);
    const memberLevel = course.memberLevel || course.member_level || 0;
    canWatch = user && user.member_level >= memberLevel;
  }

  // 增加观看次数
  await Course.increment('viewCount', { by: 1, where: { id } });

  // 解析 chapters 和 script 字段
  let chapters = [];
  let script = '';
  
  if (course.chapters) {
    if (typeof course.chapters === 'string') {
      try {
        chapters = JSON.parse(course.chapters);
      } catch (e) {
        chapters = course.chapters;
      }
    } else {
      chapters = course.chapters;
    }
  }
  
  if (course.script) {
    script = course.script;
  }

  res.json(success({
    id: course.id,
    title: course.title,
    subtitle: course.subtitle,
    coverImage: course.coverImage || course.cover_image,
    videoUrl: canWatch ? (course.videoUrl || course.video_url) : null,
    duration: course.duration,
    type: course.type,
    type_text: getCourseTypeText(course.type),
    categoryType: course.categoryType || getCategoryTypeFromType(course.type),
    memberLevel: course.memberLevel || course.member_level,
    description: course.description,
    chapters: chapters,
    script: script,
    viewCount: (course.viewCount || course.view_count || 0) + 1,
    canWatch: canWatch,
    compliance_notice: '⚠️ 本页内容仅作日常参考，非医疗诊断，身体不适请及时就医。'
  }));
});

/**
 * 获取课程分类
 * GET /api/courses/categories
 */
const getCourseCategories = asyncHandler(async (req, res) => {
  // Phase1 占位数据
  const categories = [
    { id: 1, name: '全部课程', count: 0 },
    { id: 2, name: '免费课程', type: 1, categoryType: '免费', count: 0 },
    { id: 3, name: '会员课程', type: 2, categoryType: '会员', count: 0 },
    { id: 4, name: '配套课程', type: 3, categoryType: '配套', count: 0 }
  ];

  // 统计各类型课程数量
  const courses = await Course.findAll({ where: { status: 1 } });
  
  categories.forEach(cat => {
    if (cat.type) {
      cat.count = courses.filter(c => c.type === cat.type).length;
    } else {
      cat.count = courses.length;
    }
  });

  res.json(success(categories));
});

/**
 * 获取课程类型文本
 */
function getCourseTypeText(type) {
  const types = {
    1: '免费课程',
    2: '会员课程',
    3: '配套课程'
  };
  return types[type] || '未知类型';
}

/**
 * 从 type 数字获取 categoryType 文本
 */
function getCategoryTypeFromType(type) {
  const mapping = {
    1: '免费',
    2: '会员',
    3: '配套'
  };
  return mapping[type] || '免费';
}

module.exports = {
  getCourses,
  getCourseDetail,
  getCourseCategories
};