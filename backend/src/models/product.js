/**
 * 商品数据模型
 * 毕生优养商城后端 API
 * Phase2 扩展字段定义
 * 
 * 注意：本项目使用 JSON 文件存储（database/data.json），非 Sequelize ORM
 * 此文件用于定义商品数据结构，提供字段说明和类型定义
 */

const ProductModel = {
  /**
   * 商品数据结构定义
   * Phase2 新增字段：images, tags, stock, weight, originalPrice
   */
  schema: {
    id: { type: 'integer', description: '商品ID，自增主键' },
    name: { type: 'string', required: true, description: '商品名称' },
    subtitle: { type: 'string', description: '商品副标题' },
    description: { type: 'string', description: '商品详情（富文本HTML）' },
    price: { type: 'number', required: true, description: '售价（元）' },
    originalPrice: { type: 'number', description: '划线价（元），Phase2新增' },
    stock: { type: 'integer', default: 0, description: '库存数量，Phase2新增' },
    weight: { type: 'number', description: '商品重量（g），用于计算运费，Phase2新增' },
    images: { type: 'array', items: 'string', description: '商品图片列表（≤9张），Phase2新增' },
    tags: { type: 'array', items: 'string', description: '标签（体质适配/功效关键词），Phase2新增' },
    cover_image: { type: 'string', description: '封面图片URL' },
    specifications: { type: 'array', description: '规格选项，如[{name:"规格",options:["150g","300g"]}]' },
    category_id: { type: 'integer', required: true, description: '所属分类ID' },
    status: { type: 'integer', default: 1, description: '上架状态：0下架 1上架' },
    sales_count: { type: 'integer', default: 0, description: '销量' },
    created_at: { type: 'string', description: '创建时间' },
    updated_at: { type: 'string', description: '更新时间' }
  },

  /**
   * Phase2 新增字段说明
   */
  phase2Fields: {
    images: {
      type: 'JSON数组',
      maxLength: 9,
      format: '["url1","url2",...]',
      description: '商品图片列表，最多9张，建议800×800px以上'
    },
    tags: {
      type: 'JSON数组',
      format: '["体质标签","功效标签",...]',
      description: '标签列表，用于商品筛选和推荐（体质适配/功效关键词）'
    },
    stock: {
      type: 'Number',
      default: 0,
      description: '库存数量，用于判断是否有货'
    },
    weight: {
      type: 'Number',
      unit: '克(g)',
      description: '商品重量，用于计算运费'
    },
    originalPrice: {
      type: 'Number',
      description: '划线价（原价），用于展示折扣力度'
    }
  },

  /**
   * 品类映射
   * 用于 category_id 字段
   */
  categoryMap: {
    1: '花养膏系列',
    2: '花茶系列',
    3: '养生礼盒',
    4: '滋补品',
    5: '日常零食'
  },

  /**
   * 创建商品记录
   * @param {Object} data - 商品数据
   * @returns {Object} 包含完整字段的商品记录
   */
  create(data) {
    return {
      id: data.id,
      name: data.name,
      subtitle: data.subtitle || '',
      description: data.description || '',
      price: parseFloat(data.price),
      originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : null,
      stock: parseInt(data.stock) || 0,
      weight: parseFloat(data.weight) || 0,
      images: data.images || [],
      tags: data.tags || [],
      cover_image: data.cover_image || (data.images && data.images[0]) || '',
      specifications: data.specifications || [],
      category_id: data.category_id,
      status: data.status !== undefined ? data.status : 1,
      sales_count: data.sales_count || 0,
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString()
    };
  },

  /**
   * 转换商品响应格式
   * 用于 API 返回给前端
   * @param {Object} product - 商品记录
   * @returns {Object} 前端友好的商品数据
   */
  toResponse(product) {
    return {
      id: product.id,
      name: product.name,
      subtitle: product.subtitle,
      cover_image: product.cover_image,
      images: product.images || [],
      price: product.price,
      originalPrice: product.original_price || product.originalPrice,
      stock: product.stock || 0,
      weight: product.weight || 0,
      sales_count: product.sales_count || 0,
      description: product.description,
      specifications: product.specifications || [],
      tags: product.tags || [],
      category_id: product.category_id,
      status: product.status,
      compliance_notice: '⚠️ 本品为普通食品，仅作日常食补食用，非医疗诊断，身体不适请及时就医。'
    };
  }
};

module.exports = ProductModel;