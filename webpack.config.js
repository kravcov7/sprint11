const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';


module.exports = {
  entry: { main: './src/index.js' },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/, // include .js files
        enforce: "pre", // preload the jshint loader
        exclude: /node_modules/, // exclude any and all files in the `node_modules folder`
        use: [
            {
            loader: "babel-loader",
              options: {
                presets: [
                  "@babel/preset-env"      
                ],
                plugins: [
                  "@babel/plugin-syntax-dynamic-import",
                  "@babel/plugin-proposal-class-properties"
                ]
              }
            }
        ]
      },
      {
        test: /\.css$/i,
        use: [ 
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,{
              loader:'css-loader',
              options: {
                  importLoaders: 2
              } 
          }, 'postcss-loader'
            ]
        },
      {
        test: /\.(png|jpg|gif|ico|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
                name: "./images/[name].[ext]",
              esModule: false
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
            }
          }
        ],
      },
        {
            test: /\.(eot|ttf|woff|woff2)$/,
            loader: 'file-loader?name=./vendor/[name].[ext]'
        }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({ 
      filename: 'style.[contenthash].css',
    }),
    new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorPluginOptions: {
                preset: ['default'],
        },
        canPrint: true
    }),
    new webpack.DefinePlugin({
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new HtmlWebpackPlugin({
      inject: false,
      template: './src/index.html',
      filename: 'index.html'
    }),
    new WebpackMd5Hash()
  ]
};