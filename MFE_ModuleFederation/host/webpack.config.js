const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  context: path.resolve(__dirname),
  entry: './src/index.js',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/static/'
  },
  resolve: {
    extensions: ['.js', '.vue']
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new ModuleFederationPlugin({
      name: 'host',
      filename: 'remoteEntry.js',
      remotes: {
        products: 'products@http://localhost:3001/remoteEntry.js',
        orders: 'orders@http://localhost:3002/remoteEntry.js',
        analytics: 'analytics@http://localhost:3003/remoteEntry.js',
        marketing: 'marketing@http://localhost:3004/remoteEntry.js',
      },
      shared: {
        vue: {
          singleton: true,
          eager: true
        },
        axios: {
          singleton: true,
          eager: true
        }
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  devServer: {
    port: 8080,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  }
};
