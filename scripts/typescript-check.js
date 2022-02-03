"use strict";

const spawn = require("cross-spawn");
const path = require("path");
const modules = require("./utils/modules");

const result = spawn.sync(
  `${process.cwd()}/node_modules/.bin/tsc`,
  ["--project", path.resolve(__dirname, "../config/tsconfig.json")],
  {
    cwd: modules.rootDirectory,
    stdio: "inherit",
    env: process.env,
  }
);

console.log(result);

process.exit(result.status);
