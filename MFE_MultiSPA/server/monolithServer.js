const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
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

const cors = require('cors');

// Only allow these origins to interact with cookies
const allowedOrigins = [
    APP_URL,
  'http://localhost:3001', // products
  'http://localhost:3002', // orders
  'http://localhost:3003', // analytics
  'http://localhost:3004', // marketing
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(cookieParser());



app.get("/header.js", (req, res) => {
  res.sendFile(path.join("C:\\Users\\jbolo\\WebstormProjects\\bakalaurs-arc\\MFE_MultiSPA\\public\\header.js"));
});

app.get("/style.css", (req, res) => {
  res.sendFile(path.join("C:\\Users\\jbolo\\WebstormProjects\\bakalaurs-arc\\MFE_MultiSPA\\public\\style.css"));
});

// TODO -----------------------------------------------------
// TODO -----------------------------------------------------
// Implement common header with logged in user, back to router button

async function validateSession(req, res, cb) {
  const sessionId = req.cookies.sessionId;
  console.log('validating session', sessionId);
  if (!sessionId) {
    cb();

    return false;
  }

  const dbSessionDataRows = await MySqlHelper.connection
      .promise()
      .query(`SELECT expires_at FROM session_cookies WHERE hash = "${sessionId}"`);

  console.log(Date.now(), parseInt((new Date(dbSessionDataRows[0][0].expires_at).getTime()).toFixed(0)));

  if (
      dbSessionDataRows?.length
      && Date.now() < parseInt((new Date(dbSessionDataRows[0][0].expires_at).getTime()).toFixed(0))
  ) {
    return true;
  }

  cb();

  return false;
}

app.get("/", (req, res) => {
  res.redirect('/multispa-router');
});

app.get("/multispa-router", async (req, res) => {
  const isSessionValid = await validateSession(req, res, () => { setTimeout(() => res.redirect('/no-login'), 1000); console.error("illegal/null sessionId") });
  if (!isSessionValid) {
    return;
  }

  // unsupported
  // await MySqlHelper.connection.promise().query(`UPDATE session_cookies SET last_access = ${Date.now()} WHERE hash = ${sessionId}`);

  res.sendFile(path.join("C:\\Users\\jbolo\\WebstormProjects\\bakalaurs-arc\\MFE_MultiSPA\\public\\multispa-router.html"));
});

app.get('/api/is-session-valid', async (req, res) => {
  console.warn(req.cookies);
  res.json({ isValid: await validateSession(req, res, () => {})});
});

app.get("/no-login", (req, res) => {
  res.sendFile(path.join("C:\\Users\\jbolo\\WebstormProjects\\bakalaurs-arc\\MFE_MultiSPA\\public\\invalid-user.html"));
});

app.use(express.static("MFE_MultiSPA/public"));
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
  res.cookie('sessionId', sessHash,
      {
        sameSite: 'lax'   // ← allow cross-origin access
  }
  );

  res.json({ message: 'authenticated & cookie baked in!', data: { userId: userIdRow[0].id } });
})

app.get("/api/revoke-me-auth-cookie", async (req, res) => {
  console.log('clearing cookie', req.cookies);
  res.clearCookie('sessionId');
  res.json({ success: 1 });
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
