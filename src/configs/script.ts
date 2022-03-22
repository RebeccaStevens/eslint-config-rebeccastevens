import type { Linter } from "eslint";

const baseConfig: Linter.Config = {
  rules: {
    "functional/no-conditional-statement": "off",
    "functional/no-expression-statement": "off",
    "functional/no-loop-statement": "off",
    "functional/no-throw-statement": "off",
    "node/no-process-exit": "off",
    "node/no-sync": "off",
    "node/no-unpublished-import": "off",
  },
};

export default baseConfig;
