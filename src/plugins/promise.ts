import type { Linter } from "eslint";

export const settings: Linter.Config = {
  plugins: ["promise"],

  extends: ["plugin:promise/recommended"],

  rules: {
    "promise/avoid-new": "warn",
    "promise/no-nesting": "error",
    "promise/no-promise-in-callback": "error",
    "promise/no-return-in-finally": "error",
    "promise/prefer-await-to-callbacks": "warn",
    "promise/prefer-await-to-then": "off",
    "promise/valid-params": "error",
  },
};
