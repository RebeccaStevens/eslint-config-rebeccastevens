import type { ESLint } from "eslint";

import type { FlatConfigItem, OptionsFiles, OptionsOverrides, RequiredOptionsStylistic } from "../types";
import { loadPackages } from "../utils";

import { StylisticConfigDefaults } from "./stylistic";

export async function yaml(
  options: Readonly<Required<OptionsOverrides & RequiredOptionsStylistic & OptionsFiles>>,
): Promise<FlatConfigItem[]> {
  const { files, overrides, stylistic } = options;

  const { indent = StylisticConfigDefaults.indent, quotes = "single" } =
    typeof stylistic === "boolean" ? {} : stylistic;

  const [pluginYaml, parserYaml] = (await loadPackages(["eslint-plugin-yml", "yaml-eslint-parser"])) as [
    typeof import("eslint-plugin-yml"),
    typeof import("yaml-eslint-parser"),
  ];

  const stylisticEnforcement = stylistic === false ? "off" : "error";

  return [
    {
      name: "rs:yaml:setup",
      plugins: {
        yml: pluginYaml as unknown as ESLint.Plugin,
      },
    },
    {
      files,
      languageOptions: {
        parser: parserYaml,
      },
      name: "rs:yaml:rules",
      rules: {
        "@stylistic/spaced-comment": "off",

        "yml/block-mapping": "error",
        "yml/block-sequence": "error",
        "yml/no-empty-key": "error",
        "yml/no-empty-sequence-entry": "error",
        "yml/no-irregular-whitespace": "error",
        "yml/plain-scalar": "error",

        "yml/vue-custom-block/no-parsing-error": "error",

        "yml/block-mapping-question-indicator-newline": stylisticEnforcement,
        "yml/block-sequence-hyphen-indicator-newline": stylisticEnforcement,
        "yml/flow-mapping-curly-newline": stylisticEnforcement,
        "yml/flow-mapping-curly-spacing": stylisticEnforcement,
        "yml/flow-sequence-bracket-newline": stylisticEnforcement,
        "yml/flow-sequence-bracket-spacing": stylisticEnforcement,
        "yml/indent": [
          stylisticEnforcement,
          typeof indent === "number"
            ? indent
            : typeof StylisticConfigDefaults.indent === "number"
              ? StylisticConfigDefaults.indent
              : 2,
        ],
        "yml/key-spacing": stylisticEnforcement,
        "yml/no-tab-indent": stylisticEnforcement,
        "yml/quotes": [stylisticEnforcement, { avoidEscape: true, prefer: quotes === "backtick" ? "double" : quotes }],
        "yml/spaced-comment": stylisticEnforcement,

        ...overrides,
      },
    },
  ];
}
