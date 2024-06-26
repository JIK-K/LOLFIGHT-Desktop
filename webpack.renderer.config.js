const webpack = require("webpack");
const rules = require("./webpack.rules");
const plugins = require("./webpack.plugins");
const path = require("path");
const dotenv = require("dotenv").config({
  path: path.resolve(__dirname, ".env"),
});

const envKeys = dotenv.parsed
  ? Object.keys(dotenv.parsed).reduce((prev, next) => {
      prev[`process.env.${next}`] = JSON.stringify(dotenv.parsed[next]);
      return prev;
    }, {})
  : {};

// rules.push([
//   {
//     test: /.css?$/,
//     exclude: [],
//     use: ["style-loader", "css-loader", "postcss-loader"],
//   },
// ]);

module.exports = {
  module: {
    rules,
  },
  plugins: [...plugins, new webpack.DefinePlugin(envKeys)],
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
  },
};
