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
    {
      files: ["**/*.{cjs,cts}"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
        "import/no-dynamic-require": "off",
        "node/no-missing-require": "off",
        "unicorn/prefer-module": "off",
      },
    },
  ],
} as Linter.Config;
