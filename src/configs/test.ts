import { type ESLint } from "eslint";

import { GLOB_TESTS } from "../globs";
import {
  type FlatConfigItem,
  type OptionsFiles,
  type OptionsIsInEditor,
  type OptionsOverrides,
} from "../types";
import { loadPackages } from "../utils";

export async function test(
  options: OptionsFiles & OptionsIsInEditor & OptionsOverrides = {},
): Promise<FlatConfigItem[]> {
  const { files = GLOB_TESTS, isInEditor = false, overrides = {} } = options;

  const [pluginVitest, pluginNoOnlyTests] = (await loadPackages([
    "eslint-plugin-vitest",
    "eslint-plugin-no-only-tests",
  ])) as [typeof import("eslint-plugin-vitest"), ESLint.Plugin];

  return [
    {
      name: "rs:test:setup",
      plugins: {
        test: {
          ...pluginVitest,
          rules: {
            ...(pluginVitest as ESLint.Plugin).rules,
            ...pluginNoOnlyTests.rules,
          },
        },
      },
    },
    {
      files,
      name: "rs:test:rules",
      rules: {
        "node/prefer-global/process": "off",

        "test/consistent-test-it": [
          "error",
          { fn: "it", withinDescribe: "it" },
        ],
        "test/no-identical-title": "error",
        "test/no-import-node-test": "error",
        "test/no-only-tests": isInEditor ? "off" : "error",
        "test/prefer-hooks-in-order": "error",
        "test/prefer-lowercase-title": "error",

        ...overrides,
      },
    },
  ];
}
