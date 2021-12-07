import type { Linter } from "eslint";

const baseConfig: Linter.Config = {
  rules: {
    "functional/no-conditional-statement": "off",
    "functional/no-loop-statement": "off",
    "functional/no-throw-statement": "off",
  },
};

export default baseConfig;
