import type { Linter } from "eslint";

export const settings: Linter.Config = {
  plugins: ["promise"],

  extends: ["plugin:promise/recommended"],

  rules: {
    "promise/always-return": "off",
    "promise/avoid-new": "warn",
    "promise/catch-or-return": "off",
    "promise/no-nesting": "error",
    "promise/no-promise-in-callback": "error",
    "promise/no-return-in-finally": "error",
    "promise/prefer-await-to-callbacks": "off",
    "promise/prefer-await-to-then": "off",
    "promise/valid-params": "error",
  },
};
