const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('./webpack.config.js');
const compiler = webpack(webpackConfig);

/** -- CONNECT CONFIG DETAILS -- */
const PORT = 3002;
const APP_URL = `http://localhost:${PORT}`;
/** -- CONNECT CONFIG DETAILS -- */

// Sample data for products
const products = [
  { id: 1, name: "Smartphone", price: 699.99 },
  { id: 2, name: "Laptop", price: 1299.99 },
  { id: 3, name: "Tablet", price: 499.99 },
  { id: 4, name: "Smartwatch", price: 299.99 },
  { id: 5, name: "Headphones", price: 199.99 }
];

app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.use(webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: 'minimal',
}));

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.post("/api/login", (req, res) => {
  // Simplified login logic
  res.cookie('sessionId', '123');
  res.json({ message: 'authenticated & cookie baked in!', data: { userId: 1 } });
});

app.delete("/api/revoke-me-auth-cookie", (req, res) => {
  res.clearCookie('sessionId');
  res.json({ success: 1 });
});

app.listen(PORT, () => {
  console.log(`Server running at ${APP_URL}`);
});
