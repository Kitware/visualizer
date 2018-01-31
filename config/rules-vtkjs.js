module.exports = [
  {
    test: /\.js$/,
    include: /node_modules(\/|\\)vtk\.js(\/|\\)/,
    use: [
      { loader: 'babel-loader',
        options: {
          presets: ['env'],
        },
      },
    ],
  }, {
    test: /\.glsl$/,
    loader: 'shader-loader',
  },
];
