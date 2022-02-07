import type { Linter } from "eslint";

const baseConfig: Linter.Config = {
  extends: ["@rebeccastevens/eslint-config/script"],

  rules: {
    "functional/functional-parameters": "off",
    "functional/immutable-data": "warn",
    "functional/no-conditional-statement": "warn",
    "functional/no-expression-statement": "off",
    "functional/no-loop-statement": "warn",
    "functional/no-throw-statement": "off",
    "node/no-sync": "off",
  },
};

export default baseConfig;
