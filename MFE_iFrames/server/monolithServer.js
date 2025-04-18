const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const argon2 = require("argon2");

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
  await (require("./helpers/MigrationHelper")).createTables();
  await (require("./helpers/SeederHelper")).insertSampleData();
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
  res.sendFile(path.join("C:\\Users\\jbolo\\WebstormProjects\\bakalaurs-arc\\public\\multispa-router.html"));
});

app.get("/iframetest", async (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (!sessionId) {
    res.redirect("/no-login");

    return;
  }

  let dbSessionDataRows = await MySqlHelper.connection
            .promise()
            .query(`SELECT expires_at FROM session_cookies WHERE hash = ${sessionId}`);

  if (
      !dbSessionDataRows?.length
      || Date.now() > parseInt((new Date(dbSessionDataRows[0].expires_at).getTime() / 1000).toFixed(0))
  ) {
    res.redirect("/no-login");

    return;
  }

  // unsupported
  // await MySqlHelper.connection.promise().query(`UPDATE session_cookies SET last_access = ${Date.now()} WHERE hash = ${sessionId}`);

  res.sendFile(path.join("C:\\Users\\jbolo\\WebstormProjects\\bakalaurs-arc\\public\\iframe-test.html"));
});

app.get("/no-login", (req, res) => {
  res.sendFile(path.join("C:\\Users\\jbolo\\WebstormProjects\\bakalaurs-arc\\public\\invalid-user.html"));
});

app.use(express.static("public"));
app.use(express.json());


const MySqlHelper = require("./helpers/MySqlHelper");
MySqlHelper.openConnection();

app.post("/api/login", async (req, res) => {
  console.log(req.body);
  const [userIdRow] = await MySqlHelper.connection
      .promise()
      .query(`SELECT id 
              FROM users 
              WHERE username = '${req.body.username}' 
                AND password = '${req.body.password}'
      `);
  console.log(userIdRow);
  if (!userIdRow.length) {
    res.status(500).json({ message: 'Incorrect data!' });
    return;
  }

  const sessHash = await argon2.hash("session");
  await MySqlHelper.connection.promise().query(`
                INSERT INTO session_cookies (hash, user_id)
                VALUES ('${sessHash}', ${userIdRow[0].id})
			`);
  res.cookie('sessionId', sessHash);

  res.json({ message: 'authenticated & cookie baked in!', data: { userId: userIdRow[0].id } });
})

app.get("/api/gimme-auth-cookie", async (req, res) => {
  res.cookie('sessionId', 123);
  // await MySqlHelper.connection.promise().query(`
  //   INSERT INTO session_cookies (hash, user_id)
  //   VALUES ('2024-11-01', 240, 15, 180)
  // `);

  res.json({ success: 1 });
});

app.delete("/api/revoke-me-auth-cookie", async (req, res) => {
  res.clearCookie('sessionId');
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
