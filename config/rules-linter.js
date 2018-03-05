const path = require('path');

const eslintrcPath = path.join(__dirname, '../.eslintrc.js');

module.exports = [
  {
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'eslint-loader',
    enforce: 'pre',
    options: { configFile: eslintrcPath },
  },
];
