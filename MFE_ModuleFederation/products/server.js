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
const PORT = 3001;
const APP_URL = `http://localhost:${PORT}`;
/** -- CONNECT CONFIG DETAILS -- */

app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.use(webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: 'minimal',
}));

app.listen(PORT, () => {
  console.log(`Server running at ${APP_URL}`);
});
