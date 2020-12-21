import type { Linter } from "eslint";

export const settings: Linter.Config = {
  plugins: ["unicorn"],

  extends: ["plugin:unicorn/recommended"],

  rules: {
    "unicorn/prevent-abbreviations": "off",
  },
};
