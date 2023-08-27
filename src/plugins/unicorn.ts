import { type Linter } from "eslint";

import { commonJsFiles } from "~/files";

export const settings: Linter.Config = {
  plugins: ["unicorn"],

  extends: ["plugin:unicorn/recommended"],

  rules: {
    "unicorn/import-style": [
      "error",
      {
        extendDefaultStyles: false,
        styles: {
          typescript: {
            default: true,
            named: true,
          },
        },
      },
    ],
    "unicorn/filename-case": [
      "error",
      {
        cases: {
          kebabCase: true,
          pascalCase: true,
        },
      },
    ],
    // "eslint-comments/no-unlimited-disable" covers this.
    "unicorn/no-abusive-eslint-disable": "off",
    "unicorn/no-array-callback-reference": "off",
    "unicorn/no-array-reduce": "off",
    "unicorn/no-empty-file": "off",
    "unicorn/no-nested-ternary": "off",
    "unicorn/no-null": "off",
    // "n/no-process-exit" covers this.
    "unicorn/no-process-exit": "off",
    "unicorn/no-useless-undefined": "off",
    "unicorn/prefer-at": [
      "error",
      {
        checkAllIndexAccess: false,
      },
    ],
    "unicorn/prefer-json-parse-buffer": "off",
    "unicorn/prefer-string-replace-all": "error",
    "unicorn/prefer-top-level-await": "error",
    "unicorn/prevent-abbreviations": "off",
  },

  overrides: [
    {
      files: commonJsFiles,
      rules: {
        "unicorn/prefer-module": "off",
        "unicorn/prefer-top-level-await": "off",
      },
    },
  ],
};
