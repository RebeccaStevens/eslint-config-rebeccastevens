import type { Linter } from "eslint";

export default {
  overrides: [
    {
      files: ["*"],
      extends: ["@rebeccastevens/eslint-config/script"],
      rules: {
        "functional/functional-parameters": "off",
        "functional/immutable-data": "off",
        "node/no-sync": "off",
      },
    },
    {
      files: ["scripts/**/*"],
      extends: ["@rebeccastevens/eslint-config/script"],
    },
    {
      files: ["{test,tests}/**/*", "**/*.test.*"],
      extends: ["@rebeccastevens/eslint-config/test"],
    },
  ],
} as Linter.Config;
