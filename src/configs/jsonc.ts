import type { ESLint } from "eslint";

import type { FlatConfigItem, OptionsFiles, OptionsOverrides, RequiredOptionsStylistic } from "../types";
import { loadPackages } from "../utils";

export async function jsonc(
  options: Readonly<Required<OptionsFiles & RequiredOptionsStylistic & OptionsOverrides>>,
): Promise<FlatConfigItem[]> {
  const { files, overrides, stylistic } = options;

  const { indent = 2 } = typeof stylistic === "boolean" ? {} : stylistic;

  const [pluginJsonc, parserJsonc] = (await loadPackages(["eslint-plugin-jsonc", "jsonc-eslint-parser"])) as [
    ESLint.Plugin,
    typeof import("jsonc-eslint-parser"),
  ];

  const stylisticEnforcement = stylistic === false ? "off" : "error";

  return [
    {
      name: "rs:jsonc:setup",
      plugins: {
        jsonc: pluginJsonc,
      },
    },
    {
      name: "rs:jsonc:rules",
      files,
      languageOptions: {
        parser: parserJsonc,
      },
      rules: {
        "jsonc/no-bigint-literals": "error",
        "jsonc/no-binary-expression": "error",
        "jsonc/no-binary-numeric-literals": "error",
        "jsonc/no-dupe-keys": "error",
        "jsonc/no-escape-sequence-in-identifier": "error",
        "jsonc/no-floating-decimal": "error",
        "jsonc/no-hexadecimal-numeric-literals": "error",
        "jsonc/no-infinity": "error",
        "jsonc/no-multi-str": "error",
        "jsonc/no-nan": "error",
        "jsonc/no-number-props": "error",
        "jsonc/no-numeric-separators": "error",
        "jsonc/no-octal": "error",
        "jsonc/no-octal-escape": "error",
        "jsonc/no-octal-numeric-literals": "error",
        "jsonc/no-parenthesized": "error",
        "jsonc/no-plus-sign": "error",
        "jsonc/no-regexp-literals": "error",
        "jsonc/no-sparse-arrays": "error",
        "jsonc/no-template-literals": "error",
        "jsonc/no-undefined-value": "error",
        "jsonc/no-unicode-codepoint-escapes": "error",
        "jsonc/no-useless-escape": "error",
        "jsonc/space-unary-ops": "error",
        "jsonc/valid-json-number": "error",
        "jsonc/vue-custom-block/no-parsing-error": "error",

        "jsonc/array-bracket-spacing": [stylisticEnforcement, "never"],
        "jsonc/comma-dangle": [stylisticEnforcement, "never"],
        "jsonc/comma-style": [stylisticEnforcement, "last"],
        "jsonc/indent": [
          stylisticEnforcement,
          ...(Array.isArray(indent) ? (indent as [number | "tab", any]) : ([indent] as const)),
        ],
        "jsonc/key-spacing": [stylisticEnforcement, { afterColon: true, beforeColon: false }],
        "jsonc/object-curly-newline": [stylisticEnforcement, { consistent: true, multiline: true }],
        "jsonc/object-curly-spacing": [stylisticEnforcement, "always"],
        "jsonc/object-property-newline": [stylisticEnforcement, { allowMultiplePropertiesPerLine: true }],
        "jsonc/quote-props": stylisticEnforcement,
        "jsonc/quotes": stylisticEnforcement,

        ...overrides,
      },
    },
  ];
}
