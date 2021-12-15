// Technically not required, but issues were encountered with module resolution
// done by an editor plugin (prettier-atom) when ran on a codebase using newspack-scripts.
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  extends: [
    "plugin:@wordpress/eslint-plugin/recommended",
    "plugin:react/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
  ],
  env: {
    browser: true,
    jest: true,
  },
  ignorePatterns: ["dist/", "node_modules/"],
  parser: "@babel/eslint-parser",
  rules: {
    "no-console": "off",
    camelcase: "off",
    // Disallow importing or requiring packages that are not listed in package.json
    // This prevents us from depending on transitive dependencies, which could break in unexpected ways.
    "import/no-extraneous-dependencies": ["error", { packageDir: "." }],
    // There's a conflict with prettier here:
    "react/jsx-curly-spacing": "off",
    // Skip prop types validation for now
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react/self-closing-comp": "error",
    // JSDoc rules overrides
    "jsdoc/require-returns": "off",
    "jsdoc/require-param": "off",
    // Deprecated rules
    "jsx-a11y/no-onchange": "off",
  },
};
