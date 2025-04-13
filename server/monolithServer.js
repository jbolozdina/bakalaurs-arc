const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const DB_SETUP_REQUIRED = true;

/** -- CONNECT CONFIG DETAILS -- */
const PORT = 3000;
const APP_URL = `http://localhost:${PORT}`;
/** -- CONNECT CONFIG DETAILS -- */

// DB_CONNECTION=mysql
// DB_HOST=127.0.0.1
// DB_PORT=3306
// DB_DATABASE=laravel
// DB_USERNAME=root
// DB_PASSWORD=1234

const initDB = async () => {
  await (require("./MigrationHelper")).createTables();
  await (require("./SeederHelper")).insertSampleData();
};

if (DB_SETUP_REQUIRED) initDB();

console.warn(__dirname);

// app.use(express.static(path.join(__dirname, "public")));


app.use(cookieParser());
app.use(cors());

app.get("/", (req, res) => {
  console.warn(req.cookies);
  if (!req.cookies.sessionId) {
    res.redirect("/no-login");

    return;
  }
  res.sendFile(path.join("C:\\Users\\jbolo\\WebstormProjects\\bakalaurs-arc\\public\\index.html"));
});

app.get("/iframetest", (req, res) => {
  res.sendFile(path.join("C:\\Users\\jbolo\\WebstormProjects\\bakalaurs-arc\\public\\iFrameTest.html"));
});

app.get("/no-login", (req, res) => {
  res.sendFile(path.join("C:\\Users\\jbolo\\WebstormProjects\\bakalaurs-arc\\public\\invalid-user.html"));
});

app.use(express.static("public"));

// API Endpoints

// 1. Products endpoint

const MySqlHelper = require("./MySqlHelper");
MySqlHelper.openConnection();

app.get("/api/gimme-auth-cookie", async (req, res) => {
  res.cookie('sessionId', 123)
  res.json({ success: 1 });
});

app.delete("/api/revoke-me-auth-cookie", async (req, res) => {
  res.clearCookie('sessionId')
  res.json({ success: 1 });
});

app.get("/api/dashboard/all-data", async (req, res) => {
  try {
    let [rows] = await MySqlHelper.connection.promise().query("SELECT * FROM products");
    const products = rows;
    [rows] = await MySqlHelper.connection.promise().query("SELECT * FROM orders");
    const orders = rows;
    [rows] = await MySqlHelper.connection
        .promise()
        .query("SELECT * FROM customer_insights");
    const insights = rows[0];
    [rows] = await MySqlHelper.connection
        .promise()
        .query("SELECT * FROM promo_codes");
    const promoCodes = rows;
    [rows] = await MySqlHelper.connection
        .promise()
        .query("SELECT * FROM banners");
    const banners = rows;
    res.json({
      products,
      orders,
      insights,
      promoCodes,
      banners,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const [rows] = await MySqlHelper.connection.promise().query("SELECT * FROM products");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const [rows] = await MySqlHelper.connection.promise().query("SELECT * FROM orders");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Customer Insights endpoint

app.get("/api/customer-insights", async (req, res) => {
  try {
    const [rows] = await MySqlHelper.connection
      .promise()
      .query("SELECT * FROM customer_insights");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Marketing endpoint (combines promo codes and banners)

app.get("/api/marketing", async (req, res) => {
  try {
    const [promoRows] = await MySqlHelper.connection
      .promise()
      .query("SELECT * FROM promo_codes");
    const [bannerRows] = await MySqlHelper.connection
      .promise()
      .query("SELECT * FROM banners");
    res.json({ promoCodes: promoRows, banners: bannerRows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at ${APP_URL}`);
});
app.on('close', () => MySqlHelper.closeConnection());
