const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HelloWorldPlugin = require('./src/plugin');

module.exports = {
  entry: {
    pageOne:"./src/renderTest.js",
  },
  output: {
    filename: "[hash].js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget:'umd'
  },
  optimization: {
    splitChunks:{
      cacheGroups: {
        commons: {
            name: "commons",
            chunks: "initial",
            minChunks: 2
        }
      }
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({title:'123',template:'src/index.html'}),
    // new HelloWorldPlugin({options: true})
  ],
  devServer:{
    contentBase:'./dist',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude:/node_modules/,
        query:{
            presets:['react']
        }
      },
    ],
  },
  mode: 'development',
  target:'web',
}

const b = {
  entry: {
    pageOne:"./src/fiber.js",
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "render"),
    libraryTarget:'umd'
  },
  optimization: {
    splitChunks:{
      cacheGroups: {
        commons: {
            name: "commons",
            chunks: "initial",
            minChunks: 2
        }
      }
    },
  },
  devtool:'cheap-module-eval-source-map',
  plugins: [
    new CleanWebpackPlugin(),
  ],
  devServer:{
    contentBase:'./dist',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude:/node_modules/,
        query:{
            presets:['react']
        }
      },
    ],
  },
  mode: 'production',
  target:'node',
}
