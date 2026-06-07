const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'database', 'data.json');

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
  console.log('✅ Database initialized:', DB_PATH);
} else {
  console.log('✅ Database already exists:', DB_PATH);
}
