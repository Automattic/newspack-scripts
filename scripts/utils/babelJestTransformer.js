"use strict";

const babelJest = require("babel-jest").default;

module.exports = babelJest.createTransformer({
  presets: [
    require.resolve("@babel/preset-env"),
    require.resolve("@automattic/calypso-build/babel/default"),
    require.resolve("@automattic/calypso-build/babel/wordpress-element")
  ],
  babelrc: false,
  configFile: false
});
