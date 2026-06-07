/**
 * 门店控制器
 * 毕生优养商城后端 API
 */

const { Store, Salon, SalonReservation } = require('../../database/init');
const { success, paginate } = require('../utils/response');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');
const ErrorCodes = require('../utils/errorCodes');

/**
 * 获取门店列表
 * GET /api/stores
 */
const getStores = asyncHandler(async (req, res) => {
  const { page = 1, pageSize = 20, city = '武汉' } = req.query;

  const where = { status: 1 };
  if (city) {
    where.city = city;
  }

  const { count, rows } = await Store.findAndCountAll({
    where,
    order: [['id', 'ASC']],
    limit: parseInt(pageSize),
    offset: (parseInt(page) - 1) * parseInt(pageSize)
  });

  // Phase1 如果没有真实数据，返回占位数据
  if (rows.length === 0) {
    const placeholderStores = [
      {
        id: 1,
        name: '毕生优养·武汉光谷店',
        province: '湖北省',
        city: '武汉市',
        district: '洪山区',
        address: '光谷世界城步行街F1层',
        latitude: 30.4725,
        longitude: 114.4072,
        phone: '027-88888888',
        business_hours: '10:00-22:00',
        images: ['/images/stores/guanggu.jpg'],
        service_types: ['到店自提', '产品体验', '健康咨询'],
        distance: '1.2km'
      },
      {
        id: 2,
        name: '毕生优养·武汉武广店',
        province: '湖北省',
        city: '武汉市',
        district: '硚口区',
        address: '武商广场购物中心B1层',
        latitude: 30.5785,
        longitude: 114.2797,
        phone: '027-88888889',
        business_hours: '10:00-21:30',
        images: ['/images/stores/wuguang.jpg'],
        service_types: ['到店自提', '产品体验'],
        distance: '3.5km'
      },
      {
        id: 3,
        name: '毕生优养·武汉徐东店',
        province: '湖北省',
        city: '武汉市',
        district: '武昌区',
        address: '徐东销品茂F1层',
        latitude: 30.5912,
        longitude: 114.3456,
        phone: '027-88888890',
        business_hours: '10:00-22:00',
        images: ['/images/stores/xudong.jpg'],
        service_types: ['到店自提', '沙龙活动'],
        distance: '5.8km'
      }
    ];

    return res.json(paginate(placeholderStores, placeholderStores.length, page, pageSize));
  }

  const stores = rows.map(store => ({
    id: store.id,
    name: store.name,
    province: store.province,
    city: store.city,
    district: store.district,
    address: store.address,
    latitude: store.latitude,
    longitude: store.longitude,
    phone: store.phone,
    business_hours: store.business_hours,
    images: store.images,
    service_types: store.service_types
  }));

  res.json(paginate(stores, count, page, pageSize));
});

/**
 * 获取门店详情
 * GET /api/stores/:id
 */
const getStoreDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const store = await Store.findByPk(id);

  if (!store) {
    // Phase1 返回占位数据
    return res.json(success({
      id: parseInt(id),
      name: '毕生优养·武汉光谷店',
      province: '湖北省',
      city: '武汉市',
      district: '洪山区',
      address: '光谷世界城步行街F1层',
      latitude: 30.4725,
      longitude: 114.4072,
      phone: '027-88888888',
      business_hours: '10:00-22:00',
      images: [
        '/images/stores/guanggu-1.jpg',
        '/images/stores/guanggu-2.jpg',
        '/images/stores/guanggu-3.jpg'
      ],
      description: '毕生优养武汉光谷店是品牌的首家旗舰店，位于光谷核心商圈，提供到店自提、产品体验、健康咨询等服务。',
      service_types: ['到店自提', '产品体验', '健康咨询', '沙龙活动'],
      features: [
        '✓ 正品保障',
        '✓ 专业顾问',
        '✓ 免费试吃',
        '✓ 舒适环境'
      ]
    }));
  }

  res.json(success({
    id: store.id,
    name: store.name,
    province: store.province,
    city: store.city,
    district: store.district,
    address: store.address,
    latitude: store.latitude,
    longitude: store.longitude,
    phone: store.phone,
    business_hours: store.business_hours,
    images: store.images,
    description: store.description,
    service_types: store.service_types
  }));
});

module.exports = {
  getStores,
  getStoreDetail
};