const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const MySqlHelper = require("./helpers/MySqlHelper");

/** -- CONNECT CONFIG DETAILS -- */
const PORT = 3000;
const APP_URL = `http://localhost:${PORT}`;
/** -- CONNECT CONFIG DETAILS -- */

const webpackConfig = require('./webpack.config.js');
const compiler = webpack(webpackConfig);
const argon2 = require("argon2");
const { join } = require("node:path");

async function validateSession(req, cb) {
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

async function validateSessionMiddleware(req, res, next) {
  if (req.path === '/login') {
    next();
    return;
  }

  const isSessionValid = await validateSession(req, () => { console.error("illegal/null sessionId") });
  if (!isSessionValid) {
    return res.redirect('/login');
  }

  next();
  console.log('calling webpack middleware');
}

const DB_REFRESH = true;
const SeederHelper = require("./helpers/SeederHelper");

const initDB = async () => {
  await (require("./Helpers/MigrationHelper")).createTables();
  await SeederHelper.clearAllButUserData();
  await SeederHelper.insertSampleData();
};

if (DB_REFRESH) {
  initDB().then(() => console.log('DB refreshed'));
}

app.use(cookieParser());
app.use(cors());
app.use(express.json());

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
      sameSite: 'lax'
    }
  );

  res.json({ message: 'authenticated & cookie baked in!', data: { userId: userIdRow[0].id } });
});


app.get('/login', (req, res) => {
  res.sendFile("C:\\Users\\jbolo\\WebstormProjects\\bakalaurs-arc\\MFE_ModuleFederation\\host\\src\\login-vueless.html");
});

app.get('/login-vueless.js', (req, res) => {
  res.sendFile("C:\\Users\\jbolo\\WebstormProjects\\bakalaurs-arc\\MFE_ModuleFederation\\host\\src\\login-vueless.js");
});

app.get('/style.css', (req, res) => {
  res.sendFile("C:\\Users\\jbolo\\WebstormProjects\\bakalaurs-arc\\MFE_ModuleFederation\\host\\src\\style.css");
});

app.use(validateSessionMiddleware);


app.use(webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: 'minimal',
}));


app.get(['/', '/index.html'], (req, res, next) => {
  const filename = join(compiler.outputPath, 'index.html');
  compiler.outputFileSystem.readFile(filename, (err, result) => {
    if (err) return next(err);
    res.set('Content-Type', 'text/html');
    res.send(result);
  });
});

// unneeded since auth is handled
// app.get('/api/is-session-valid', async (req, res) => {
//   res.json({ isValid: await validateSession(req, res, () => {console.error("illegal/null sessionId")})});
// });

app.get("/api/revoke-me-auth-cookie", (req, res) => {
  res.clearCookie('sessionId');
  res.json({ success: 1 });
});

app.post("/api/fill-random-data", async (req, res) => {
  console.warn('/api/fill-random-data accessed');
  try {
    await SeederHelper.insertRandomData();
    res.json({ success: 1 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/products", async (req, res) => {
  console.warn('/api/products accessed');
  try {
    const [rows] = await MySqlHelper.connection.promise().query("SELECT * FROM products");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/orders", async (req, res) => {
  console.warn('/api/orders accessed');
  try {
    const [rows] = await MySqlHelper.connection.promise().query("SELECT * FROM orders");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/customer-insights", async (req, res) => {
  console.warn('/api/customer-insights accessed');
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
  console.warn('/api/marketing accessed');
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
