import type { Linter } from "eslint";

const baseConfig: Linter.Config = {
  extends: ["@rebeccastevens/eslint-config/script"],

  rules: {
    "functional/functional-parameters": "off",
    "functional/immutable-data": "warn",
    "functional/no-conditional-statements": "warn",
    "functional/no-expression-statements": "off",
    "functional/no-loop-statements": "warn",
    "functional/no-throw-statements": "off",
    "node/no-sync": "off",
  },
};

export default baseConfig;
