/**
 * 体质测评控制器
 * 毕生优养商城后端 API
 * Phase2 支持真实测评逻辑和数据
 */

const fs = require('fs');
const path = require('path');
const { body } = require('express-validator');
const { ConstitutionRecord } = require('../../database/init');
const { success, paginate } = require('../utils/response');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');

// 数据文件路径
const QUESTIONS_FILE = path.join(__dirname, '../../database/questions.json');
const RECOMMENDATIONS_FILE = path.join(__dirname, '../../database/recommendations.json');

// 体质类型映射
const constitutionTypes = {
  '平和质': { id: 1, name: '平和质', description: '阴阳气血调和，体态适中，面色润泽，精力充沛。' },
  '气虚质': { id: 2, name: '气虚质', description: '元气不足，容易疲乏，气短懒言，易出汗。' },
  '阳虚质': { id: 3, name: '阳虚质', description: '阳气不足，畏寒怕冷，手足不温，喜热饮食。' },
  '阴虚质': { id: 4, name: '阴虚质', description: '阴液亏少，口燥咽干，手足心热，喜冷饮。' },
  '痰湿质': { id: 5, name: '痰湿质', description: '痰湿凝聚，体形肥胖，腹部肥满，面部皮肤油脂较多。' },
  '湿热质': { id: 6, name: '湿热质', description: '湿热内蕴，面垢油光，易生痤疮，口苦口干。' },
  '血瘀质': { id: 7, name: '血瘀质', description: '血行不畅，肤色晦黯，色素沉着，易出现瘀斑。' },
  '气郁质': { id: 8, name: '气郁质', description: '气机郁滞，神情抑郁，忧虑脆弱，烦闷不乐。' },
  '特禀质': { id: 9, name: '特禀质', description: '先天失常，以生理缺陷、过敏反应等为主要特征。' }
};

/**
 * 加载题目数据
 */
function loadQuestions() {
  try {
    const data = fs.readFileSync(QUESTIONS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('加载题目数据失败:', error);
    return [];
  }
}

/**
 * 加载推荐方案数据
 */
function loadRecommendations() {
  try {
    const data = fs.readFileSync(RECOMMENDATIONS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('加载推荐方案数据失败:', error);
    return {};
  }
}

/**
 * 计算体质类型
 * @param {Array} answers - 用户答案 [{questionId, score}]
 * @returns {Object} 体质类型结果
 */
function calculateConstitution(answers) {
  const questions = loadQuestions();
  const questionMap = {};
  questions.forEach(q => { questionMap[q.id] = q; });

  // 统计每种体质的加权得分
  const scores = {};
  Object.keys(constitutionTypes).forEach(type => {
    scores[type] = 0;
  });

  answers.forEach(answer => {
    const question = questionMap[answer.questionId];
    if (question && question.weightType) {
      scores[question.weightType] += answer.score * 1;
    }
  });

  // 找出得分最高的体质
  let maxScore = 0;
  let resultType = '平和质';

  Object.keys(scores).forEach(type => {
    if (scores[type] > maxScore) {
      maxScore = scores[type];
      resultType = type;
    }
  });

  return {
    type: resultType,
    info: constitutionTypes[resultType],
    score: maxScore,
    allScores: scores
  };
}

/**
 * 获取测评题目
 * GET /api/constitution/questions
 * 返回20道题目列表
 */
const getQuestions = asyncHandler(async (req, res) => {
  const questions = loadQuestions();

  if (questions.length === 0) {
    // 如果题目文件不存在，返回占位数据
    const placeholderQuestions = [];
    for (let i = 1; i <= 20; i++) {
      placeholderQuestions.push({
        id: i,
        title: `题目${i}：您是否有以下症状？（此为占位数据）`,
        options: [
          { label: '从不', score: 1 },
          { label: '偶尔', score: 2 },
          { label: '有时', score: 3 },
          { label: '经常', score: 4 }
        ],
        dimension: '综合',
        weightType: '平和质',
        sortOrder: i
      });
    }
    return res.json(success(placeholderQuestions));
  }

  // 返回题目列表（不包含正确答案）
  const questionList = questions.map(q => ({
    id: q.id,
    title: q.title,
    options: q.options,
    dimension: q.dimension,
    weightType: q.weightType,
    sortOrder: q.sortOrder
  }));

  res.json(success(questionList));
});

/**
 * 提交测评结果
 * POST /api/constitution/submit
 * 接收 answers，计算体质类型，返回体质类型+推荐方案
 */
const submitConstitution = asyncHandler(async (req, res) => {
  const { answers } = req.body;
  const userId = req.user ? req.user.id : null;

  // 参数校验
  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    throw new ApiError(require('../utils/errorCodes').BAD_REQUEST);
  }

  // 计算体质类型
  const result = calculateConstitution(answers);
  const recommendations = loadRecommendations();
  const rec = recommendations[result.type] || {};

  // 构建推荐数据
  const recommendProducts = (rec.products || []).map(p => ({
    sku: p.sku,
    name: p.name,
    subtitle: p.subtitle,
    price: p.price,
    cover_image: p.cover_image,
    tags: p.tags
  }));

  const recommendRecipes = rec.recipes || [];
  const recommendCourse = rec.course || null;

  // 保存测评记录
  let record = null;
  if (userId) {
    record = await ConstitutionRecord.create({
      user_id: userId,
      answers: JSON.stringify(answers),
      result_type: result.info.id,
      result_name: result.type,
      result_description: result.info.description,
      recommend_products: JSON.stringify(recommendProducts.map(p => p.sku))
    });
  }

  res.status(201).json(success({
    id: record ? record.id : null,
    userId: userId,
    result_type: result.info.id,
    result_name: result.type,
    result_description: result.info.description,
    result_score: result.score,
    all_scores: result.allScores,
    products: recommendProducts,
    recipes: recommendRecipes,
    course: recommendCourse,
    compliance_notice: '本测评仅作日常膳食参考，非医疗诊断，身体不适请及时就医。'
  }, '测评完成'));
});

/**
 * 查询历史报告
 * GET /api/constitution/reports
 */
const getReports = asyncHandler(async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const userId = req.user.id;

  const { count, rows } = await ConstitutionRecord.findAndCountAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']],
    limit: parseInt(pageSize),
    offset: (parseInt(page) - 1) * parseInt(pageSize)
  });

  const reports = rows.map(report => ({
    id: report.id,
    result_type: report.result_type,
    result_name: report.result_name,
    result_description: report.result_description,
    created_at: report.created_at
  }));

  res.json(paginate(reports, count, page, pageSize));
});

