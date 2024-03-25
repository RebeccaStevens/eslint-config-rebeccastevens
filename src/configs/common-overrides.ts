import { type Linter } from "eslint";

import { jsFiles, jsxFiles, testFiles } from "~/files";

export default {
  overrides: [
    {
      files: ["./*"],
      extends: ["@rebeccastevens/eslint-config/script"],
      rules: {
        "functional/immutable-data": "off",
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
      files: jsFiles,
      extends: [
        "plugin:@typescript-eslint/disable-type-checked",
        "plugin:functional/disable-type-checked",
      ],
      parserOptions: {
        project: false,
      },
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
