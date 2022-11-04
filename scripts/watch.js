"use strict";

const spawn = require("cross-spawn");
const modules = require("./utils/modules");
const utils = require("./utils/index.js");

utils.log("Starting to watch…");

spawn.sync(process.execPath, [modules.calypsoBuild, "--watch"], {
  cwd: modules.rootDirectory,
  stdio: "inherit",
  env: { ...process.env, NODE_ENV: "development" },
});
