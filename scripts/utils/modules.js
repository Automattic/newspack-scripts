const fs = require("fs");

module.exports = {
  rootDirectory: fs.realpathSync(process.cwd()),
  calypsoBuild: require.resolve("@automattic/calypso-build/bin/calypso-build"),
};
