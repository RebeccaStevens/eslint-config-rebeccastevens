import type { Linter } from "eslint";

import { commonJsFiles, typescriptFiles } from "~/files";

// eslint eslint-plugin-n (instead of eslint-plugin-node)

export const settings: Linter.Config = {
  plugins: ["n"],

  extends: ["plugin:n/recommended"],

  rules: {
    "n/callback-return": "error",
    "n/exports-style": ["error", "module.exports"],
    // Allow dynamic imports.
    "n/global-require": "off",
    "n/handle-callback-err": ["error", "^(err|error)$"],
    "n/no-callback-literal": "error",
    "n/no-missing-import": "off",
    "n/no-mixed-requires": [
      "error",
      {
        allowCall: true,
        grouping: true,
      },
    ],
    "n/no-new-require": "error",
    "n/no-path-concat": "error",
    "n/no-process-exit": "error",
    "n/no-sync": "error",
    "n/no-unpublished-import": "warn",
    "n/no-unsupported-features/es-syntax": "off",
    "n/prefer-global/buffer": ["error", "always"],
    "n/prefer-global/console": ["error", "always"],
    "n/prefer-global/process": ["error", "always"],
    "n/prefer-global/text-decoder": ["error", "always"],
    "n/prefer-global/text-encoder": ["error", "always"],
    "n/prefer-global/url": ["error", "always"],
    "n/prefer-global/url-search-params": ["error", "always"],
    "n/prefer-promises/dns": "error",
    "n/prefer-promises/fs": "error",
  },

  overrides: [
    {
      files: commonJsFiles,
      rules: {
        "n/no-missing-require": "off",
      },
    },
    {
      files: typescriptFiles,
      rules: {
        "n/no-unsupported-features/es-syntax": "off",
      },
    },
  ],
};
