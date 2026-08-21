import type { FlatConfigItem, OptionsFiles, OptionsOverrides } from "../types";
import { interopDefault, loadPlugins } from "../utils";

/**
 * Configure test file linting via `@vitest/eslint-plugin` and
 * `eslint-plugin-no-only-tests`.
 *
 * Optionally loads `eslint-plugin-functional` (silently skipped if not
 * installed) to disable functional rules in test files. Relaxes TypeScript
 * strictness (no-unsafe-*, no-unused-vars, strict-boolean-expressions) and
 * unicorn rules. Enforces vitest conventions (consistent-test-it with `it`,
 * no-identical-title, no-import-node-test, prefer-hooks-in-order,
 * prefer-lowercase-title). Disables `no-only-tests/no-only-tests` name
 * collision by using the plugin's own rule.
 *
 * @param options - Options with files and overrides
 * @returns Flat config items enabling vitest and no-only-tests rules
 */
export async function test(options: Readonly<Required<OptionsFiles & OptionsOverrides>>): Promise<FlatConfigItem[]> {
  const { files, overrides } = options;

  const [pluginVitest, pluginNoOnlyTests] = await loadPlugins(["@vitest/eslint-plugin", "eslint-plugin-no-only-tests"]);

  // The functional plugin is optional — if it isn't installed, silently skip its rules in test overrides.
  const pluginFunctional = await interopDefault(import("eslint-plugin-functional")).catch(() => {});

  return [
    {
      name: "rs:test:setup",
      plugins: {
        vitest: pluginVitest,
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
