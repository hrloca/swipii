const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

const config = {
  entry: './src/docs/index.ts',
  mode: process.env.NODE_ENV || 'production',
  performance: {
    hints: false,
  },
  target: ['web', 'es5'],
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'docs'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/docs/index.html',
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'docs'),
    },
    client: {
      overlay: false,
    },
    compress: true,
    port: 9000,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      'react-native$': 'react-native-web',
    },
  },
  module: {
    rules: [
      {
        test: /\.ts|tsx$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      },
      {
        test: /\.ts|tsx$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
    ],
  },
}

module.exports = config
