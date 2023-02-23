"use strict";

const path = require("path");

const PATHS = {
  src: path.resolve(__dirname, "../src"),
  dev_build: path.resolve(__dirname, "../build/dev"),
  qa_build: path.resolve(__dirname, "../build/qa"),
  stage_build: path.resolve(__dirname, "../build/stage"),
  prod_build: path.resolve(__dirname, "../build/prod"),
};

module.exports = PATHS;
