"use strict";

process.env.BABEL_ENV = "test";
process.env.NODE_ENV = "test";

const jest = require("jest");
const path = require("path");

const modules = require("./utils/modules");
const utils = require("./utils/index.js");

utils.log("Starting tests…");

let argv = process.argv.slice(2);

const JEST_CONFIG = {
  rootDir: modules.rootDirectory,
  setupFilesAfterEnv: [path.resolve(__dirname, "utils/jestSetup.js")],
  testMatch: ["<rootDir>/**/*test.js?(x)"],
  transform: {
    "^.+\\.(j|t)sx?$": path.resolve(__dirname, "utils/babelJestTransformer.js"),
  },
  transformIgnorePatterns: [
    // Ignore all node_modules except for newspack-scripts, @wordpress/* packages, and
    // some transitive dependencies which distribute ES6 modules.
    "/node_modules/(?!(newspack-scripts|@wordpress|is-plain-obj|memize)/)",
  ],
  moduleNameMapper: {
    "\\.(scss|css)$": path.resolve(__dirname, "utils/babelJestTransformer.js"),
  },
  testEnvironment: "jsdom",
  collectCoverageFrom: [
    "**/*.{js,jsx}",
    "!**/node_modules/**",
    "!**/dist/**",
    "!**/vendor/**",
  ],
};

argv.push("--config", JSON.stringify(JEST_CONFIG));

jest.run(argv);
