/**
 * 控制器统一导出
 * 毕生优养商城后端 API
 */

const authController = require('./authController');
const categoryController = require('./categoryController');
const productController = require('./productController');
const cartController = require('./cartController');
const orderController = require('./orderController');
const memberController = require('./memberController');
const couponController = require('./couponController');
const constitutionController = require('./constitutionController');
const checkinController = require('./checkinController');
const courseController = require('./courseController');
const articleController = require('./articleController');
const storeController = require('./storeController');
const salonController = require('./salonController');

module.exports = {
  authController,
  categoryController,
  productController,
  cartController,
  orderController,
  memberController,
  couponController,
  constitutionController,
  checkinController,
  courseController,
  articleController,
  storeController,
  salonController
};