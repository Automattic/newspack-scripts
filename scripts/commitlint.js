"use strict";

const spawn = require("cross-spawn");
const path = require("path");

const result = spawn.sync(
  `${process.cwd()}/node_modules/.bin/commitlint`,
  ["--config", path.resolve(__dirname, "../config/commitlint.config.js")],
  {
    stdio: "inherit",
  }
);

process.exit(result.status);
