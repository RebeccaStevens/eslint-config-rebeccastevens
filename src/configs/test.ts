import type { ESLint } from "eslint";

import type { FlatConfigItem, OptionsFiles, OptionsOverrides } from "../types";
import { interopDefault, loadPackages } from "../utils";

export async function test(options: Readonly<Required<OptionsFiles & OptionsOverrides>>): Promise<FlatConfigItem[]> {
  const { files, overrides } = options;

  const [pluginVitest, pluginNoOnlyTests] = (await loadPackages([
    "@vitest/eslint-plugin",
    "eslint-plugin-no-only-tests",
  ])) as [typeof import("@vitest/eslint-plugin"), ESLint.Plugin];

  const [pluginFunctional] = await Promise.all([
    interopDefault(import("eslint-plugin-functional")).catch(() => undefined),
  ]);

  return [
    {
      name: "rs:test:setup",
      plugins: {
        vitest: pluginVitest as ESLint.Plugin,
        "no-only-tests": pluginNoOnlyTests,
      },
      settings: {
        vitest: {
          typecheck: true,
        },
      },
    },
    {
      files,
      name: "rs:test:rules",
      rules: {
        ...pluginFunctional?.configs.off.rules,

        "n/prefer-global/process": "off",
        "n/no-sync": "off",

        "import-x/no-named-as-default-member": "off",

        "jsdoc/require-jsdoc": "off",

        "regexp/no-super-linear-backtracking": "off",

        "sonarjs/no-duplicate-string": "off",
        "sonarjs/no-identical-functions": "off",

        "vitest/consistent-test-it": ["error", { fn: "it", withinDescribe: "it" }],
        "vitest/no-identical-title": "error",
        "vitest/no-import-node-test": "error",
        "vitest/prefer-hooks-in-order": "error",
        "vitest/prefer-lowercase-title": "error",
        "vitest/valid-expect": "off", // Too many false positives.

        "no-only-tests/no-only-tests": "error",

        "@typescript-eslint/consistent-type-definitions": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/strict-boolean-expressions": "off",

        "unicorn/consistent-function-scoping": "off",
        "unicorn/prefer-module": "off",

        ...overrides,
      },
    },
  ];
}
