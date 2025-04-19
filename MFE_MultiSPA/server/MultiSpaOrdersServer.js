const express = require("express");
const app = express();
const path = require("path");
const axios = require('axios');
const fs = require('fs');

let getSessionValidity;
(async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/SessionHelper.js');
    const helperCode = response.data;

    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const tempFile = path.join(tempDir, 'SessionHelper.js');
    fs.writeFileSync(tempFile, helperCode);

    const SessionHelper = require('./temp/SessionHelper.js');
    getSessionValidity = SessionHelper.getSessionValidity;

    console.log('Successfully loaded SessionHelper.js from monolith server');
  } catch (error) {
    console.error('Failed to download SessionHelper.js:', error);
    process.exit(1);
  }
})();

/** -- CONNECT CONFIG DETAILS -- */
const PORT = 3002;
const APP_URL = `http://localhost:${PORT}`;
/** -- CONNECT CONFIG DETAILS -- */

app.get("/orders", async (req, res) => {
  const isSessionValid = await getSessionValidity(req);

  if (!isSessionValid) {
    return res.redirect('http://localhost:3000/no-login');
  }

  res.sendFile(path.join("C:\\Users\\jbolo\\WebstormProjects\\bakalaurs-arc\\MFE_MultiSPA\\public\\orders.html"));
});

app.listen(PORT, () => {
  console.log(`[MFE] Orders running at ${APP_URL}`);
});

process.on(
  'SIGINT',
  () => {
    console.log('Removing', path.join(__dirname, 'temp'));
    fs.rmSync(
      path.join(__dirname, 'temp'),
      { recursive: true, force: true },
      (err) => { console.log(err) }
    );
    process.exit(0);
  });
