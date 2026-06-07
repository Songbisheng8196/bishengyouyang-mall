/**
 * 数据库层 - 基于 JSON 文件存储
 * 毕生优养商城后端 API
 * Phase1 使用 JSON 文件存储数据，无需安装数据库
 */

const fs = require('fs');
const path = require('path');

// 数据库文件路径
const DB_PATH = path.join(__dirname, 'data.json');

// 初始化数据库文件
function initDatabase() {
  if (!fs.existsSync(DB_PATH)) {
    const initialData = {
      users: [],
      members: [],
      points_records: [],
      constitution_records: [],
      questions: [],
      categories: [],
      products: [],
      cart_items: [],
      orders: [],
      order_items: [],
      coupons: [],
      checkin_records: [],
      courses: [],
      articles: [],
      stores: [],
      salons: [],
      salon_reservations: [],
      group_buyings: [],
      announcements: [],
      addresses: [],
      _autoIncrement: {
        users: 1, members: 1, points_records: 1, constitution_records: 1,
        questions: 1, categories: 6, products: 1, cart_items: 1,
        orders: 1, order_items: 1, coupons: 1, checkin_records: 1,
        courses: 1, articles: 1, stores: 4, salons: 1,
        salon_reservations: 1, group_buyings: 1, announcements: 1, addresses: 1
      }
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf8');
  }
  return readDB();
}

function readDB() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

function saveDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    return false;
  }
}

function getNextId(tableName) {
  const db = readDB();
  const id = db._autoIncrement[tableName] || 1;
  db._autoIncrement[tableName] = id + 1;
  saveDB(db);
  return id;
}

