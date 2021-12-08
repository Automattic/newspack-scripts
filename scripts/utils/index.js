const fs = require("fs");

module.exports = {
  rootDirectory: fs.realpathSync(process.cwd())
};
