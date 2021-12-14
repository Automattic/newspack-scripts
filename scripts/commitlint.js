"use strict";

const spawn = require("cross-spawn");
const path = require("path");

const result = spawn.sync(
  "./node_modules/.bin/commitlint",
  ["--config", path.resolve(__dirname, "../config/commitlint.config.js")],
  {
    cwd: path.resolve(__dirname, ".."),
    stdio: "inherit",
  }
);

process.exit(result.status);
