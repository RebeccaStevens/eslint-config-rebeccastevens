import { GLOB_DTS, GLOB_SRC, GLOB_SRC_EXT, GLOB_TYPINGS } from "../globs";
import type { FlatConfigItem } from "../types";
import { interopDefault } from "../utils";

/**
 * Apply file-specific rule overrides for edge cases.
 *
 * Three blocks: `*.d.ts` files disable unlimited-disable, import-x/no-duplicates, and
 * no-restricted-syntax; typings files disable functional, jsdoc, and several typescript-eslint
 * rules; scripts files disable no-console, functional rules, and n rules.
 * `eslint-plugin-functional` is optional and silently skipped when not installed.
 *
 * @returns Flat config items with file-scoped rule overrides
 */
export async function overrides(): Promise<FlatConfigItem[]> {
  // The functional plugin is optional — if it isn't installed, silently skip its overrides.
  const pluginFunctional = await interopDefault(import("eslint-plugin-functional")).catch(() => {});

  return [
    {
      files: [GLOB_DTS],
      name: "rs:typescript:dts-overrides",
      rules: {
        "comments/no-unlimited-disable": "off",
        "import-x/no-duplicates": "off",
        "no-restricted-syntax": "off",
      },
    },
    {
      name: "rs:overrides-typings",
      files: [GLOB_TYPINGS],
      rules: {
        ...pluginFunctional?.configs.off.rules,

        "import-x/no-unassigned-import": "off",

        "jsdoc/check-examples": "off",
        "jsdoc/check-indentation": "off",
        "jsdoc/check-line-alignment": "off",
        "jsdoc/check-param-names": "off",
        "jsdoc/check-property-names": "off",
        "jsdoc/check-types": "off",
        "jsdoc/check-values": "off",
        "jsdoc/no-bad-blocks": "off",
        "jsdoc/no-defaults": "off",
        "jsdoc/require-asterisk-prefix": "off",
        "jsdoc/require-description": "off",
        "jsdoc/require-description-complete-sentence": "off",
        "jsdoc/require-hyphen-before-param-description": "off",
        "jsdoc/require-jsdoc": "off",
        "jsdoc/require-param-name": "off",
        "jsdoc/require-param": "off",
        "jsdoc/require-property-name": "off",
        "jsdoc/require-property": "off",
        "jsdoc/require-returns-check": "off",
        "jsdoc/require-returns": "off",
        "jsdoc/require-throws": "off",
        "jsdoc/require-yields-check": "off",
        "jsdoc/tag-lines": "off",
        "jsdoc/check-access": "off",
        "jsdoc/empty-tags": "off",
        "jsdoc/implements-on-classes": "off",
        "jsdoc/no-multi-asterisks": "off",
        "jsdoc/require-property-description": "off",
        "jsdoc/require-returns-description": "off",
        "jsdoc/check-alignment": "off",
        "jsdoc/multiline-blocks": "off",

        "@typescript-eslint/consistent-type-definitions": "off",
        "@typescript-eslint/no-empty-object-type": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": "off",
      },
    },
    {
      // GitHub requires `.github/ISSUE_TEMPLATE` exactly — suppress the filename-case rule.
      name: "rs:overrides-github",
      files: [".github/ISSUE_TEMPLATE/**"],
      rules: {
        "unicorn/filename-case": "off",
      },
    },
    {
      name: "rs:overrides-scripts",
      files: [`scripts/${GLOB_SRC}`, `cli.${GLOB_SRC_EXT}`],
      rules: {
        "no-console": "off",

        "functional/no-conditional-statements": "off",
        "functional/no-expression-statements": "off",
        "functional/no-loop-statements": "off",
        "functional/no-return-void": "off",
        "functional/no-throw-statements": "off",

        "n/no-sync": "off",
        "n/no-unpublished-import": "off",
      },
    },
  ];
}
