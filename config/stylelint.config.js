module.exports = {
  extends: ["stylelint-config-standard"],
  rules: {
    "rule-empty-line-before": null,
    "at-rule-empty-line-before": null,
    "comment-empty-line-before": null,
    "no-descending-specificity": null,
    "function-url-quotes": null,
    "font-weight-notation": null,
    "color-named": null,
    "selector-class-pattern": null,
    "custom-property-pattern": null,
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["use", "include", "mixin"],
      },
    ],
  },
};
