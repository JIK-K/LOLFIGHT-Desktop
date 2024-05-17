const webpack = require("webpack");
const path = require("path");
const fs = require("fs");

// Load environment variables from .env file
const dotenv = require("dotenv").config({
  path: path.resolve(__dirname, ".env"),
});

// Convert .env variables to DefinePlugin format
const envKeys = dotenv.parsed
  ? Object.keys(dotenv.parsed).reduce((prev, next) => {
      prev[`process.env.${next}`] = JSON.stringify(dotenv.parsed[next]);
      return prev;
    }, {})
  : {};

module.exports = {
  entry: "./src/main/index.ts",
  module: {
    rules: require("./webpack.rules"),
  },
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
  },
  plugins: [...require("./webpack.plugins"), new webpack.DefinePlugin(envKeys)],
};
