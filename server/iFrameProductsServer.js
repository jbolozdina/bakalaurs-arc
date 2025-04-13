const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");

/** -- CONNECT CONFIG DETAILS -- */
const PORT = 3001;
const APP_URL = `http://localhost:${PORT}`;
/** -- CONNECT CONFIG DETAILS -- */

// DB_CONNECTION=mysql
// DB_HOST=127.0.0.1
// DB_PORT=3306
// DB_DATABASE=laravel
// DB_USERNAME=root
// DB_PASSWORD=1234

app.use(cookieParser());

app.get("/products", (req, res) => {
  res.sendFile(path.join("C:\\Users\\jbolo\\WebstormProjects\\bakalaurs-arc\\public\\products.html"));
});

app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`Server running at ${APP_URL}`);
});
