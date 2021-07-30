// Libraries.
import { all as deepMerge } from "deepmerge";
import { promises as fs } from "fs";

import overridesConfig from "~/configs/common-overrides";
import modernConfig from "~/configs/modern";
import typescriptConfig from "~/configs/typescript";

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
  overrides: [
    {
      files: ["src/**/*.{ts,js}"],
      rules: {
        "sonarjs/no-duplicate-string": "off",
      },
    },
  ],
};

// Merged config.
const config = deepMerge([modernConfig, typescriptConfig, overridesConfig, projectConfig], {
  arrayMerge: (a, b) => [...a, ...b],
});

// Write the file.
void fs.writeFile(".eslintrc", JSON.stringify(config, undefined, 2));
