const { merge } = require("webpack-merge");

const common = require("./webpack.common.js");

// Merge webpack configuration files
const config = (env, argv) =>
  merge(common(env), {
    mode: "production",
  });

module.exports = config;
