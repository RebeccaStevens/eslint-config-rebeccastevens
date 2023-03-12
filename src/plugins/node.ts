import { commonJsFiles, typescriptFiles } from "common/files";
import type { Linter } from "eslint";

export const settings: Linter.Config = {
  plugins: ["node"],

  extends: ["plugin:node/recommended"],

  rules: {
    "node/callback-return": "error",
    "node/exports-style": ["error", "module.exports"],
    // Allow dynamic imports.
    "node/global-require": "off",
    "node/handle-callback-err": ["error", "^(err|error)$"],
    "node/no-callback-literal": "error",
    "node/no-missing-import": "off",
    "node/no-mixed-requires": [
      "error",
      {
        allowCall: true,
        grouping: true,
      },
    ],
    "node/no-new-require": "error",
    "node/no-path-concat": "error",
    "node/no-process-exit": "error",
    "node/no-sync": "error",
    "node/no-unpublished-import": "warn",
    "node/no-unsupported-features/es-syntax": "off",
    "node/prefer-global/buffer": ["error", "always"],
    "node/prefer-global/console": ["error", "always"],
    "node/prefer-global/process": ["error", "always"],
    "node/prefer-global/text-decoder": ["error", "always"],
    "node/prefer-global/text-encoder": ["error", "always"],
    "node/prefer-global/url": ["error", "always"],
    "node/prefer-global/url-search-params": ["error", "always"],
    "node/prefer-promises/dns": "error",
    "node/prefer-promises/fs": "error",
  },

  overrides: [
    {
      files: commonJsFiles,
      rules: {
        "node/no-missing-require": "off",
      },
    },
    {
      files: typescriptFiles,
      rules: {
        "node/no-unsupported-features/es-syntax": "off",
      },
    },
  ],
};
