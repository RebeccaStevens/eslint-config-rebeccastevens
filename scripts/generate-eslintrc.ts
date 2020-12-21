// Libraries.
import { all as deepMerge } from "deepmerge";
import { promises as fs } from "fs";

import libConfig from "~";

// Project specific config.
const projectConfig = {
  root: true,
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.eslint.json"],
  },
  env: {
    node: true,
  },
  plugins: ["prettier"],
  extends: ["plugin:prettier/recommended", "prettier", "prettier/@typescript-eslint"],
  ignorePatterns: ["coverage/"],
  overrides: [
    {
      files: ["*.{ts,js}"],
      rules: {
        "functional/immutable-data": "off",
        "functional/functional-parameters": "off",
        "functional/no-expression-statement": "off",
      },
    },
    {
      files: ["scripts/**/*.{ts,js}"],
      rules: {
        "functional/no-expression-statemen": "off",
        "functional/no-throw-statement": "off",
      },
    },
    {
      files: ["src/**/*.{ts,js}"],
      rules: {
        "sonarjs/no-duplicate-string": "off",
      },
    },
    {
      files: ["tests/**/*.{ts,js}"],
      plugins: ["ava"],
      extends: ["plugin:ava/recommended"],
      rules: {
        "functional/functional-parameters": "off",
        "functional/no-expression-statement": "off",
        "node/no-sync": "off",
      },
    },
  ],
};

// Merged config.
const config = deepMerge([libConfig, projectConfig]);

// Write the file.
fs.writeFile(".eslintrc", JSON.stringify(config, undefined, 2)).catch((error) => {
  throw error;
});
