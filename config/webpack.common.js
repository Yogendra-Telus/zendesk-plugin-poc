const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Dotenv = require("dotenv-webpack");
const PATHS = require("./paths");

const selectedEnv = (env) => {
  if (env.prod) return "prod";
  else if (env.stage) return "stage";
  else if (env.qa) return "qa";
  else return "dev";
};

const common = (env) => {
  const selectedEnvKey = selectedEnv(env);

  return {
    output: {
      // Path to the output folder
      path: PATHS[`${selectedEnvKey}_build`],
      filename: "[name].js",
      clean: true,
    },
    stats: {
      all: false,
      errors: true,
      builtAt: true,
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
    module: {
      rules: [
        // Help webpack in understanding CSS files imported in .(js|ts) files
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
        // Check for images imported in .(js|ts) files
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [
            {
              loader: "file-loader",
              options: {
                outputPath: "images",
                name: "[name].[ext]",
              },
            },
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
        },
      ],
    },
    plugins: [
      // Copy static assets from `public` folder to `build` folder
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "**/*",
            context: "public",
          },
        ],
      }),
      // Extract CSS into separate files
      new MiniCssExtractPlugin({
        filename: ({ chunk }) =>
          `${chunk.name.replace("scripts/", "css/")}.css`,
      }),
      new Dotenv({
        path: `./.env.${selectedEnvKey}`,
      }),
      // new GenerateJsonFromJsPlugin({
      //   path: PATHS.src + "/utils/manifest.js",
      //   filename: "manifest.json",
      //   data: {
      //     env: selectedEnvKey,
      //   },
      // }),
    ],

    // Entry Points
    entry: {
      "assets/main": PATHS.src + "/scripts/main.js",
    },
  };
};

module.exports = common;
