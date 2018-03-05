const path = require('path');

const linterRules = require('./config/rules-linter.js');
const pvwRules = require('./config/rules-pvw.js');
const visualizerRules = require('./config/rules-visualizer.js');
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
        test: require.resolve('./src/app.js'),
        loader: 'expose-loader?Visualizer',
      },
    ].concat(linterRules, pvwRules, visualizerRules, vtkjsRules, wslinkRules),
  },
  resolve: {
    alias: {
      PVWStyle: path.join(__dirname, './node_modules/paraviewweb/style'),
      VisualizerStyle: path.join(__dirname, './style'),
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
