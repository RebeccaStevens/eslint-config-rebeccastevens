// Libraries.
import { deepmerge } from "deepmerge-ts";
import { promises as fs } from "fs";

import overridesConfig from "~/configs/common-overrides";
import modernConfig from "~/configs/modern";
import typescriptConfig from "~/configs/typescript";

// Project specific config.
const projectConfig = {
  root: true,
  parserOptions: {
    project: "tsconfig.json",
  },
  env: {
    node: true,
  },
  ignorePatterns: ["/dist/", "/**/*.cjs", "/**/*.js"],
  plugins: ["prettier"],
  extends: ["plugin:prettier/recommended", "prettier"],
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
const config = deepmerge(
  modernConfig,
  typescriptConfig,
  overridesConfig,
  projectConfig
);

// Write the file.
void fs.writeFile(".eslintrc", JSON.stringify(config, undefined, 2));
