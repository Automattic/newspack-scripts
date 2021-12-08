"use strict";

const spawn = require("cross-spawn");
const modules = require("./utils/modules");

spawn.sync(process.execPath, [modules.calypsoBuild], {
  cwd: modules.rootDirectory,
  stdio: "inherit",
  env: { ...process.env, NODE_ENV: "production" }
});
