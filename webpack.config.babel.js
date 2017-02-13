/**
 * webpack config file.
 */

import { optimize, DefinePlugin, ProvidePlugin } from 'webpack';
import path from 'path';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import * as thinksns from './app/config.js';
import { createH5API } from './app/src/util/api.js';

// 环境变量获取
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProd = NODE_ENV === 'production';
const hash = isProd ? '[hash]' : 'dev';

// 入口配置
const entry = {
  bundle: [
    path.join(__dirname, 'webapp', 'thinksns.jsx'),
    path.join(__dirname, 'app', 'index.js'),
  ],
};

// 基础插件
const basePlugins = [
  new DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify(NODE_ENV),
    },
  }),
  new HTMLWebpackPlugin({
    title: thinksns.title,
    description: thinksns.description,
    keywords: thinksns.keywords,
    noscriptURL: createH5API('/index/noscript'),
    template: path.join(__dirname, 'app', 'index.html'),
    minify: isProd ? {
      removeComments: true,
      collapseWhitespace: true,
    } : false,
    filename: 'index.html',
  }),
  new HTMLWebpackPlugin({
    noscriptURL: createH5API('/index/noscript'),
    indexURL: createH5API('/index/index'),
    template: path.join(__dirname, 'app', 'noscript.html'),
    filename: 'noscript.html',
    inject: false,
  }),
  new ExtractTextPlugin({
    filename: `css/app.${hash}.css`,
    allChunks: true,
  }),
  new ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
  }),
];

// 依托于环境模式插件
const envPlugins = isProd
  ? [
    new optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: false,
    }),
  ]
  : [];

const webpack_config = {
  devtool: isProd ? false : 'source-map',
  entry: entry,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: `js/[name].${hash}.js`,
    publicPath: thinksns.dist_url,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.join(__dirname, 'app'),
          path.join(__dirname, 'webapp'),
        ],
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: `css-loader?${isProd ? 'minimize' : 'sourceMap'}`
        }),
      },
      {
        test: /\.jpe?g$|\.gif$|\.png|\.ico$/,
        loader: 'url-loader',
        options: {
          limit: 25000,
          name: isProd ? 'images/[hash].[ext]' : '[path][name].[ext]',
          context: 'app',
        }
      },
      // 字体加载器
      {
        test: /\.woff2$/,
        loader: 'url-loader',
        options: {
          limit: 102400,
          mimetype: 'application/font-woff2',
          name: isProd ? 'fonts/[hash].[ext]' : '[path][name].[ext]',
        }
      },
      {
        test: /\.woff$/,
        loader: 'url-loader',
        options: {
          limit: 102400,
          mimetype: 'application/font-woff',
          name: isProd ? 'fonts/[hash].[ext]' : '[path][name].[ext]',
        }
      },
      {
        test: /\.[ot]tf$|\.eot$/,
        loader: 'url-loader',
        options: {
          limit: 102400,
          mimetype: 'application/octet-stream',
          name: isProd ? 'fonts/[hash].[ext]' : '[path][name].[ext]',
        }
      }
    ],
  },
  plugins: [
    ...basePlugins,
    ...envPlugins
  ],
  resolve: {
    extensions: ['.js', '.jsx', '/index.js'],
  }
};

export default webpack_config;
