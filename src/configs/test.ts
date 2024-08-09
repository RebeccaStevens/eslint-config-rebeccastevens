import type { ESLint } from "eslint";

import type { FlatConfigItem, OptionsFiles, OptionsOverrides } from "../types";
import { interopDefault, loadPackages } from "../utils";

export async function test(options: Readonly<Required<OptionsFiles & OptionsOverrides>>): Promise<FlatConfigItem[]> {
  const { files, overrides } = options;

  const [pluginVitest, pluginNoOnlyTests] = (await loadPackages([
    "eslint-plugin-vitest",
    "eslint-plugin-no-only-tests",
  ])) as [typeof import("eslint-plugin-vitest"), ESLint.Plugin];

  const [pluginFunctional] = await Promise.all([
    interopDefault(import("eslint-plugin-functional")).catch(() => undefined),
  ]);

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

        "node/prefer-global/process": "off",
        "node/no-sync": "off",

        "import/no-named-as-default-member": "off",

        "jsdoc/require-jsdoc": "off",

        "regexp/no-super-linear-backtracking": "off",

        "sonar/no-duplicate-string": "off",
        "sonar/no-identical-functions": "off",

        "test/consistent-test-it": ["error", { fn: "it", withinDescribe: "it" }],
        "test/no-identical-title": "error",
        "test/no-import-node-test": "error",
        "test/no-only-tests": "error",
        "test/prefer-hooks-in-order": "error",
        "test/prefer-lowercase-title": "error",
        "test/valid-expect": "off", // Too many false positives.

        "ts/consistent-type-definitions": "off",
        "ts/no-unsafe-argument": "off",
        "ts/no-unsafe-assignment": "off",
        "ts/no-unsafe-call": "off",
        "ts/no-unsafe-member-access": "off",
        "ts/no-unsafe-return": "off",
        "ts/no-unused-vars": "off",
        "ts/strict-boolean-expressions": "off",

        "unicorn/consistent-function-scoping": "off",
        "unicorn/prefer-module": "off",

        ...overrides,
      },
    },
  ];
}