// 工厂函数创建模型
function createModel(tableName) {
  const model = {
    tableName,
    
    findAll(options = {}) {
      const db = readDB();
      let items = db[tableName] || [];
      
      if (options.where) {
        items = items.filter(item => {
          for (const key in options.where) {
            const val = options.where[key];
            if (typeof val === 'object' && val !== null) {
              for (const op in val) {
                if (op === '$gte' && item[key] < val[op]) return false;
                if (op === '$lte' && item[key] > val[op]) return false;
                if (op === '$ne' && item[key] === val[op]) return false;
                if (op === '$in' && !val[op].includes(item[key])) return false;
              }
            } else if (item[key] !== val) {
              return false;
            }
          }
          return true;
        });
      }
      
      if (options.order && options.order[0]) {
        const [field, direction = 'ASC'] = options.order;
        items.sort((a, b) => {
          if (direction.toUpperCase() === 'DESC') {
            return (b[field] || 0) > (a[field] || 0) ? 1 : -1;
          }
          return (a[field] || 0) > (b[field] || 0) ? 1 : -1;
        });
      }
      
      const total = items.length;
      if (options.limit) {
        items = items.slice(options.offset || 0, (options.offset || 0) + options.limit);
      }
      
      return Promise.resolve({ rows: items, count: total });
    },
    
    findOne(options = {}) {
      return this.findAll(options).then(result => Promise.resolve(result.rows[0] || null));
    },
    
    findByPk(id) {
      const db = readDB();
      const item = (db[tableName] || []).find(item => item.id === parseInt(id));
      return Promise.resolve(item || null);
    },
    
    create(data) {
      const db = readDB();
      const id = getNextId(tableName);
      const record = { id, ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
      db[tableName].push(record);
      saveDB(db);
      return Promise.resolve(record);
    },
    
    update(data, options = {}) {
      const db = readDB();
      let updated = 0;
      for (const item of db[tableName]) {
        let match = true;
        if (options.where) {
          for (const key in options.where) {
            if (item[key] !== options.where[key]) { match = false; break; }
          }
        }
        if (match) { Object.assign(item, data, { updated_at: new Date().toISOString() }); updated++; }
      }
      saveDB(db);
      return Promise.resolve([updated]);
    },
    
    destroy(options = {}) {
      const db = readDB();
      const initialLength = db[tableName].length;
      if (options.where) {
        db[tableName] = db[tableName].filter(item => {
          for (const key in options.where) {
            if (item[key] !== options.where[key]) return true;
          }
          return false;
        });
      }
      saveDB(db);
      return Promise.resolve(initialLength - db[tableName].length);
    },
    
    increment(field, options = {}) {
      const db = readDB();
      for (const item of db[tableName]) {
        if (options.where) {
          let match = true;
          for (const key in options.where) {
            if (item[key] !== options.where[key]) { match = false; break; }
          }
          if (match) item[field] = (parseFloat(item[field]) || 0) + (options.by || 1);
        }
      }
      saveDB(db);
      return Promise.resolve();
    },
    
    decrement(field, options = {}) {
      const db = readDB();
      for (const item of db[tableName]) {
        if (options.where) {
          let match = true;
          for (const key in options.where) {
            if (item[key] !== options.where[key]) { match = false; break; }
          }
          if (match) item[field] = Math.max(0, (parseFloat(item[field]) || 0) - (options.by || 1));
        }
      }
      saveDB(db);
      return Promise.resolve();
    },
    
    sum(field, options = {}) {
      return this.findAll(options).then(result => 
        Promise.resolve(result.rows.reduce((sum, item) => sum + (parseFloat(item[field]) || 0), 0))
      );
    }
  };
  
  return model;
}

// 创建模型实例
const User = createModel('users');
const Member = createModel('members');
const PointsRecord = createModel('points_records');
const ConstitutionRecord = createModel('constitution_records');
const Question = createModel('questions');
const Category = createModel('categories');
const Product = createModel('products');
const CartItem = createModel('cart_items');
const Order = createModel('orders');
const OrderItem = createModel('order_items');
const Coupon = createModel('coupons');
const CheckinRecord = createModel('checkin_records');
const Course = createModel('courses');
const Article = createModel('articles');
const Store = createModel('stores');
const Salon = createModel('salons');
const SalonReservation = createModel('salon_reservations');
const GroupBuying = createModel('group_buyings');
const Announcement = createModel('announcements');
const Address = createModel('addresses');

// 为 Product 添加 findAndCountAll 别名（Sequelize 兼容）
Product.findAndCountAll = Product.findAll;
Order.findAndCountAll = Order.findAll;
CartItem.findAndCountAll = CartItem.findAll;
OrderItem.findAndCountAll = OrderItem.findAll;
CheckinRecord.findAndCountAll = CheckinRecord.findAll;
Salon.findAndCountAll = Salon.findAll;
SalonReservation.findAndCountAll = SalonReservation.findAll;

// Category 特殊处理 - 直接返回数组
Category.findAll = function(options = {}) {
  const db = readDB();
  let items = db.categories || [];
  if (options.where && options.where.status !== undefined) {
    items = items.filter(item => item.status === options.where.status);
  }
  if (options.order) {
    const [field, direction] = options.order;
    items.sort((a, b) => direction === 'ASC' ? a[field] - b[field] : b[field] - a[field]);
  }
  return Promise.resolve(items);
};

// User 特殊方法
User.findOne = function(options = {}) {
  const db = readDB();
  const items = db.users || [];
  for (const item of items) {
    let match = true;
    if (options.where) {
      for (const key in options.where) {
        if (item[key] !== options.where[key]) { match = false; break; }
      }
    }
    if (match) return Promise.resolve(item);
  }
  return Promise.resolve(null);
};

User.create = function(data) {
  const db = readDB();
  const id = getNextId('users');
  const record = { id, ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  db.users.push(record);
  saveDB(db);
  return Promise.resolve(record);
};

User.save = function() { return Promise.resolve(); };

User.increment = function(field, options = {}) {
  const db = readDB();
  for (const item of db.users) {
    if (options.where && item.id === options.where.id) {
      item[field] = (parseFloat(item[field]) || 0) + (options.by || 1);
    }
  }
  saveDB(db);
  return Promise.resolve();
};

// Member 特殊方法
Member.findOne = function(options = {}) {
  const db = readDB();
  const items = db.members || [];
  for (const item of items) {
    if (options.where && item.user_id === options.where.user_id) {
      return Promise.resolve(item);
    }
  }
  return Promise.resolve(null);
};

Member.create = function(data) {
  const db = readDB();
  const id = getNextId('members');
  const record = { id, ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  db.members.push(record);
  saveDB(db);
  return Promise.resolve(record);
};

// PointsRecord 特殊方法
PointsRecord.create = function(data) {
  const db = readDB();
  const id = getNextId('points_records');
  const record = { id, ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  db.points_records.push(record);
  saveDB(db);
  return Promise.resolve(record);
};

// 初始化数据库
initDatabase();

// 导出
module.exports = {
  sequelize: { authenticate: () => Promise.resolve(), sync: () => Promise.resolve() },
  User, Address, Member, PointsRecord, ConstitutionRecord, Question,
  Category, Product, CartItem, Order, OrderItem, Coupon,
  CheckinRecord, Course, Article, Store, Salon, SalonReservation,
  GroupBuying, Announcement, initDatabase
};