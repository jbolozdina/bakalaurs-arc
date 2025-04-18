const express = require("express");
const app = express();
const path = require("path");
const axios = require("axios");
const cookieParser = require('cookie-parser');

/** -- CONNECT CONFIG DETAILS -- */
const PORT = 3001;
const APP_URL = `http://localhost:${PORT}`;
/** -- CONNECT CONFIG DETAILS -- */

app.use(cookieParser());

app.get("/products", async (req, res) => {
  let isSessionValid = false;
  try {
    const requestData = (await axios.get('http://localhost:3000/api/is-session-valid', {
          headers: {
            Cookie: req.headers.cookie || "",
          }
        })
        );
    isSessionValid = requestData.data.isValid;
  } catch (e) {
    console.error(e);
  }

  if (!isSessionValid) {

    return res.redirect('http://localhost:3000/no-login');
  }

  res.sendFile("C:\\Users\\jbolo\\WebstormProjects\\bakalaurs-arc\\MFE_MultiSPA\\public\\products.html");
});

app.listen(PORT, () => {
  console.log(`[MFE] Products running at ${APP_URL}`);
});
