const MySqlHelper = require("./MySqlHelper");

const clearAllButUserData = async () => {
  try {
    await MySqlHelper.openConnection();
    const connection = MySqlHelper.connection;

    await connection.promise().query(`TRUNCATE TABLE products`);
    await connection.promise().query(`TRUNCATE TABLE orders`);
    await connection.promise().query(`TRUNCATE TABLE customer_insights`);
    await connection.promise().query(`TRUNCATE TABLE promo_codes`);
    await connection.promise().query(`TRUNCATE TABLE banners`);

  } catch (error) {
    console.error("Truncate failed:", error);
  }
}

const insertSampleData = async () => {
  try {
    await MySqlHelper.openConnection();
    const connection = MySqlHelper.connection;
    console.log(MySqlHelper.connected);

    const [productRows] = await connection
      .promise()
      .query(`SELECT COUNT(*) as count FROM products`);
    if (productRows[0].count === 0) {
      await connection.promise().query(`
                INSERT INTO products (name, price, created_at)
                VALUES ('Apple iPhone 13', 799.99, '2024-09-15 10:30:00'),
                       ('Samsung Galaxy S21', 699.99, '2024-09-20 11:00:00'),
                       ('Dell XPS 15 Laptop', 1199.99, '2024-10-05 09:45:00'),
                       ('Sony WH-1000XM4 Headphones', 349.99, '2024-10-12 14:20:00')
			`);
    }

    const [orderRows] = await connection
      .promise()
      .query(`SELECT COUNT(*) as count FROM orders`);
    if (orderRows[0].count === 0) {
      await connection.promise().query(`
                INSERT INTO orders (customer, status, order_date)
                VALUES ('John Doe', 'Shipped', '2024-11-01 12:15:00'),
                       ('Jane Smith', 'Processing', '2024-11-03 15:40:00'),
                       ('Alice Johnson', 'Delivered', '2024-11-05 10:05:00'),
                       ('Robert Brown', 'Cancelled', '2024-11-07 16:30:00'),
                       ('Emily Davis', 'Delivered', '2024-11-10 11:25:00')
			`);
    }

    const [insightRows] = await connection
      .promise()
      .query(`SELECT COUNT(*) as count FROM customer_insights`);
    if (insightRows[0].count === 0) {
      await connection.promise().query(`
                INSERT INTO customer_insights (report_date, total_customers, new_customers, monthly_active)
                VALUES ('2024-11-01', 240, 15, 180),
                       ('2024-11-02', 242, 7, 182),
                       ('2024-11-03', 247, 12, 185),
                       ('2024-11-04', 250, 10, 183),
                       ('2024-11-05', 254, 9, 180),
                       ('2024-11-06', 258, 11, 185),
                       ('2024-11-07', 263, 14, 188)
			`);
    }

    const [promoRows] = await connection
      .promise()
      .query(`SELECT COUNT(*) as count FROM promo_codes`);
    if (promoRows[0].count === 0) {
      await connection.promise().query(`
                INSERT INTO promo_codes (code, description, discount_percentage, created_at)
                VALUES ('SUMMER20', '20% off on summer collection purchases', 20, '2024-06-01 08:00:00'),
                       ('WELCOME15', '15% discount for new customers on their first order', 15, '2024-01-10 09:00:00'),
                       ('FREESHIP', 'Enjoy free shipping on orders over $50', 0, '2024-03-15 10:00:00')
			`);
    }

    const [bannerRows] = await connection
      .promise()
      .query(`SELECT COUNT(*) as count FROM banners`);
    if (bannerRows[0].count === 0) {
      await connection.promise().query(`
                INSERT INTO banners (title, message, active_from, active_to)
                VALUES ('Big Summer Sale', 'Enjoy up to 50% off on select items during our summer sale!',
                        '2024-06-01 00:00:00', '2024-06-30 23:59:59'),
                       ('Holiday Deals', 'Exclusive holiday deals available now – shop and save!',
                        '2024-12-01 00:00:00', '2024-12-31 23:59:59')
			`);
    }

    console.log("Sample data inserted successfully.");
    await MySqlHelper.closeConnection();
  } catch (error) {
    console.error("Error inserting sample data:", error);
  }
};

