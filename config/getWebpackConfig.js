const path = require("path");

const getWebpackConfig = require("@automattic/calypso-build/webpack.config.js");

module.exports = (...args) => {
  const config = getWebpackConfig(...args);

  const scssRuleIndex = config.module.rules.findIndex(rule =>
    rule.test.toString().match(/\(sc\|sa\|c\)ss/)
  );
  if (scssRuleIndex !== -1) {
    const scssRule = config.module.rules[scssRuleIndex];
    const postCssLoaderIndex = scssRule.use.findIndex(
      loader => loader.loader && loader.loader.indexOf("postcss") > 0
    );
    if (postCssLoaderIndex !== -1) {
      const postCssLoader = scssRule.use[postCssLoaderIndex];
      const postCssConfigPath = path.resolve(__dirname, "postcss.config.js");
      // Replace calypso-build's PostCSS config with this project's one.
      postCssLoader.options.postcssOptions.config = postCssConfigPath;
      config.module.rules[scssRuleIndex].use[
        postCssLoaderIndex
      ] = postCssLoader;
    }
  }
  return config;
};
