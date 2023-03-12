import { jsxFiles, testFiles } from "common/files";
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
      files: testFiles,
      extends: ["@rebeccastevens/eslint-config/test"],
    },
    {
      files: jsxFiles,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          globalReturn: false,
          impliedStrict: true,
          jsx: true,
        },
      },
    },
  ],
} as Linter.Config;
