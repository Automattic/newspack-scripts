"use strict";

const spawn = require("cross-spawn");
const path = require("path");

console.log(path.resolve(__dirname, "../config/tsconfig.json"));

const result = spawn.sync(
  `${process.cwd()}/node_modules/.bin/tsc`,
  ["--project", path.resolve(__dirname, "../config/tsconfig.json")],
  {
    stdio: "inherit",
  }
);

console.log(result);

process.exit(result.status);
