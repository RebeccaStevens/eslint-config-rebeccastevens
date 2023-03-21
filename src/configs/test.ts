import type { Linter } from "eslint";

const baseConfig: Linter.Config = {
  extends: ["@rebeccastevens/eslint-config/script"],

  rules: {
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "eslint-comments/disable-enable-pair": "off",
    "functional/functional-parameters": "off",
    "functional/immutable-data": "warn",
    "functional/no-classes": "off",
    "functional/no-conditional-statements": "warn",
    "functional/no-expression-statements": "off",
    "functional/no-loop-statements": "warn",
    "functional/no-throw-statements": "off",
    "jsdoc/require-jsdoc": "off",
    "lines-between-class-members": "off",
    "max-classes-per-file": "off",
    "node/no-sync": "off",
    "sonarjs/no-duplicate-string": "off",
    "sonarjs/no-identical-functions": "off",
    "unicorn/consistent-function-scoping": "off",
  },
};

export default baseConfig;
