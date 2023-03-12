import type { Linter } from "eslint";

export const rules: Linter.Config["rules"] = {
  "callback-return": "off",
  "global-require": "off",
  "handle-callback-err": "off",
  "id-blacklist": "off",
  "indent-legacy": "off",
  "lines-around-directive": "off",
  "newline-after-var": "off",
  "newline-before-return": "off",
  "no-buffer-constructor": "off",
  "no-catch-shadow": "off",
  "no-mixed-requires": "off",
  "no-native-reassign": "off",
  "no-negated-in-lhs": "off",
  "no-new-require": "off",
  "no-path-concat": "off",
  "no-process-env": "off",
  "no-process-exit": "off",
  "no-restricted-modules": "off",
  "no-spaced-func": "off",
  "no-sync": "off",
  "prefer-reflect": "off",
  "require-jsdoc": "off",
  "valid-jsdoc": "off",
};

export const overrides: NonNullable<Linter.Config["overrides"]> = [];
