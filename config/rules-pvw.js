const autoprefixer = require('autoprefixer');

module.exports = [
  {
    test: /\.svg$/,
    loader: 'svg-sprite-loader?runtimeCompat=true',
    exclude: /fonts/,
  }, {
    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: 'url-loader?limit=60000&mimetype=application/font-woff',
  }, {
    test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: 'url-loader?limit=60000',
    include: /fonts/,
  }, {
    test: /\.(png|jpg)$/,
    loader: 'url-loader?limit=8192',
  }, {
    test: /\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader'],
  }, {
    test: /\.mcss$/,
    use: [
      { loader: 'style-loader' },
      { loader: 'css-loader', options: { localIdentName: '[sha512:hash:base32]-[name]-[local]', modules: true } },
      { loader: 'postcss-loader', options: { plugins: () => [autoprefixer('last 3 version', 'ie >= 10')] } },
    ],
  }, {
    test: /\.c$/i,
    loader: 'shader-loader',
  }, {
    test: /\.json$/,
    loader: 'json-loader',
  }, {
    test: /\.html$/,
    loader: 'html-loader',
  }, {
    test: /\.isvg$/,
    loader: 'html-loader?attrs=false',
  }, {
    test: /\.js$/,
    include: /node_modules(\/|\\)paraviewweb(\/|\\)/,
    use: [
      { loader: 'babel-loader',
        options: {
          presets: ['es2015', 'react'],
        },
      },
    ],
  },
];
