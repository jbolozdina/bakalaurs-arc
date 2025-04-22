const express = require("express");
const app = express();
const path = require("path");

/** -- CONNECT CONFIG DETAILS -- */
const PORT = 3001;
const APP_URL = `http://localhost:${PORT}`;
/** -- CONNECT CONFIG DETAILS -- */

app.get("/products", (req, res) => {
  res.sendFile("C:\\Users\\jbolo\\WebstormProjects\\bakalaurs-arc\\MFE_iFrames\\public\\products.html");
});

app.get("/products.js", (req, res) => {
  res.sendFile("C:\\Users\\jbolo\\WebstormProjects\\bakalaurs-arc\\MFE_iFrames\\public\\products.js");
});

app.listen(PORT, () => {
  console.log(`[MFE] Products running at ${APP_URL}`);
});
