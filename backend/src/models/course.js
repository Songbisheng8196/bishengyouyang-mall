/**
 * 课程数据模型
 * 毕生优养商城后端 API
 * Phase2 扩展字段定义
 * 
 * 注意：本项目使用 JSON 文件存储（database/data.json），非 Sequelize ORM
 * 此文件用于定义课程数据结构，提供字段说明和类型定义
 */

const CourseModel = {
  /**
   * 课程数据结构定义
   * Phase2 新增字段：videoUrl, coverImage, script, chapters, categoryType
   */
  schema: {
    id: { type: 'integer', description: '课程ID，自增主键' },
    title: { type: 'string', required: true, description: '课程标题' },
    subtitle: { type: 'string', description: '课程副标题' },
    description: { type: 'string', description: '课程详情（富文本HTML）' },
    coverImage: { type: 'string', description: '课程封面图URL，Phase2新增' },
    videoUrl: { type: 'string', description: '视频播放地址URL，Phase2新增' },
    duration: { type: 'integer', description: '课程时长（秒）' },
    type: { type: 'integer', default: 1, description: '课程类型：1免费 2会员 3配套' },
    categoryType: { type: 'string', enum: ['免费', '会员', '配套'], description: '课程分类类型，Phase2新增' },
    memberLevel: { type: 'integer', default: 0, description: '会员等级要求：0所有人 1白银 2黄金 3钻石' },
    status: { type: 'integer', default: 1, description: '课程状态：0下架 1上架' },
    viewCount: { type: 'integer', default: 0, description: '观看次数' },
    chapters: { type: 'JSON', description: '章节列表，Phase2新增，格式：[{"title":"第一章","startTime":"00:00","content":"章节内容"}]' },
    script: { type: 'Text', description: '课程讲义脚本，Phase2新增' },
    created_at: { type: 'string', description: '创建时间' },
    updated_at: { type: 'string', description: '更新时间' }
  },

  /**
   * Phase2 新增字段说明
   */
  phase2Fields: {
    videoUrl: {
      type: 'String',
      description: '视频播放地址URL，Phase2新增'
    },
    coverImage: {
      type: 'String',
      description: '课程封面图URL，Phase2新增'
    },
    script: {
      type: 'Text',
      description: '课程讲义脚本，用于视频字幕和课程摘要，Phase2新增'
    },
    chapters: {
      type: 'JSON数组',
      format: '[{"title":"章节标题","startTime":"00:00","content":"章节内容摘要"}]',
      description: '章节列表，包含标题、开始时间、内容摘要，Phase2新增'
    },
    categoryType: {
      type: 'Enum',
      values: ['免费', '会员', '配套'],
      description: '课程分类类型，Phase2新增'
    }
  },

  /**
   * 课程类型映射
   */
  typeMap: {
    1: '免费课程',
    2: '会员课程',
    3: '配套课程'
  },

  /**
   * categoryType 枚举值
   */
  categoryTypes: ['免费', '会员', '配套'],

  /**
   * 创建课程记录
   * @param {Object} data - 课程数据
   * @returns {Object} 包含完整字段的课程记录
   */
  create(data) {
    return {
      id: data.id,
      title: data.title || '未命名课程',
      subtitle: data.subtitle || '',
      description: data.description || '',
      coverImage: data.coverImage || '/images/courses/cover-default.jpg',
      videoUrl: data.videoUrl || '',
      duration: parseInt(data.duration) || 0,
      type: parseInt(data.type) || 1,
      categoryType: data.categoryType || this.getCategoryTypeFromType(data.type),
      memberLevel: parseInt(data.memberLevel) || 0,
      status: data.status !== undefined ? data.status : 1,
      viewCount: parseInt(data.viewCount) || 0,
      chapters: data.chapters || [],
      script: data.script || '',
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString()
    };
  },

  /**
   * 转换课程响应格式
   * 用于 API 返回给前端
   * @param {Object} course - 课程记录
   * @returns {Object} 前端友好的课程数据
   */
  toResponse(course) {
    return {
      id: course.id,
      title: course.title,
      subtitle: course.subtitle,
      description: course.description,
      coverImage: course.coverImage || course.cover_image,
      videoUrl: course.videoUrl || course.video_url,
      duration: course.duration,
      type: course.type,
      type_text: this.typeMap[course.type] || '未知类型',
      categoryType: course.categoryType || this.getCategoryTypeFromType(course.type),
      memberLevel: course.memberLevel || course.member_level,
      viewCount: course.viewCount || course.view_count || 0,
      chapters: this.parseChapters(course.chapters),
      script: course.script || '',
      status: course.status,
      compliance_notice: '⚠️ 本页内容仅作日常参考，非医疗诊断，身体不适请及时就医。'
    };
  },

  /**
   * 解析 chapters 字段
   * 处理字符串或数组格式
   */
  parseChapters(chapters) {
    if (!chapters) return [];
    if (typeof chapters === 'string') {
      try {
        return JSON.parse(chapters);
      } catch (e) {
        return [];
      }
    }
    return chapters;
  },

  /**
   * 从 type 数字获取 categoryType 文本
   */
  getCategoryTypeFromType(type) {
    const mapping = { 1: '免费', 2: '会员', 3: '配套' };
    return mapping[type] || '免费';
  },

  /**
   * 校验章节数据格式
   */
  validateChapters(chapters) {
    if (!Array.isArray(chapters)) {
      return { valid: false, error: 'chapters 必须是数组' };
    }
    for (const chapter of chapters) {
      if (!chapter.title) {
        return { valid: false, error: '章节缺少 title 字段' };
      }
      if (!chapter.startTime) {
        return { valid: false, error: '章节缺少 startTime 字段' };
      }
      if (!chapter.content) {
        return { valid: false, error: '章节缺少 content 字段' };
      }
    }
    return { valid: true };
  }
};

module.exports = CourseModel;