/**
 * 获取推荐方案
 * GET /api/constitution/recommend
 * 根据体质类型返回推荐产品/食谱/课程
 */
const getRecommend = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { type } = req.query;

  // 如果指定了体质类型，直接查询
  if (type && constitutionTypes[type]) {
    const recommendations = loadRecommendations();
    const rec = recommendations[type] || {};

    return res.json(success({
      constitution_type: constitutionTypes[type].id,
      constitution_name: type,
      description: constitutionTypes[type].description,
      daily_tips: rec.dailyTips || [],
      products: rec.products || [],
      recipes: rec.recipes || [],
      course: rec.course || null,
      compliance_notice: '本测评仅作日常膳食参考，非医疗诊断，身体不适请及时就医。'
    }));
  }

  // 获取最新测评报告
  const latestReport = await ConstitutionRecord.findOne({
    where: { user_id: userId },
    order: [['created_at', 'DESC']]
  });

  if (!latestReport) {
    // 如果没有测评记录，返回默认推荐
    return res.json(success({
      constitution_type: null,
      constitution_name: '未测评',
      description: '完成体质测评，获取专属推荐方案',
      daily_tips: [
        '规律作息，早睡早起',
        '均衡饮食，荤素搭配',
        '适量运动，增强体质',
        '保持心情愉悦'
      ],
      products: [],
      recipes: [],
      course: null,
      compliance_notice: '本测评仅作日常膳食参考，非医疗诊断，身体不适请及时就医。'
    }));
  }

  // 根据历史测评结果返回推荐
  const resultType = latestReport.result_name;
  const recommendations = loadRecommendations();
  const rec = recommendations[resultType] || {};

  res.json(success({
    constitution_type: latestReport.result_type,
    constitution_name: resultType,
    description: latestReport.result_description,
    daily_tips: rec.dailyTips || [],
    products: rec.products || [],
    recipes: rec.recipes || [],
    course: rec.course || null,
    compliance_notice: '本测评仅作日常膳食参考，非医疗诊断，身体不适请及时就医。'
  }));
});

/**
 * 获取所有体质类型列表
 * GET /api/constitution/types
 */
const getTypes = asyncHandler(async (req, res) => {
  const types = Object.keys(constitutionTypes).map(key => ({
    id: constitutionTypes[key].id,
    name: constitutionTypes[key].name,
    description: constitutionTypes[key].description
  }));

  res.json(success(types));
});

/**
 * 获取单个推荐方案详情
 * GET /api/constitution/recommend/:type
 */
const getRecommendByType = asyncHandler(async (req, res) => {
  const { type } = req.params;

  if (!constitutionTypes[type]) {
    throw new ApiError(require('../utils/errorCodes').NOT_FOUND);
  }

  const recommendations = loadRecommendations();
  const rec = recommendations[type] || {};

  res.json(success({
    constitution_type: constitutionTypes[type].id,
    constitution_name: type,
    description: constitutionTypes[type].description,
    daily_tips: rec.dailyTips || [],
    products: rec.products || [],
    recipes: rec.recipes || [],
    course: rec.course || null,
    compliance_notice: '本测评仅作日常膳食参考，非医疗诊断，身体不适请及时就医。'
  }));
});

// 验证规则
const submitValidation = [
  body('answers').isArray({ min: 1 }).withMessage('请至少回答一道题目')
];

module.exports = {
  getQuestions,
  submitConstitution,
  getReports,
  getRecommend,
  getRecommendByType,
  getTypes,
  submitValidation
};