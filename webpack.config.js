const path = require('path');

const configuration = {
  entry: path.join(__dirname, './src/frontend/index.tsx'),
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        use: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
  },
};

module.exports = configuration;
