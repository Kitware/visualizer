const autoprefixer = require('autoprefixer');

module.exports = [
  {
    test: /\.js$/,
    include: /node_modules(\/|\\)paraviewweb(\/|\\)/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          presets: ['env', 'react'],
        },
      },
    ],
  },
  {
    test: /\.c$/i,
    include: /node_modules(\/|\\)paraviewweb(\/|\\)/,
    loader: 'shader-loader',
  },
];
