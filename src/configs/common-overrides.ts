import type { Linter } from "eslint";

export default {
  overrides: [
    {
      files: ["*"],
      rules: {
        "functional/immutable-data": "off",
        "functional/functional-parameters": "off",
        "functional/no-expression-statement": "off",
        "node/no-sync": "off",
      },
    },
    {
      files: ["scripts/**/*"],
      rules: {
        "functional/no-expression-statemen": "off",
        "functional/no-throw-statement": "off",
      },
    },
    {
      files: ["{test,tests}/**/*", "**/*.test.*"],
      rules: {
        "functional/functional-parameters": "off",
        "functional/no-expression-statement": "off",
        "node/no-sync": "off",
      },
    },
  ],
} as Linter.Config;
