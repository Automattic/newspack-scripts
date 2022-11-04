"use strict";

const spawn = require("cross-spawn");
const path = require("path");
const modules = require("./utils/modules");
const utils = require("./utils/index.js");

utils.log("Starting TypeScript check…");

const result = spawn.sync(`${process.cwd()}/node_modules/.bin/tsc`, [], {
  stdio: "inherit",
});

if (result.status === 0) {
  utils.log("All good!");
}

process.exit(result.status);
