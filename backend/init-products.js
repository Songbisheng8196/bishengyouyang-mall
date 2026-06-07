/**
 * 毕生优养商城商品初始化脚本
 * 运行: node init-products.js
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'database', 'data.json');

// 读取数据库
const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

// 设置初始 ID
let productId = 1;
let categoryId = 6;

// 商品分类
const categories = [
  { id: 1, name: '花养膏系列', icon: '🌸', sort: 1 },
  { id: 2, name: '代用茶系列', icon: '🍵', sort: 2 },
  { id: 3, name: '营养粉系列', icon: '🥣', sort: 3 },
  { id: 4, name: '固体饮料', icon: '🥤', sort: 4 },
  { id: 5, name: '饮用水系列', icon: '💧', sort: 5 }
];

// 商品数据（9款核心商品）- 匹配实际文件名
const products = [
  // BSYY_01 五朵金花红颜花养膏
  {
    id: productId++,
    name: '五朵金花红颜花养膏',
    subtitle: '古法匠心·食补养颜',
    cover_image: '/uploads/products/BSYY_01.jpeg',
    images: [
      '/uploads/products/BSYY_01.jpeg',
      '/uploads/products/WDHJH_detail1.jpeg'
    ],
    price: 128.00,
    original_price: 168.00,
    stock: 200,
    weight: 300,
    sales_count: 86,
    description: '精选红枣、枸杞、玫瑰花、阿胶等药食同源食材，古法熬制，匠心工艺。补气养血，美容养颜，适合面色萎黄、气血不足人群。每日1-2次，每次1-2勺，温水冲服。',
    tags: ['花养膏', '补气养血', '美容养颜', '气血双补'],
    specifications: [
      { name: '规格', options: ['300g', '500g'] }
    ],
    category_id: 1,
    status: 1,
    created_at: new Date().toISOString()
  },
  // BSYY_02 益元养元组合代用茶
  {
    id: productId++,
    name: '益元养元组合代用茶（修正版）',
    subtitle: '补气固本·日常养生',
    cover_image: '/uploads/products/BSYY_02.jpeg',
    images: [
      '/uploads/products/BSYY_02.jpeg',
      '/uploads/products/WDHJH_detail2.jpeg'
    ],
    price: 89.00,
    original_price: 118.00,
    stock: 300,
    weight: 120,
    sales_count: 124,
    description: '精选黄芪、党参、枸杞、大枣等草本食材，科学配比，温润不上火。益气固本，滋养身心，适合气虚体质、亚健康人群。茶包设计，携带方便。',
    tags: ['代用茶', '益气固本', '补气', '养生茶'],
    specifications: [
      { name: '规格', options: ['20包/盒', '40包/盒'] }
    ],
    category_id: 2,
    status: 1,
    created_at: new Date().toISOString()
  },
  // BSYY_03 固本培元组合代用茶
  {
    id: productId++,
    name: '固本培元组合代用茶（修正版）',
    subtitle: '强身健体·滋补养生',
    cover_image: '/uploads/products/BSYY_03.jpeg',
    images: [
      '/uploads/products/BSYY_03.jpeg',
      '/uploads/products/WDHJH_detail3.jpeg'
    ],
    price: 98.00,
    original_price: 128.00,
    stock: 250,
    weight: 120,
    sales_count: 98,
    description: '甄选人参（人工种植）、黄精、桑椹等珍贵食材，传承古方精髓。固本培元，滋补强身，适合体质虚弱、术后恢复人群。温和调理，长期饮用。',
    tags: ['代用茶', '固本培元', '滋补', '强身健体'],
    specifications: [
      { name: '规格', options: ['20包/盒', '40包/盒'] }
    ],
    category_id: 2,
    status: 1,
    created_at: new Date().toISOString()
  },
  // BSYY_04 五朵金花轻养代用茶
  {
    id: productId++,
    name: '五朵金花轻养代用茶',
    subtitle: '轻盈配方·日常养生',
    cover_image: '/uploads/products/BSYY_04.jpeg',
    images: [
      '/uploads/products/BSYY_04.jpeg'
    ],
    price: 68.00,
    original_price: 88.00,
    stock: 400,
    weight: 80,
    sales_count: 156,
    description: '以玫瑰花、茉莉花、桂花、菊花、金银花为主，清香淡雅，回味悠长。疏肝解郁，清热解毒，适合日常养生、轻食人群。冷热皆宜，四季常备。',
    tags: ['代用茶', '轻养', '花茶', '日常养生'],
    specifications: [
      { name: '规格', options: ['20包/盒', '30包/袋'] }
    ],
    category_id: 2,
    status: 1,
    created_at: new Date().toISOString()
  },
  // BSYY_05 羽衣甘蓝奇亚籽豆浆粉
  {
    id: productId++,
    name: '羽衣甘蓝奇亚籽豆浆粉',
    subtitle: '植物蛋白·轻体代餐',
    cover_image: '/uploads/products/BSYY_05.jpeg',
    images: [
      '/uploads/products/BSYY_05.jpeg'
    ],
    price: 88.00,
    original_price: 108.00,
    stock: 180,
    weight: 500,
    sales_count: 67,
    description: '精选进口羽衣甘蓝粉、奇亚籽、非转基因大豆，科学搭配。富含膳食纤维和植物蛋白，低卡饱腹，适合轻体代餐人群。温水冲调，口感细腻。',
    tags: ['固体饮料', '植物蛋白', '代餐', '轻体'],
    specifications: [
      { name: '规格', options: ['500g/罐'] }
    ],
    category_id: 4,
    status: 1,
    created_at: new Date().toISOString()
  },
  // BSYY_06 便携瓶装天然饮用水
  {
    id: productId++,
    name: '便携瓶装天然饮用水',
    subtitle: '天然弱碱性·方便携带',
    cover_image: '/uploads/products/BSYY_06.jpeg',
    images: [
      '/uploads/products/BSYY_06.jpeg'
    ],
    price: 9.90,
    original_price: 12.00,
    stock: 500,
    weight: 500,
    sales_count: 320,
    description: '源自武陵山脉深层天然泉水，富含多种微量元素。天然弱碱性（pH 7.3±0.5），口感清冽甘甜。便携瓶装设计，随时随地补充水分。',
    tags: ['饮用水', '天然泉水', '便携', '弱碱性'],
    specifications: [
      { name: '规格', options: ['500ml/瓶', '350ml/瓶'] }
    ],
    category_id: 5,
    status: 1,
    created_at: new Date().toISOString()
  },
  // BSYY_07 家用桶装天然饮用水
  {
    id: productId++,
    name: '家用桶装天然饮用水',
    subtitle: '家庭装·纯净天然',
    cover_image: '/uploads/products/BSYY_07.jpeg',
    images: [
      '/uploads/products/BSYY_07.jpeg'
    ],
    price: 29.90,
    original_price: 38.00,
    stock: 100,
    weight: 17000,
    sales_count: 89,
    description: '家庭装桶装饮用水，源自武陵山脉天然水源，层层净化，保留天然矿物质。适合家庭日常饮用、泡茶、烹饪。健康饮水，品质生活。',
    tags: ['饮用水', '桶装水', '家庭装', '天然'],
    specifications: [
      { name: '规格', options: ['17L/桶'] }
    ],
    category_id: 5,
    status: 1,
    created_at: new Date().toISOString()
  },
  // BSYY_08 轻养谷物营养粉
  {
    id: productId++,
    name: '轻养谷物营养粉',
    subtitle: '五谷杂粮·早餐代餐',
    cover_image: '/uploads/products/BSYY_08.jpeg',
    images: [
      '/uploads/products/BSYY_08.jpeg'
    ],
    price: 78.00,
    original_price: 98.00,
    stock: 220,
    weight: 600,
    sales_count: 112,
    description: '甄选燕麦、荞麦、黑芝麻、核桃、红豆等五谷杂粮，低温烘焙，精细研磨。富含膳食纤维和蛋白质，营养均衡。早餐代餐或加餐皆宜。',
    tags: ['营养粉', '五谷杂粮', '早餐代餐', '高纤维'],
    specifications: [
      { name: '规格', options: ['600g/罐'] }
    ],
    category_id: 3,
    status: 1,
    created_at: new Date().toISOString()
  },
  // BSYY_09 益元养元粥料包
  {
    id: productId++,
    name: '益元养元粥料包',
    subtitle: '药食同源·养生粥膳',
    cover_image: '/uploads/products/BSYY_09.jpeg',
    images: [
      '/uploads/products/BSYY_09.jpeg'
    ],
    price: 68.00,
    original_price: 88.00,
    stock: 280,
    weight: 400,
    sales_count: 145,
    description: '精选山药、茯苓、莲子、芡实、薏仁等药食同源食材，科学配比熬制。健脾养胃，益气养元。免洗免浸泡，直接煮粥，方便快捷。',
    tags: ['粥料包', '药食同源', '健脾养胃', '养生粥'],
    specifications: [
      { name: '规格', options: ['400g/袋（10包）'] }
    ],
    category_id: 3,
    status: 1,
    created_at: new Date().toISOString()
  }
];

// 更新数据库
db.categories = categories;
db.products = products;
db._autoIncrement.categories = 6;
db._autoIncrement.products = productId;

// 保存数据库
fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');

console.log('');
console.log('========================================');
console.log('  毕生优养商城商品数据初始化完成');
console.log('========================================');
console.log(`  商品分类: ${categories.length} 个`);
console.log(`  商品数量: ${products.length} 款`);
console.log(`  数据库: ${DB_PATH}`);
console.log('========================================');
console.log('');