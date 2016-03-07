var path = require('path'),
    webpack = require('webpack'),
    loaders = require('./node_modules/paraviewweb/config/webpack.loaders.js'),
    plugins = [];

if(process.env.NODE_ENV === 'production') {
    console.log('==> Production build');
    plugins.push(new webpack.DefinePlugin({
        "process.env": {
            NODE_ENV: JSON.stringify("production"),
        },
    }));
}

module.exports = {
  plugins: plugins,
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
        configFile: '.eslintrc.js',
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
