import { GLOB_DTS, GLOB_MJS, GLOB_TS, GLOB_TSX } from "../globs";
import type { FlatConfigItem, OptionsOverrides, OptionsSecurity } from "../types";
import { detectNodeVersion, loadPlugins } from "../utils";

/**
 * Manage Node.js-specific linting via `eslint-plugin-n`.
 *
 * Uses `flat/recommended-module` base rules, disallows `node:assert` in favor
 * of `node:assert/strict`, and enforces global `URL`/`URLSearchParams` over
 * `require("url")`. Security rules respect `securitySeverity`. Detects the
 * Node version from `.nvmrc`/`.node-version`/`package.json` engines to apply
 * version-specific overrides; TS/ESM files get syntax and import resolution relaxations.
 *
 * @param options - Options with user rule overrides, optional projectRoot, and optional securitySeverity
 * @returns Flat config items enabling Node.js rules
 */
export async function node(
  options: OptionsOverrides & { projectRoot?: string; securitySeverity?: OptionsSecurity["severity"] } = {},
): Promise<FlatConfigItem[]> {
  const { projectRoot = process.cwd(), securitySeverity = "moderate" } = options;
  const [pluginNode] = await loadPlugins(["eslint-plugin-n"]);

  const mut_version = await detectNodeVersion(projectRoot);

  const securityRuleLevel = securitySeverity === "none" ? "off" : securitySeverity === "lite" ? "warn" : "error";

  return [
    {
      name: "rs:node",
      plugins: {
        n: pluginNode,
      },
      rules: {
        ...(pluginNode as { configs?: Record<string, { rules?: Record<string, unknown> }> }).configs?.[
          "flat/recommended-module"
        ]?.rules,
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
        "n/no-new-require": securityRuleLevel,
        "n/no-path-concat": securityRuleLevel,
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
      name: "rs:node:es-syntax-overrides",
      files: [GLOB_TS, GLOB_TSX, GLOB_DTS, GLOB_MJS],
      rules: {
        "n/no-unsupported-features/es-syntax": "off",
      },
    },
    {
      name: "rs:node:typescript-overrides",
      files: [GLOB_TS, GLOB_TSX, GLOB_DTS],
      rules: {
        "n/no-extraneous-import": "off",
        // "n/no-missing-import" is already "off" in the base config above.
        "n/no-restricted-import": "off",
        "n/no-restricted-require": "off",
      },
    },
    ...(mut_version.length > 0
      ? [
          {
            name: "rs:node:version-override-non-src",
            ignores: ["src/**", "**/src/**"],
            settings: {
              node: {
                version: `>=${mut_version}`,
              },
            },
          },
        ]
      : []),
  ];
}
