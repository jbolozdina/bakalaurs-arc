const express = require("express");
const app = express();
const path = require("path");

/** -- CONNECT CONFIG DETAILS -- */
const PORT = 3004;
const APP_URL = `http://localhost:${PORT}`;
/** -- CONNECT CONFIG DETAILS -- */

app.get("/marketing", (req, res) => {
  res.sendFile("C:\\Users\\jbolo\\WebstormProjects\\bakalaurs-arc\\MFE_iFrames\\public\\marketing.html");
});

app.get("/marketing.js", (req, res) => {
  res.sendFile("C:\\Users\\jbolo\\WebstormProjects\\bakalaurs-arc\\MFE_iFrames\\public\\marketing.js");
});

app.listen(PORT, () => {
  console.log(`[MFE] Marketing running at ${APP_URL}`);
});
