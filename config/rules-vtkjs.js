module.exports = [
  {
    test: /\.js$/,
    include: /node_modules(\/|\\)vtk\.js(\/|\\)/,
    use: [
      { loader: 'babel-loader',
        options: {
          presets: ['es2015'],
        },
      },
    ],
  }, {
    test: /\.glsl$/,
    loader: 'shader-loader',
  },
];
