import { type ESLint, type Linter } from "eslint";

import { GLOB_TOML } from "../globs";
import {
  type FlatConfigItem,
  type OptionsFiles,
  type OptionsOverrides,
  type OptionsStylistic,
} from "../types";
import { loadPackages } from "../utils";

export async function toml(
  options: Readonly<OptionsOverrides & OptionsStylistic & OptionsFiles>,
): Promise<FlatConfigItem[]> {
  const { files = [GLOB_TOML], overrides = {}, stylistic = true } = options;

  const { indent = 2 } = typeof stylistic === "boolean" ? {} : stylistic;

  const [pluginToml, parserToml] = (await loadPackages([
    "eslint-plugin-toml",
    "toml-eslint-parser",
  ])) as [ESLint.Plugin, Linter.FlatConfigParserModule];

  return [
    {
      name: "rs:toml:setup",
      plugins: {
        toml: pluginToml,
      },
    },
    {
      files,
      languageOptions: {
        parser: parserToml,
      },
      name: "rs:toml:rules",
      rules: {
        "style/spaced-comment": "off",

        "toml/comma-style": "error",
        "toml/keys-order": "error",
        "toml/no-space-dots": "error",
        "toml/no-unreadable-number-separator": "error",
        "toml/precision-of-fractional-seconds": "error",
        "toml/precision-of-integer": "error",
        "toml/tables-order": "error",

        "toml/vue-custom-block/no-parsing-error": "error",

        ...(stylistic === false
          ? {}
          : {
              "toml/array-bracket-newline": "error",
              "toml/array-bracket-spacing": "error",
              "toml/array-element-newline": "error",
              "toml/indent": ["error", indent === "tab" ? 2 : indent],
              "toml/inline-table-curly-spacing": "error",
              "toml/key-spacing": "error",
              "toml/padding-line-between-pairs": "error",
              "toml/padding-line-between-tables": "error",
              "toml/quoted-keys": "error",
              "toml/spaced-comment": "error",
              "toml/table-bracket-spacing": "error",
            }),

        ...overrides,
      },
    },
  ];
}
