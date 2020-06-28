// https://webpack.js.org/concepts/#entry

const Config = require('./config.js');

const path = require('path');

module.exports = {
  mode: 'production',
  mode: 'development',

  entry: './src/entry.js',
  // devtool: 'inline-source-map',
  output: {
    // path: path.resolve(__dirname, 'dist'),
    path: Config.Public,
    filename: 'bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
      },

      {
        test: /\.css$/,
        exclude: /(node_modules)/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },

      {
        test: /lib\/.+\.js$/,
        loader: 'script-loader',
      },
    ],
  },
};
