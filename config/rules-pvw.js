const autoprefixer = require('autoprefixer');

module.exports = [
  {
    test: /\.js$/,
    include: /node_modules(\/|\\)paraviewweb(\/|\\)/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
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
