"use strict";

const spawn = require("cross-spawn");
const path = require("path");
const modules = require("./utils/modules");

const result = spawn.sync(`${process.cwd()}/node_modules/.bin/tsc`, [], {
  stdio: "inherit",
});

console.log(result);

process.exit(result.status);
