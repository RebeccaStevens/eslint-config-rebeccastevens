import { deepmerge } from "deepmerge-ts";
import type { Linter } from "eslint";

import { settings as tsdoc } from "~/plugins/tsdoc";
import { settings as typescript } from "~/plugins/typescript";

const baseConfig: Linter.Config = {
  parser: "@typescript-eslint/parser",

  rules: {
    "camelcase": "off",
    "comma-dangle": "off",
    "consistent-return": "off",
    "dot-notation": "off",
    "indent": "off",
    "no-constant-condition": "off",
    "no-extra-parens": "off",
    "no-loop-func": "off",
    "no-loss-of-precision": "off",
    "no-redeclare": "off",
    "no-shadow": "off",
    "no-unused-expressions": "off",
    "no-unused-vars": "off",
    "no-use-before-define": "off",
    "object-curly-spacing": "off",
    "space-infix-ops": "off",
  },

  settings: {
    "import/extensions": [
      ".js",
      ".ts",
      ".jsx",
      ".tsx",
      ".mjs",
      ".mts",
      ".cjs",
      ".cts",
    ],
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx", ".mts", ".cts"],
    },
  },

  overrides: [
    {
      files: ["**/*.{ts,tsx,mts,cts}"],
      rules: {
        "import/no-unresolved": "off",
        "import/named": "off",
        "import/default": "off",
        "import/namespace": "off",

        "node/no-unsupported-features/es-syntax": "off",
      },
    },
    {
      files: "**/*.d.{ts,mts,cts}",
      rules: {
        "@typescript-eslint/consistent-type-definitions": "off",
        "@typescript-eslint/triple-slash-reference": "off",

        "init-declarations": "off",
      },
    },
  ],
};

export default deepmerge(baseConfig, typescript, tsdoc);
