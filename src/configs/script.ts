import { type Linter } from "eslint";

const baseConfig: Linter.Config = {
  rules: {
    "functional/functional-parameters": [
      "error",
      {
        enforceParameterCount: false,
      },
    ],
    "functional/no-conditional-statements": "off",
    "functional/no-expression-statements": "off",
    "functional/no-loop-statements": "off",
    "functional/no-return-void": "off",
    "functional/no-throw-statements": "off",
    "n/no-process-exit": "off",
    "n/no-sync": "off",
    "n/no-unpublished-import": "off",
  },
};

export default baseConfig;
