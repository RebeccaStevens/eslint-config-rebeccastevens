import type { ESLint } from "eslint";

import { GLOB_DTS, GLOB_MJS, GLOB_TS, GLOB_TSX } from "../globs";
import type { FlatConfigItem } from "../types";
import { loadPackages } from "../utils";

export async function node(): Promise<FlatConfigItem[]> {
  const [pluginNode] = (await loadPackages(["eslint-plugin-n"])) as [ESLint.Plugin];

  return [
    {
      name: "rs:node",
      plugins: {
        n: pluginNode,
      },
      rules: {
        "n/callback-return": "error",
        "n/exports-style": ["error", "module.exports"],
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
        "n/no-restricted-import": [
          "error",
          [
            {
              name: "assert",
              message: "Please use assert/strict instead.",
            },
            {
              name: "node:assert",
              message: "Please use node:assert/strict instead.",
            },
          ],
        ],
        "n/no-restricted-require": [
          "error",
          [
            {
              name: "assert",
              message: "Please use assert/strict instead.",
            },
            {
              name: "node:assert",
              message: "Please use node:assert/strict instead.",
            },
          ],
        ],
        "n/no-sync": "error",
        "n/no-unpublished-import": "warn",
        "n/prefer-global/buffer": ["error", "never"],
        "n/prefer-global/console": ["error", "always"],
        "n/prefer-global/process": ["error", "always"],
        "n/prefer-global/text-decoder": ["error", "never"],
        "n/prefer-global/text-encoder": ["error", "never"],
        "n/prefer-global/url": ["error", "never"],
        "n/prefer-global/url-search-params": ["error", "never"],
        "n/prefer-promises/dns": "error",
        "n/prefer-promises/fs": "error",
      },
    },
    {
      files: [GLOB_TS, GLOB_TSX, GLOB_DTS, GLOB_MJS],
      rules: {
        "n/no-unsupported-features/es-syntax": "off",
      },
    },
    {
      files: [GLOB_TS, GLOB_TSX, GLOB_DTS],
      rules: {
        "n/no-extraneous-import": "off",
        "n/no-missing-import": "off",
        "n/no-restricted-import": "off",
        "n/no-restricted-require": "off",
      },
    },
  ];
}
