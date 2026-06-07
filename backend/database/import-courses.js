/**
 * 课程数据导入脚本
 * 毕生优养商城 Phase2
 * 
 * 将 courses.json 中的课程数据导入到 data.json
 * 运行方式: node database/import-courses.js
 */

const fs = require('fs');
const path = require('path');

// 文件路径
const DB_PATH = path.join(__dirname, 'data.json');
const COURSES_PATH = path.join(__dirname, 'courses.json');

function importCourses() {
  try {
    // 读取课程数据
    const coursesData = JSON.parse(fs.readFileSync(COURSES_PATH, 'utf8'));
    const courses = coursesData.courses;

    // 读取数据库
    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

    // 检查是否已有课程数据
    if (db.courses.length > 0) {
      console.log(`数据库中已有 ${db.courses.length} 条课程数据`);
      console.log('如需重新导入，请先清空数据库中的 courses 数组');
      
      // 追加新课程（避免ID冲突）
      const maxId = Math.max(...db.courses.map(c => c.id), 0);
      courses.forEach((course, index) => {
        if (!db.courses.find(c => c.id === course.id)) {
          course.id = maxId + index + 1;
          db.courses.push(course);
        }
      });
    } else {
      // 首次导入
      db.courses = courses;
    }

    // 更新自增ID
    const maxId = Math.max(...db.courses.map(c => c.id), 0);
    db._autoIncrement.courses = maxId + 1;

    // 保存数据库
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');

    console.log(`\n✅ 课程数据导入成功！`);
    console.log(`   共 ${db.courses.length} 门课程`);
    console.log(`   免费课程: ${db.courses.filter(c => c.categoryType === '免费').length} 门`);
    console.log(`   会员课程: ${db.courses.filter(c => c.categoryType === '会员').length} 门`);
    console.log(`   配套课程: ${db.courses.filter(c => c.categoryType === '配套').length} 门`);
    console.log(`\n   数据已保存到: ${DB_PATH}`);

  } catch (error) {
    console.error('❌ 导入失败:', error.message);
    process.exit(1);
  }
}

// 运行导入
importCourses();