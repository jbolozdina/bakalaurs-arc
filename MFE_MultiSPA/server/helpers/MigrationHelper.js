const MySqlHelper = require('./MySqlHelper');

const createTables = async () => {
  try {
      await MySqlHelper.openConnection();
      const connection = MySqlHelper.connection;

    await connection.promise().query(`
          CREATE TABLE IF NOT EXISTS users
          (
              id         INT AUTO_INCREMENT PRIMARY KEY,
              username      VARCHAR(100)   NOT NULL,
              password      VARCHAR(64) NOT NULL,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
	  `);

    await connection.promise().query(`
          CREATE TABLE IF NOT EXISTS user_permissions
          (
              id         INT AUTO_INCREMENT PRIMARY KEY,
              user_id    INT   NOT NULL,
              permission_name      VARCHAR(100) NOT NULL,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (user_id) REFERENCES users(id)
          )
      `);

    await connection.promise().query(`
          CREATE TABLE IF NOT EXISTS session_cookies
          (
              hash         VARCHAR(100) PRIMARY KEY,
              user_id      INT   NOT NULL,
              last_access  DATETIME DEFAULT CURRENT_TIMESTAMP,
              expires_at   DATETIME DEFAULT (CURRENT_TIMESTAMP + INTERVAL 1 WEEK),
              FOREIGN KEY (user_id) REFERENCES users(id)
          )
	  `);

    await connection.promise().query(`
            CREATE TABLE IF NOT EXISTS products
            (
                id         INT AUTO_INCREMENT PRIMARY KEY,
                name       VARCHAR(100)   NOT NULL,
                price      DECIMAL(10, 2) NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
		`);

    await connection.promise().query(`
            CREATE TABLE IF NOT EXISTS orders
            (
                id         INT AUTO_INCREMENT PRIMARY KEY,
                customer   VARCHAR(100)                                          NOT NULL,
                status     ENUM ('Processing','Shipped','Delivered','Cancelled') NOT NULL,
                order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
		`);

    // Customer insights: daily report data to support graphing customer metrics.

    await connection.promise().query(`
            CREATE TABLE IF NOT EXISTS customer_insights
            (
                id              INT AUTO_INCREMENT PRIMARY KEY,
                report_date     DATE NOT NULL,
                total_customers INT  NOT NULL,
                new_customers   INT  NOT NULL,
                monthly_active  INT  NOT NULL
            )
		`);

    // Promo codes table for the marketing panel.

    await connection.promise().query(`
            CREATE TABLE IF NOT EXISTS promo_codes
            (
                id                  INT AUTO_INCREMENT PRIMARY KEY,
                code                VARCHAR(50) NOT NULL,
                description         VARCHAR(255),
                discount_percentage DECIMAL(5, 2),
                created_at          DATETIME DEFAULT CURRENT_TIMESTAMP
            )
		`);

    // Banners table for the marketing panel.

    await connection.promise().query(`
            CREATE TABLE IF NOT EXISTS banners
            (
                id          INT AUTO_INCREMENT PRIMARY KEY,
                title       VARCHAR(100) NOT NULL,
                message     TEXT,
                active_from DATETIME,
                active_to   DATETIME
            )
		`);

    console.log("Tables created successfully.");
    await MySqlHelper.closeConnection();
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};

module.exports = { createTables };
