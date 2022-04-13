const { version } = require("../../package.json");

const log = (content, type) => {
  console.log(
    `[newspack-scripts@${version}]${type ? `[${type}]` : ""} ${content}`
  );
};

module.exports = {
  log,
};
