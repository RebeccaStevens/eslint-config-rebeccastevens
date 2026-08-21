import type { ESLint } from "eslint";

import type { FlatConfigItem, RequiredOptionsStylistic } from "../types";
import { loadPackages } from "../utils";

/**
 * Enforce JSDoc documentation standards via `eslint-plugin-jsdoc`.
 *
 * Starts from `flat/recommended-typescript` and adds stricter checks
 * (indentation, line-alignment, param/property names, type checking). Requires
 * JSDoc on exported functions, classes, interfaces, type aliases, and enums,
 * plus `@param`, `@returns`, and `@throws` documentation. `stylistic` gates
 * alignment/multiline-block formatting rules.
 *
 * @param options - Options with stylistic
 * @returns Flat config items enabling JSDoc rules
 */
export async function jsdoc(options: Readonly<Required<RequiredOptionsStylistic>>): Promise<FlatConfigItem[]> {
  const { stylistic } = options;

  const [pluginJSDocument] = (await loadPackages(["eslint-plugin-jsdoc"])) as [typeof import("eslint-plugin-jsdoc")];

  const stylisticEnforcement = stylistic === false ? "off" : "error";

  return [
    {
      name: "rs:jsdoc",
      plugins: {
        jsdoc: pluginJSDocument as ESLint.Plugin,
      },
      rules: {
        // waiting on https://github.com/eslint/eslint/issues/14745
        // "jsdoc/check-examples": "error",
        ...(pluginJSDocument as { configs?: Record<string, { rules?: Record<string, unknown> }> }).configs?.[
          "flat/recommended-typescript"
        ]?.rules,
        "jsdoc/check-indentation": "error",
        "jsdoc/check-line-alignment": "error",
        "jsdoc/check-param-names": "error",
        "jsdoc/check-property-names": "error",
        "jsdoc/check-types": "error",
        "jsdoc/check-values": "error",
        "jsdoc/no-bad-blocks": [
          "error",
          {
            ignore: ["ts-check", "ts-expect-error", "ts-ignore", "ts-nocheck", "vue-ignore"],
          },
        ],
        "jsdoc/no-defaults": "warn",
        "jsdoc/no-undefined-types": ["error", { disableReporting: true }],
        "jsdoc/require-asterisk-prefix": "error",
        "jsdoc/require-description": "warn",
        // Rule is too strict.
        // "jsdoc/require-description-complete-sentence": "off",
        "jsdoc/require-hyphen-before-param-description": "error",
        "jsdoc/require-jsdoc": [
          "warn",
          {
            contexts: [
              ":matches(:matches(ExportDefaultDeclaration, ExportNamedDeclaration) > TSDeclareFunction, ExportDefaultDeclaration > FunctionDeclaration,:matches(ExportNamedDeclaration > FunctionDeclaration):not(ExportNamedDeclaration:has(TSDeclareFunction) + ExportNamedDeclaration > FunctionDeclaration))",
              ":matches(ExportDefaultDeclaration, ExportNamedDeclaration) > TSTypeAliasDeclaration",
              ":matches(ExportDefaultDeclaration, ExportNamedDeclaration) > TSInterfaceDeclaration",
              ":matches(ExportDefaultDeclaration, ExportNamedDeclaration) > TSEnumDeclaration",
            ],
            enableFixer: false,
            require: {
              FunctionDeclaration: false,
            },
          },
        ],
        "jsdoc/require-param-name": "error",
        // "jsdoc/require-param": "off",
        "jsdoc/require-property-name": "error",
        // "jsdoc/require-property": "off",
        "jsdoc/require-returns-check": "error",
        // "jsdoc/require-returns": "off",
        "jsdoc/require-throws": "warn",
        "jsdoc/require-yields-check": "error",
        "jsdoc/tag-lines": [
          "warn",
          "never",
          {
            applyToEndTag: false,
            startLines: 1,
            tags: { example: { lines: "always" } },
          },
        ],

        "jsdoc/check-access": "warn",
        "jsdoc/empty-tags": "warn",
        "jsdoc/implements-on-classes": "warn",
        "jsdoc/no-multi-asterisks": "warn",
        "jsdoc/require-property-description": "warn",
        "jsdoc/require-returns-description": "warn",

        "jsdoc/check-alignment": stylisticEnforcement,
        "jsdoc/multiline-blocks": stylisticEnforcement,
      },
    },
  ];
}
