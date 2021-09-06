import type { Linter } from "eslint";

export const settings: Linter.Config = {
  plugins: ["unicorn"],

  extends: ["plugin:unicorn/recommended"],

  rules: {
    // "eslint-comments/no-unlimited-disable" covers this.
    "unicorn/no-abusive-eslint-disable": "off",
    // "functional/prefer-tacit" covers this.
    "unicorn/no-array-callback-reference": "off",
    "unicorn/no-array-reduce": "off",
    "unicorn/no-fn-reference-in-iterator": "off",
    "unicorn/no-nested-ternary": "off",
    "unicorn/no-null": "off",
    "unicorn/no-useless-undefined": "off",
    "unicorn/prevent-abbreviations": "off",
  },
};
