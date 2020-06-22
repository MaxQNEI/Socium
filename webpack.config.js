// https://webpack.js.org/concepts/#entry

const path = require('path');

module.exports = {
  mode: 'production',
  mode: 'development',

  entry: './src/entry.js',
  // devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
};
