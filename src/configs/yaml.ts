import { type ESLint } from "eslint";

import { GLOB_YAML } from "../globs";
import {
  type FlatConfigItem,
  type OptionsFiles,
  type OptionsOverrides,
  type OptionsStylistic,
} from "../types";
import { loadPackages } from "../utils";

export async function yaml(
  options: Readonly<OptionsOverrides & OptionsStylistic & OptionsFiles>,
): Promise<FlatConfigItem[]> {
  const { files = [GLOB_YAML], overrides = {}, stylistic = true } = options;

  const { indent = 2, quotes = "single" } =
    typeof stylistic === "boolean" ? {} : stylistic;

  const [pluginYaml, parserYaml] = (await loadPackages([
    "eslint-plugin-yml",
    "yaml-eslint-parser",
  ])) as [
    typeof import("eslint-plugin-yml"),
    typeof import("yaml-eslint-parser"),
  ];

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

        ...(stylistic === false
          ? {}
          : {
              "yaml/block-mapping-question-indicator-newline": "error",
              "yaml/block-sequence-hyphen-indicator-newline": "error",
              "yaml/flow-mapping-curly-newline": "error",
              "yaml/flow-mapping-curly-spacing": "error",
              "yaml/flow-sequence-bracket-newline": "error",
              "yaml/flow-sequence-bracket-spacing": "error",
              "yaml/indent": ["error", indent === "tab" ? 2 : indent],
              "yaml/key-spacing": "error",
              "yaml/no-tab-indent": "error",
              "yaml/quotes": ["error", { avoidEscape: true, prefer: quotes }],
              "yaml/spaced-comment": "error",
            }),

        ...overrides,
      },
    },
  ];
}
