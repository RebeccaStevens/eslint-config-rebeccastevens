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
        yaml: pluginYaml as unknown as ESLint.Plugin,
      },
    },
    {
      files,
      languageOptions: {
        parser: parserYaml,
      },
      name: "rs:yaml:rules",
      rules: {
        "style/spaced-comment": "off",

        "yaml/block-mapping": "error",
        "yaml/block-sequence": "error",
        "yaml/no-empty-key": "error",
        "yaml/no-empty-sequence-entry": "error",
        "yaml/no-irregular-whitespace": "error",
        "yaml/plain-scalar": "error",

        "yaml/vue-custom-block/no-parsing-error": "error",

        "yaml/block-mapping-question-indicator-newline": stylisticEnforcement,
        "yaml/block-sequence-hyphen-indicator-newline": stylisticEnforcement,
        "yaml/flow-mapping-curly-newline": stylisticEnforcement,
        "yaml/flow-mapping-curly-spacing": stylisticEnforcement,
        "yaml/flow-sequence-bracket-newline": stylisticEnforcement,
        "yaml/flow-sequence-bracket-spacing": stylisticEnforcement,
        "yaml/indent": [
          stylisticEnforcement,
          typeof indent === "number"
            ? indent
            : typeof StylisticConfigDefaults.indent === "number"
              ? StylisticConfigDefaults.indent
              : 2,
        ],
        "yaml/key-spacing": stylisticEnforcement,
        "yaml/no-tab-indent": stylisticEnforcement,
        "yaml/quotes": [stylisticEnforcement, { avoidEscape: true, prefer: quotes === "backtick" ? "double" : quotes }],
        "yaml/spaced-comment": stylisticEnforcement,

        ...overrides,
      },
    },
  ];
}
