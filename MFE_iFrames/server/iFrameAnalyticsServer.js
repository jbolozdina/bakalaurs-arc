const express = require("express");
const app = express();

/** -- CONNECT CONFIG DETAILS -- */
const PORT = 3003;
const APP_URL = `http://localhost:${PORT}`;
/** -- CONNECT CONFIG DETAILS -- */

app.get("/analytics", (req, res) => {
  res.sendFile("C:\\Users\\jbolo\\WebstormProjects\\bakalaurs-arc\\MFE_iFrames\\public\\analytics.html");
});

app.get("/analytics.js", (req, res) => {
  res.sendFile("C:\\Users\\jbolo\\WebstormProjects\\bakalaurs-arc\\MFE_iFrames\\public\\analytics.js");
});

app.listen(PORT, () => {
  console.log(`[MFE] Analytics running at ${APP_URL}`);
});
