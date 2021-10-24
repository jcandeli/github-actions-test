const webpack = require('webpack');
const chalk = require('chalk');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');
const getClientEnvironment = require('./env');
const paths = require('./paths');
const pckg = require('../package.json');
const commonConfig = require('./webpack.config.common');
// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
const publicPath = '/';
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
const publicUrl = '';
const env = getClientEnvironment(publicUrl);
// Grab any application specific configs to be injected into the index.html file
const appConfig = JSON.parse(commonConfig.externals.appConfig);
module.exports = {
  stats: {
    assets: false,
    modules: false,
  },
  infrastructureLogging: {
    level: 'none',
  },
  devServer: {
    hot: true,
    historyApiFallback: true,
    port: 3000,
    https: {
      cert: fs.readFileSync('../STAR.dev.chownow.com.ca-bundle'),
      key: fs.readFileSync('../dev.chownow.com.key'),
    },
    host: 'web.dev.chownow.com',
  },
  devtool: 'inline-source-map',
  mode: 'development',
  entry: [paths.appIndexJs],
  output: {
    filename: 'static/js/bundle.js',
    publicPath,
  },
  module: {
    rules: [
      {
        test: /\.woff2$/,
        type: 'asset/inline',
      },
      {
        test: /\.(png|jpg|svg)$/,
        type: 'asset/resource',
      },
      {
        test: /\.(js|jsx)$/,
        include: [paths.appSrc],
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
      },
      // "css" loader resolves paths in CSS and adds assets as dependencies.
      // "style" loader turns CSS into JS modules that inject <style> tags.
      // In production, we use a plugin to extract that CSS to a file, but
      // in development "style" loader enables hot editing of CSS.
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              modules: {
                localIdentName: '[local]--[hash:base64:5]',
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    modules: [paths.appSrc, 'node_modules'],
    extensions: ['.js', '.json', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
    }),
    new webpack.DefinePlugin({ ...env }),
    new InterpolateHtmlPlugin({
      APP_VERSION: pckg.version,
      GOOGLE_OPTIMIZE_ID: appConfig.googleOptimizeId,
      PUBLIC_URL: publicUrl,
      MPARTICLE_KEY: appConfig.mParticleKey,
      MPARTICLE_PLAN_VERSION: appConfig.mparticlePlanVersion,
      MPARTICLE_PLAN_ID: appConfig.mparticlePlanID,
      DEPLOY_ENV: process.env.DEPLOY_ENV,
    }),
    new ProgressBarPlugin({
      format:
        `  build [:bar] ${
          chalk.green.bold(':percent')
        } (:elapsed seconds)`,
      callback: () => {
        // eslint-disable-next-line no-console
        console.log(chalk.blue.bold('All set! Have a nice day!'));
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  externals: commonConfig.externals,
};