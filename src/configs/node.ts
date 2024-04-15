import { type ESLint } from "eslint";

import { GLOB_MJS, GLOB_TS } from "../globs";
import { type FlatConfigItem } from "../types";
import { loadPackages } from "../utils";

export async function node(options: unknown = {}): Promise<FlatConfigItem[]> {
  const [pluginNode] = (await loadPackages(["eslint-plugin-n"])) as [
    ESLint.Plugin,
  ];

  return [
    {
      name: "rs:node",
      plugins: {
        node: pluginNode,
      },
      rules: {
        "node/callback-return": "error",
        "node/exports-style": ["error", "module.exports"],
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
        "node/no-restricted-import": [
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
        "node/no-restricted-require": [
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
        "node/no-sync": "error",
        "node/no-unpublished-import": "warn",
        "node/no-unsupported-features/es-syntax": "off",
        "node/prefer-global/buffer": ["error", "never"],
        "node/prefer-global/console": ["error", "always"],
        "node/prefer-global/process": ["error", "always"],
        "node/prefer-global/text-decoder": ["error", "never"],
        "node/prefer-global/text-encoder": ["error", "never"],
        "node/prefer-global/url": ["error", "never"],
        "node/prefer-global/url-search-params": ["error", "never"],
        "node/prefer-promises/dns": "error",
        "node/prefer-promises/fs": "error",
      },
    },
    {
      files: [GLOB_TS, GLOB_MJS],
      rules: {
        "node/no-unsupported-features/es-syntax": "off",
      },
    },
  ];
}
