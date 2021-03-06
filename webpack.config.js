const webpack = require('webpack');
const fs = require('fs');
const path = require('path');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  entry: resolveApp('./src/index.js'),
  target: 'web',
  mode: process.env.WEBPACK_DEV_SERVER ? 'development' : 'production',
  devtool: 'source-map',
  output: {
    path: resolveApp('./public'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js|jsx$/,
        loader: 'babel-loader'
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: false,
    port: 9000
  }
};
