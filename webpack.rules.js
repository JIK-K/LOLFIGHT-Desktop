//webpack.rules.js
module.exports = [
  // Add support for native node modules
  {
    // We're specifying native_modules in the test because the asset relocator loader generates a
    // "fake" .node file which is really a cjs file.
    test: /native_modules\/.+\.node$/,
    use: "node-loader",
  },
  {
    test: /\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: "@vercel/webpack-asset-relocator-loader",
      options: {
        outputAssetBase: "native_modules",
      },
    },
  },
  {
    test: /\.tsx?$/,
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: "ts-loader",
      options: {
        transpileOnly: true,
      },
    },
  },
  {
    test: /\.(png|jpe?g|gif)$/i,
    use: [
      {
        loader: "file-loader",
      },
    ],
  },
  //여기서부터
  {
    test: /\.(sa|sc|c)ss$/,
    exclude: [],
    use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
  },
  // {
  //   test: /\.s[ac]ss$/i,
  //   use: [
  //     "style-loader", // Creates `style` nodes from JS strings
  //     "css-loader", // Translates CSS into CommonJS
  //     "postcss-loader", // PostCSS로 Tailwind CSS와 Autoprefixer
  //     "sass-loader", // Compiles Sass to CSS
  //   ],
  // },
  // {
  //   test: /\.s[ac]ss$/i,
  //   use: [
  //     "sass-loader", // Compiles Sass to CSS
  //     "postcss-loader", // PostCSS로 Tailwind CSS와 Autoprefixer 처리
  //     "css-loader", // Translates CSS into CommonJS
  //     "style-loader", // Creates `style` nodes from JS strings
  //   ],
  // },
];
