const fs = require('fs');
const path = require('path');

// 文章模型（JSON存储）
// 数据文件：database/articles.json

function findAll(options = {}) {
  const dataPath = path.join(__dirname, '../../database/articles.json');
  let articles = [];
  try {
    articles = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  } catch (e) {
    articles = [];
  }

  if (options.where) {
    if (options.where.category) {
      articles = articles.filter(a => a.category === options.where.category);
    }
    if (options.where.status !== undefined) {
      articles = articles.filter(a => a.status === options.where.status);
    }
  }

  const total = articles.length;
  if (options.limit) {
    const offset = options.offset || 0;
    articles = articles.slice(offset, offset + options.limit);
  }

  return Promise.resolve({ rows: articles, count: total });
}

function findByPk(id) {
  const dataPath = path.join(__dirname, '../../database/articles.json');
  let articles = [];
  try {
    articles = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  } catch (e) {
    articles = [];
  }
  const article = articles.find(a => a.id === id);
  return Promise.resolve(article || null);
}

async function create(data) {
  const dataPath = path.join(__dirname, '../../database/articles.json');
  let articles = [];
  try { articles = JSON.parse(fs.readFileSync(dataPath, 'utf-8')); } catch (e) {}
  const id = Date.now().toString();
  const article = { id, ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  articles.push(article);
  fs.writeFileSync(dataPath, JSON.stringify(articles, null, 2));
  return Promise.resolve(article);
}

async function update(data, options) {
  const dataPath = path.join(__dirname, '../../database/articles.json');
  let articles = [];
  try { articles = JSON.parse(fs.readFileSync(dataPath, 'utf-8')); } catch (e) {}
  const idx = articles.findIndex(a => a.id === options.where.id);
  if (idx === -1) return Promise.resolve([0]);
  articles[idx] = { ...articles[idx], ...data, updatedAt: new Date().toISOString() };
  fs.writeFileSync(dataPath, JSON.stringify(articles, null, 2));
  return Promise.resolve([1]);
}

module.exports = { findAll, findByPk, create, update, findAndCountAll: findAll };