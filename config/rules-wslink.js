module.exports = [
  {
    test: /\.js$/,
    include: /node_modules(\/|\\)wslink(\/|\\)/,
    use: [
      { loader: 'babel-loader',
        options: {
          presets: ['es2015'],
        },
      },
    ],
  },
];
