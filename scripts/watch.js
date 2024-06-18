"use strict";

const spawn = require("cross-spawn");
const modules = require("./utils/modules");
const utils = require("./utils/index.js");
const wpScripts = require.resolve("@wordpress/scripts/bin/wp-scripts");

utils.log("Starting to watch…");

const args = process.argv.slice(2);

spawn.sync(wpScripts, modules.args("start", args), {
  cwd: modules.rootDirectory,
  stdio: "inherit",
  env: { ...process.env, NODE_ENV: "development" },
});
