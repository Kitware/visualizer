const path = require('path');

const linterRules = require('./config/rules-linter.js');
const pvwRules = require('./config/rules-pvw.js');
const vtkjsRules = require('./config/rules-vtkjs.js');
const wslinkRules = require('./config/rules-wslink.js');

module.exports = {
  plugins: [],
  entry: path.join(__dirname, './src/app.js'),
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'Visualizer.js',
  },
  module: {
    rules: [
      {
        test: require.resolve('./src/app.js'), loader: 'expose-loader?Visualizer',
      }, {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader',
            options: {
              presets: ['env'],
            },
          },
        ],
      },
    ].concat(linterRules, pvwRules, vtkjsRules, wslinkRules),
  },
  resolve: {
    alias: {
      PVWStyle: path.resolve('./node_modules/paraviewweb/style'),
      VisualizerStyle: path.resolve('./style'),
    },
  },
  devServer: {
    contentBase: './dist/',
    port: 9999,
    hot: true,
    quiet: false,
    noInfo: false,
    stats: {
      colors: true,
    },
    proxy: {},
  },
};
