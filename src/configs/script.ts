import type { Linter } from "eslint";

const baseConfig: Linter.Config = {
  rules: {
    "functional/no-conditional-statements": "off",
    "functional/no-expression-statements": "off",
    "functional/no-loop-statements": "off",
    "functional/no-return-void": "off",
    "functional/no-throw-statements": "off",
    "node/no-process-exit": "off",
    "node/no-sync": "off",
    "node/no-unpublished-import": "off",
  },
};

export default baseConfig;
