const express = require("express");
const app = express();
const path = require("path");

/** -- CONNECT CONFIG DETAILS -- */
const PORT = 3003;
const APP_URL = `http://localhost:${PORT}`;
/** -- CONNECT CONFIG DETAILS -- */

app.get("/analytics", (req, res) => {
  res.sendFile(path.join("C:\\Users\\jbolo\\WebstormProjects\\bakalaurs-arc\\public\\analytics.html"));
});

app.listen(PORT, () => {
  console.log(`[MFE] Analytics running at ${APP_URL}`);
});
