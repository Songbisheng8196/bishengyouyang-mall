/**
 * 文章控制器
 * 毕生优养商城后端 API
 */

const { Article } = require('../../database/init');
const { success, paginate } = require('../utils/response');
const { asyncHandler } = require('../middleware/errorHandler');

// 文章分类
const articleCategories = {
  'jieqi': '节气养生',
  'season': '四季食补',
  'period': '生理期膳食',
  'tips': '养生小贴士'
};

/**
 * 获取文章列表
 * GET /api/articles
 */
const getArticles = asyncHandler(async (req, res) => {
  const { page = 1, pageSize = 10, category } = req.query;

  const where = { status: 1 };
  if (category) {
    where.category = category;
  }

  const { count, rows } = await Article.findAndCountAll({
    where,
    order: [['publish_time', 'DESC'], ['created_at', 'DESC']],
    limit: parseInt(pageSize),
    offset: (parseInt(page) - 1) * parseInt(pageSize)
  });

  // Phase1 如果没有真实数据，返回占位数据
  if (rows.length === 0) {
    const placeholderArticles = generatePlaceholderArticles(page, pageSize);
    return res.json(paginate(placeholderArticles, 30, page, pageSize));
  }

  const articles = rows.map(article => ({
    id: article.id,
    title: article.title,
    cover_image: article.cover_image,
    category: article.category,
    category_text: articleCategories[article.category] || article.category,
    summary: article.summary,
    author: article.author,
    view_count: article.view_count,
    like_count: article.like_count,
    publish_time: article.publish_time
  }));

  res.json(paginate(articles, count, page, pageSize));
});

/**
 * 获取文章详情
 * GET /api/articles/:id
 */
const getArticleDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const article = await Article.findByPk(id);

  if (!article) {
    // Phase1 返回占位数据
    const articleId = parseInt(id);
    const placeholder = getPlaceholderArticle(articleId);
    return res.json(success({
      ...placeholder,
      compliance_notice: '⚠️ 本页内容仅作日常膳食参考，非医疗诊断，身体不适请及时就医。'
    }));
  }

  // 增加阅读量
  await Article.increment('view_count', { by: 1, where: { id } });

  res.json(success({
    id: article.id,
    title: article.title,
    cover_image: article.cover_image,
    category: article.category,
    category_text: articleCategories[article.category] || article.category,
    content: article.content,
    summary: article.summary,
    author: article.author,
    view_count: article.view_count + 1,
    like_count: article.like_count,
    tags: article.tags,
    publish_time: article.publish_time,
    compliance_notice: '⚠️ 本页内容仅作日常膳食参考，非医疗诊断，身体不适请及时就医。'
  }));
});

/**
 * 获取文章分类
 * GET /api/articles/categories
 */
const getArticleCategories = asyncHandler(async (req, res) => {
  const categories = [
    { id: 'jieqi', name: '节气养生', icon: '🌿' },
    { id: 'season', name: '四季食补', icon: '🍃' },
    { id: 'period', name: '生理期膳食', icon: '🌸' },
    { id: 'tips', name: '养生小贴士', icon: '💡' }
  ];

  res.json(success(categories));
});

/**
 * 生成占位文章数据
 */
function generatePlaceholderArticles(page, pageSize) {
  const totalPlaceholder = 30;
  const startIndex = (page - 1) * pageSize;
  
  if (startIndex >= totalPlaceholder) {
    return [];
  }

  const articles = [];
  const endIndex = Math.min(startIndex + pageSize, totalPlaceholder);

  const sampleTitles = [
    '立夏时节养生：清淡饮食养心安神',
    '夏季祛湿攻略：这些食物帮你轻松排湿',
    '女性生理期膳食调理指南',
    '秋天润肺养颜的养生粥做法',
    '冬季进补的正确打开方式',
    '办公室白领养生茶饮推荐',
    '中医食疗调理气血不足',
    '适合女性的养生花茶搭配',
    '春季养肝护肝的饮食建议',
    '睡眠不好？试试这些安神食疗方'
  ];

  const categories = ['jieqi', 'season', 'period', 'tips'];

  for (let i = startIndex; i < endIndex; i++) {
    const catIndex = i % categories.length;
    articles.push({
      id: i + 1,
      title: sampleTitles[i % sampleTitles.length],
      cover_image: `/images/articles/article-${(i % 5) + 1}.jpg`,
      category: categories[catIndex],
      category_text: articleCategories[categories[catIndex]],
      summary: '本文将为您详细介绍养生知识，帮助您在日常生活中更好地调养身体。',
      author: '毕生优养专家',
      view_count: Math.floor(Math.random() * 1000) + 100,
      like_count: Math.floor(Math.random() * 100) + 10,
      publish_time: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
    });
  }

  return articles;
}

/**
 * 获取单个占位文章
 */
function getPlaceholderArticle(id) {
  const titles = [
    '立夏时节养生：清淡饮食养心安神',
    '夏季祛湿攻略：这些食物帮你轻松排湿',
    '女性生理期膳食调理指南'
  ];
  
  return {
    id,
    title: titles[(id - 1) % titles.length] || '每日养生文章',
    cover_image: `/images/articles/article-${(id % 5) + 1}.jpg`,
    category: ['jieqi', 'season', 'period', 'tips'][id % 4],
    category_text: articleCategories[['jieqi', 'season', 'period', 'tips'][id % 4]],
    content: `<h2>导语</h2>
<p>养生是我们日常生活中不可忽视的重要话题。本篇文章将为您详细介绍相关的养生知识，帮助您更好地了解如何通过日常饮食来调养身体。</p>

<h2>主要内容</h2>
<p>养生贵在坚持，重在方法。以下是几点建议：</p>
<ol>
<li>规律作息，早睡早起</li>
<li>均衡饮食，荤素搭配</li>
<li>适度运动，增强体质</li>
<li>保持心情愉悦</li>
</ol>

<h2>结语</h2>
<p>希望以上内容对您有所帮助。养生是一个长期的过程，需要我们持之以恒。</p>`,
    summary: '本文将为您详细介绍养生知识，帮助您在日常生活中更好地调养身体。',
    author: '毕生优养专家',
    view_count: Math.floor(Math.random() * 1000) + 100,
    like_count: Math.floor(Math.random() * 100) + 10,
    tags: ['养生', '食补', '健康'],
    publish_time: new Date().toISOString()
  };
}

module.exports = {
  getArticles,
  getArticleDetail,
  getArticleCategories
};