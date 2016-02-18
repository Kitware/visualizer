var path = require('path'),
    loaders = require('./node_modules/paraviewweb/config/webpack.loaders.js');

module.exports = {
  plugins: [],
  entry: './src/app.js',
  output: {
    path: './dist',
    filename: 'Visualizer.js',
  },
  module: {
        preLoaders: [{
            test: /\.js$/,
            loader: "eslint-loader",
            exclude: /node_modules/,
        }],
        loaders: [
            { test: require.resolve("./src/app.js"), loader: "expose?Visualizer" },
        ].concat(loaders),
    },
    resolve: {
        alias: {
            PVWStyle: path.resolve('./node_modules/paraviewweb/style'),
            VisualizerStyle: path.resolve('./style'),
        },
    },
    postcss: [
        require('autoprefixer')({ browsers: ['last 2 versions'] }),
    ],
    eslint: {
        configFile: '.eslintrc',
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
