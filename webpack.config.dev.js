const webpack = require("webpack");
const chalk = require("chalk");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const InterpolateHtmlPlugin = require("interpolate-html-plugin");
const paths = require("./paths");
const pckg = require("./package.json");
// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
const publicPath = "./src";
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
const publicUrl = "";
const env = {};
// Grab any application specific configs to be injected into the index.html file
module.exports = {
  stats: {
    assets: false,
    modules: false,
  },
  infrastructureLogging: {
    level: "none",
  },
  devServer: {
    hot: true,
    historyApiFallback: true,
    port: 3000,
  },
  devtool: "inline-source-map",
  mode: "development",
  entry: [`${paths.appSrc}/components/App.jsx`],
  output: {
    filename: "static/js/bundle.js",
    publicPath,
  },
  module: {
    rules: [
      {
        test: /\.woff2$/,
        type: "asset/inline",
      },
      {
        test: /\.(png|jpg|svg)$/,
        type: "asset/resource",
      },
      {
        test: /\.(js|jsx)$/,
        include: [paths.appSrc],
        loader: "babel-loader",
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
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
              modules: {
                localIdentName: "[local]--[hash:base64:5]",
              },
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    modules: [paths.appSrc, "node_modules"],
    extensions: [".js", ".json", ".jsx"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
    }),
    new webpack.DefinePlugin({ ...env }),
    new InterpolateHtmlPlugin({
      APP_VERSION: pckg.version,
    }),
    new ProgressBarPlugin({
      format: `  build [:bar] ${chalk.green.bold(
        ":percent"
      )} (:elapsed seconds)`,
      callback: () => {
        // eslint-disable-next-line no-console
        console.log(chalk.blue.bold("All set! Have a nice day!"));
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
