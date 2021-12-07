"use strict";

process.env.BABEL_ENV = "test";
process.env.NODE_ENV = "test";

const jest = require("jest");
const fs = require("fs");
const path = require("path");
const execSync = require("child_process").execSync;

let argv = process.argv.slice(2);

const appDirectory = fs.realpathSync(process.cwd());

const JEST_CONFIG = {
  rootDir: path.resolve(appDirectory),
  setupFilesAfterEnv: [path.resolve(__dirname, "utils/jest-setup.js")],
  testMatch: ["<rootDir>/**/*test.js?(x)"],
  transform: {
    "^.+\\.js?$": "babel-jest"
  },
  moduleNameMapper: {
    "\\.(scss|css)$": "babel-jest"
  },
  testEnvironment: "jsdom",
  collectCoverageFrom: [
    "**/*.{js,jsx}",
    "!**/node_modules/**",
    "!**/dist/**",
    "!**/vendor/**"
  ]
};

argv.push("--config", JSON.stringify(JEST_CONFIG));

jest.run(argv);
