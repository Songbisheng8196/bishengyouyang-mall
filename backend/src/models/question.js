const fs = require('fs');
const path = require('path');

// 体质测评题库模型（JSON存储）
// 数据文件：database/questions.json

function findAll(options = {}) {
  const dataPath = path.join(__dirname, '../../database/questions.json');
  let questions = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  if (options.order) {
    questions.sort((a, b) => {
      for (const [attr, dir] of options.order) {
        const va = a[attr], vb = b[attr];
        if (va < vb) return dir === 'ASC' ? -1 : 1;
        if (va > vb) return dir === 'ASC' ? 1 : -1;
      }
      return 0;
    });
  }

  return Promise.resolve({ rows: questions, count: questions.length });
}

function findOne(options) {
  const dataPath = path.join(__dirname, '../../database/questions.json');
  const questions = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  if (options.where) {
    const q = questions.find(q => Object.keys(options.where).every(k => q[k] === options.where[k]));
    return Promise.resolve(q || null);
  }
  return Promise.resolve(questions[0] || null);
}

module.exports = { findAll, findOne };