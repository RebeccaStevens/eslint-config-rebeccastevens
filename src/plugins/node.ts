import type { Linter } from "eslint";

export const settings: Linter.Config = {
  plugins: ["node"],

  extends: ["plugin:node/recommended"],

  rules: {
    "node/callback-return": "error",
    "node/exports-style": ["error", "module.exports"],
    "node/global-require": "error",
    "node/handle-callback-err": ["error", "^(err|error)$"],
    "node/no-callback-literal": "error",
    "node/no-mixed-requires": [
      "error",
      {
        grouping: true,
        allowCall: true,
      },
    ],
    "node/no-missing-import": "off",
    "node/no-new-require": "error",
    "node/no-path-concat": "error",
    "node/no-process-exit": "error",
    "node/no-sync": "error",
    "node/no-unpublished-import": "warn",
    "node/prefer-global/buffer": ["error", "always"],
    "node/prefer-global/console": ["error", "always"],
    "node/prefer-global/process": ["error", "always"],
    "node/prefer-global/text-decoder": ["error", "always"],
    "node/prefer-global/text-encoder": ["error", "always"],
    "node/prefer-global/url-search-params": ["error", "always"],
    "node/prefer-global/url": ["error", "always"],
    "node/prefer-promises/dns": "error",
    "node/prefer-promises/fs": "error",
  },
};
