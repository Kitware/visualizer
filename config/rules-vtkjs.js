const autoprefixer = require('autoprefixer');

module.exports = [
  {
    test: /\.glsl$/i,
    include: /node_modules(\/|\\)vtk.js(\/|\\)/,
    loader: 'shader-loader',
  },
  {
    test: /\.js$/,
    include: /node_modules(\/|\\)vtk.js(\/|\\)/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
    ],
  },
  {
    test: /\.css$/,
    include: /node_modules(\/|\\)vtk.js(\/|\\)/,
    exclude: /\.module\.css$/,
    use: [
      { loader: 'style-loader' },
      { loader: 'css-loader' },
      {
        loader: 'postcss-loader',
        options: {
          plugins: () => [autoprefixer('last 2 version', 'ie >= 10')],
        },
      },
    ],
  },
  {
    test: /\.module\.css$/,
    include: /node_modules(\/|\\)vtk.js(\/|\\)/,
    use: [
      { loader: 'style-loader' },
      {
        loader: 'css-loader',
        options: {
          localIdentName: '[name]-[local]_[sha512:hash:base64:5]',
          modules: true,
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          plugins: () => [autoprefixer('last 2 version', 'ie >= 10')],
        },
      },
    ],
  },
  {
    include: /node_modules(\/|\\)vtk.js(\/|\\)/,
    test: /\.svg$/,
    use: [{ loader: 'raw-loader' }],
  },
  {
    include: /node_modules(\/|\\)vtk.js(\/|\\)/,
    test: /\.worker\.js$/,
    use: [
      // options format for kw-web-suite@8.0.0
      { loader: 'worker-loader', options: { inline: true, fallback: false } },
    ],
  },
];
