const fs = require("fs");
const path = require("path");

module.exports = {
  rootDirectory: fs.realpathSync(process.cwd()),
  calypsoBuild: path.resolve(__dirname, "../../node_modules/.bin/calypso-build")
};
