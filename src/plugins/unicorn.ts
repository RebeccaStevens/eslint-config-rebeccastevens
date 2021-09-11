import type { Linter } from "eslint";

export const settings: Linter.Config = {
  plugins: ["unicorn"],

  extends: ["plugin:unicorn/recommended"],

  rules: {
    "unicorn/import-style": "off",
    // "eslint-comments/no-unlimited-disable" covers this.
    "unicorn/no-abusive-eslint-disable": "off",
    "unicorn/no-array-callback-reference": "off",
    "unicorn/no-array-reduce": "off",
    "unicorn/no-nested-ternary": "off",
    "unicorn/no-null": "off",
    "unicorn/no-useless-undefined": "off",
    // "unicorn/prefer-at": [
    //   "error",
    //   {
    //     checkAllIndexAccess: true,
    //   },
    // ],
    // "unicorn/prefer-object-has-own": "error",
    "unicorn/prefer-string-replace-all": "error",
    "unicorn/prefer-top-level-await": "error",
    "unicorn/prevent-abbreviations": "off",
  },
};
