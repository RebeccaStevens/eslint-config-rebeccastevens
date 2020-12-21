// Libraries.
import { all as deepMerge } from "deepmerge";
import { promises as fs } from "fs";

import libConfig from "../src";

// Project specific config.
const projectConfig = {
  root: true,
  parserOptions: {
    project: "tsconfig.json",
  },
  env: {
    node: true,
  },
  rules: {
    "no-magic-numbers": "off",
    "sonarjs/no-duplicate-string": "off",
    "unicorn/prevent-abbreviations": "off",
  },
  overrides: [
    {
      files: ["*.ts", "*.js"],
      rules: {
        "functional/immutable-data": "off",
        "functional/no-expression-statement": "off",
        "comma-dangle": "off",
      },
    },
  ],
};

// Merged config.
const config = deepMerge([libConfig, projectConfig]);

// Write the file.
fs.writeFile(".eslintrc", JSON.stringify(config, undefined, 2));
