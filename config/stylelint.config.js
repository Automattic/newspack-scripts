module.exports = {
  extends: [
    "@wordpress/stylelint-config/scss",
    "stylelint-prettier/recommended",
  ],
  rules: {
    "rule-empty-line-before": null,
    "at-rule-empty-line-before": null,
    "comment-empty-line-before": null,
    "string-quotes": "single",
    "no-descending-specificity": null,
    "function-url-quotes": null,
    "font-weight-notation": null,
    "color-named": null,
    "function-parentheses-space-inside": "always-single-line",
    "media-feature-parentheses-space-inside": "always",
    "selector-pseudo-class-parentheses-space-inside": "always",
    "selector-class-pattern": null,
  },
};
