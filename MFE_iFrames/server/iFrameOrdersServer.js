const express = require("express");
const app = express();
const path = require("path");

/** -- CONNECT CONFIG DETAILS -- */
const PORT = 3002;
const APP_URL = `http://localhost:${PORT}`;
/** -- CONNECT CONFIG DETAILS -- */

app.get("/orders", (req, res) => {
  res.sendFile(path.join("C:\\Users\\jbolo\\WebstormProjects\\bakalaurs-arc\\public\\orders.html"));
});

app.listen(PORT, () => {
  console.log(`[MFE] Orders running at ${APP_URL}`);
});
