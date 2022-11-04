"use strict";

const spawn = require("cross-spawn");
const modules = require("./utils/modules");
const utils = require("./utils/index.js");

utils.log("Starting to build…");

const calypsoReinstallResult = spawn.sync(
  "cd node_modules/newspack-scripts && npm i @automattic/calypso-build --legacy-peer-deps",
  [],
  {
    shell: true,
    cwd: modules.rootDirectory,
    stdio: "inherit",
  }
);
if (calypsoReinstallResult.status === 0) {
  utils.log("Calypso reinstall successful.");
} else {
  utils.log("Calypso reinstall failed:");
  console.log(calypsoReinstallResult);
}

const buildResult = spawn.sync(process.execPath, [modules.calypsoBuild], {
  cwd: modules.rootDirectory,
  stdio: "inherit",
  env: { ...process.env, NODE_ENV: "production" },
});

if (buildResult.status === 0) {
  utils.log("Build succeeded!");
}

process.exit(buildResult.status);
