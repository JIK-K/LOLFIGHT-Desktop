module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: "./src/index.ts",
  // Put your normal webpack config below here
  externals: {
    "league-connect": "league-connect",
  },
  module: {
    rules: require("./webpack.rules"),
  },
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
  },
  fallback: {
    https: require.resolve("https-browserify"),
  },
};
