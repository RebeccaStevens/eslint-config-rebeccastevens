import type { ESLint, Linter } from "eslint";

import type { FlatConfigItem, OptionsFiles, OptionsOverrides, RequiredOptionsStylistic } from "../types";
import { loadPackages } from "../utils";

import { StylisticConfigDefaults } from "./stylistic";

/**
 * Enable TOML linting via `eslint-plugin-toml` and `toml-eslint-parser`.
 *
 * Enforces structure error rules (e.g. `comma-style`, `keys-order`, `tables-order`,
 * `precision-of-fractional-seconds`). Stylistic rules like `indent`, `key-spacing`, and
 * padding-line rules are enabled only when `stylistic` is not `false`.
 *
 * @param options - Options with `files`, `overrides`, and `stylistic`
 * @returns Flat config items enabling toml rules
 */
export async function toml(
  options: Readonly<Required<OptionsOverrides & RequiredOptionsStylistic & OptionsFiles>>,
): Promise<FlatConfigItem[]> {
  const { files, overrides, stylistic } = options;

  const { indent = StylisticConfigDefaults.indent } = typeof stylistic === "boolean" ? {} : stylistic;

  const [pluginToml, parserToml] = (await loadPackages(["eslint-plugin-toml", "toml-eslint-parser"])) as [
    ESLint.Plugin,
    Linter.Parser,
  ];

  const stylisticEnforcement = stylistic === false ? "off" : "error";

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
        "@stylistic/spaced-comment": "off",

        "toml/comma-style": "error",
        "toml/keys-order": "error",
        "toml/no-space-dots": "error",
        "toml/no-unreadable-number-separator": "error",
        "toml/precision-of-fractional-seconds": "error",
        "toml/precision-of-integer": "error",
        "toml/tables-order": "error",

        "toml/vue-custom-block/no-parsing-error": "error",

        "toml/array-bracket-newline": stylisticEnforcement,
        "toml/array-bracket-spacing": stylisticEnforcement,
        "toml/array-element-newline": stylisticEnforcement,
        "toml/indent": [stylisticEnforcement, typeof indent === "number" ? indent : StylisticConfigDefaults.indent],
        "toml/inline-table-curly-spacing": stylisticEnforcement,
        "toml/key-spacing": stylisticEnforcement,
        "toml/padding-line-between-pairs": stylisticEnforcement,
        "toml/padding-line-between-tables": stylisticEnforcement,
        "toml/quoted-keys": stylisticEnforcement,
        "toml/spaced-comment": stylisticEnforcement,
        "toml/table-bracket-spacing": stylisticEnforcement,

        ...overrides,
      },
    },
  ];
}