const insertRandomData = async () => {
  try {
    await MySqlHelper.openConnection();
    const connection = MySqlHelper.connection;
    console.log(MySqlHelper.connected);

    const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const randFloat = (min, max, decimals = 2) => (
      Math.random() * (max - min) + min
    ).toFixed(decimals);
    const randDate = (start, end) => {
      const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
      return d.toISOString().slice(0, 19).replace('T', ' ');
    };

    const productNames = [
      'Apple iPhone 12', 'Samsung Galaxy S20', 'Dell XPS 13 Laptop', 'AirPods Max',
      'Sony WH‑1000XM4', 'Google Pixel 8', 'HP Spectre x360', 'Bose QC45',
      'Nintendo Switch OLED', 'Canon EOS R8', 'Lenovo ThinkPad X1', 'Asus ROG Ally'
    ];
    const productRows = [];
    for (let i = 0; i < 10; i++) {
      productRows.push(`('${rand(productNames)}', ${randFloat(100, 2000)}, '${randDate(new Date('2024-01-01'), new Date('2024-12-31'))}')`);
    }

    const productsSQL = `
          INSERT INTO products (name, price, created_at)
          VALUES ${productRows.join(',\n')}
  `;

    const customerNames = [
      'Jānis Bērziņš', 'Dwayne Johnson', 'Robert Brown', 'Kristaps Bērziņš',
      'Emily Davis', 'Alice Smith', 'Bob Johnson', 'Carlos García', 'Mei Ling'
    ];
    const statuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
    const orderRows = [];
    for (let i = 0; i < 15; i++) {
      orderRows.push(`('${rand(customerNames)}', '${rand(statuses)}', '${randDate(new Date('2024-11-01'), new Date('2024-11-30'))}')`);
    }

    const ordersSQL = `
          INSERT INTO orders (customer, status, order_date)
          VALUES ${orderRows.join(',\n')}
  `;

    const reportRow = `('${randDate(new Date('2024-11-01'), new Date('2024-11-30')).slice(0,10)}', ${randInt(200,500)}, ${randInt(5,20)}, ${randInt(100,400)})`;
    const insightsSQL = `
          INSERT INTO customer_insights (report_date, total_customers, new_customers, monthly_active)
          VALUES ${reportRow}
  `;

    const randomCode = () => Math.random().toString().substring(2,8).toUpperCase();
    const promoDescriptions = [
      'Save big on your next order!',
      'Limited‑time discount just for you',
      'Holiday special – grab the deal now',
    ];
    const promoRows = [];
    for (let i = 0; i < 3; i++) {
      promoRows.push(`('${randomCode()}', '${rand(promoDescriptions)}', ${randInt(5,50)}, '${randDate(new Date('2024-01-01'), new Date('2024-12-31'))}')`);
    }
    const promosSQL = `
          INSERT INTO promo_codes (code, description, discount_percentage, created_at)
          VALUES ${promoRows.join(',\n')}
  `;

    const bannerTitles = ['Mega Sale', 'Flash Deals', 'Weekend Bonanza', 'Clearance Event'];
    const bannerMessages = [
      'Up to 70% off site‑wide – hurry!',
      'Buy 1 get 1 free on select items',
      'Exclusive online‑only discounts',
      'New arrivals just dropped – shop now',
    ];
    const bannerRows = [];
    for (let i = 0; i < 2; i++) {
      const from = randDate(new Date('2024-05-01'), new Date('2024-11-01'));
      const to = randDate(new Date(from), new Date('2024-12-31'));
      bannerRows.push(`('${rand(bannerTitles)}', '${rand(bannerMessages)}', '${from}', '${to}')`);
    }
    const bannersSQL = `
          INSERT INTO banners (title, message, active_from, active_to)
          VALUES ${bannerRows.join(',\n')}
  `;

    try {
      await connection.promise().query(productsSQL);
      await connection.promise().query(ordersSQL);
      await connection.promise().query(insightsSQL);
      await connection.promise().query(promosSQL);
      await connection.promise().query(bannersSQL);
      console.log('Random seed done');
    } catch (err) {
      console.error('Seeding error:', err);
    }

    await MySqlHelper.closeConnection();
  } catch (error) {
    console.error("Error inserting sample data:", error);
  }
};

module.exports = { clearAllButUserData, insertSampleData, insertRandomData };
