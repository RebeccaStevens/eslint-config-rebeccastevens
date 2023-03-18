import type { Linter } from "eslint";

import { typescriptExtensions, typescriptSupportedExtensions } from "~/files";
import { mergeConfigs } from "~/merge-configs";
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
    "import/extensions": typescriptSupportedExtensions,
    "import/external-module-folders": ["node_modules", "node_modules/@types"],
    "import/parsers": {
      "@typescript-eslint/parser": typescriptExtensions,
    },
    "import/resolver": {
      typescript: {
        extensions: typescriptSupportedExtensions,
      },
    },
  },
};

export default mergeConfigs(baseConfig, typescript);
