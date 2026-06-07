const fs = require('fs');
const path = require('path');

// 推荐方案模型（JSON存储）
// 数据文件：database/recommendations.json

function findOne(options) {
  const dataPath = path.join(__dirname, '../../database/recommendations.json');
  const recs = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  if (options.where && options.where.constitutionType) {
    const rec = recs.find(r => r.constitutionType === options.where.constitutionType);
    return Promise.resolve(rec || null);
  }
  return Promise.resolve(null);
}

function findAll() {
  const dataPath = path.join(__dirname, '../../database/recommendations.json');
  const recs = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  return Promise.resolve(recs);
}

async function update(data, options) {
  const dataPath = path.join(__dirname, '../../database/recommendations.json');
  const recs = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const idx = recs.findIndex(r => r.constitutionType === options.where.constitutionType);
  if (idx === -1) return Promise.resolve([0]);
  recs[idx] = { ...recs[idx], ...data };
  fs.writeFileSync(dataPath, JSON.stringify(recs, null, 2));
  return Promise.resolve([1]);
}

module.exports = { findOne, findAll, update };