const fs = require("fs");
const path = require("path");

module.exports = {
  rootDirectory: fs.realpathSync(process.cwd()),
  calypsoBuild: require.resolve("@automattic/calypso-build/bin/calypso-build")
};
