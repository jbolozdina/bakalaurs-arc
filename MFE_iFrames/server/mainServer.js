const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const argon2 = require("argon2");

const DB_REFRESH = true;

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

const refreshDB = async () => {
  await (require("./helpers/MigrationHelper")).createTables();

  const SeederHelper = require("./helpers/SeederHelper");
  await SeederHelper.clearAllButUserData();
  await SeederHelper.insertSampleData();
};

if (DB_REFRESH) refreshDB();

console.warn(__dirname);

// app.use(express.static(path.join(__dirname, "public")));


app.use(cookieParser());
app.use(cors());

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
  res.redirect('/iframetest');
});

app.get("/iframetest", async (req, res) => {
  const isSessionValid = await validateSession(req, res, () => { setTimeout(() => res.redirect('/no-login'), 1000); console.error("illegal/null sessionId") });
  if (!isSessionValid) {
    return;
  }

  // unsupported
  // await MySqlHelper.connection.promise().query(`UPDATE session_cookies SET last_access = ${Date.now()} WHERE hash = ${sessionId}`);

  res.sendFile(path.join("C:\\Users\\jbolo\\WebstormProjects\\bakalaurs-arc\\MFE_iFrames\\public\\iframe-test.html"));
});

app.get("/iframe-test.js", async (req, res) => {
  // await MySqlHelper.connection.promise().query(`UPDATE session_cookies SET last_access = ${Date.now()} WHERE hash = ${sessionId}`);

  res.sendFile(path.join("C:\\Users\\jbolo\\WebstormProjects\\bakalaurs-arc\\MFE_iFrames\\public\\iframe-test.js"));
});



app.get("/no-login", (req, res) => {
  res.sendFile(path.join("C:\\Users\\jbolo\\WebstormProjects\\bakalaurs-arc\\MFE_iFrames\\public\\invalid-user.html"));
});

app.get("/invalid-user.js", (req, res) => {
  res.sendFile(path.join("C:\\Users\\jbolo\\WebstormProjects\\bakalaurs-arc\\MFE_iFrames\\public\\invalid-user.js"));
});

app.get("/style.css", (req, res) => {
  res.sendFile(path.join("C:\\Users\\jbolo\\WebstormProjects\\bakalaurs-arc\\MFE_iFrames\\public\\style.css"));
});

app.use(express.json());


const MySqlHelper = require("./helpers/MySqlHelper");
const SeederHelper = require("../../MFE_ModuleFederation/host/helpers/SeederHelper");
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
