import { all as deepMerge } from "deepmerge";
import type { Linter } from "eslint";

import { settings as typescript } from "~/plugins/typescript";

const baseConfig: Linter.Config = {
  parser: "@typescript-eslint/parser",

  rules: {
    "camelcase": "off",
    "comma-dangle": "off",
    "dot-notation": "off",
    "indent": "off",
    "no-constant-condition": "off",
    "no-unused-expressions": "off",
    "no-unused-vars": "off",
    "no-use-before-define": "off",
  },

  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      rules: {
        "import/no-unresolved": "off",
        "import/named": "off",
        "import/default": "off",
        "import/namespace": "off",

        "node/no-unsupported-features/es-syntax": "off",
      },
      settings: {
        "import/parsers": {
          "@typescript-eslint/parser": [".ts", ".tsx"],
        },
      },
    },
  ],
};

export default deepMerge([baseConfig, typescript]) as Linter.Config;
