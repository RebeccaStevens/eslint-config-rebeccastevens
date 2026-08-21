import type { FlatConfigItem, RequiredOptionsStylistic, RequiredOptionsTailwindCSS } from "../types";
import { loadPlugins } from "../utils";

/**
 * Enforce Tailwind CSS best practices via `eslint-plugin-better-tailwindcss`.
 *
 * Auto-configures by Tailwind version: v4 uses `entryPoint`, v3 uses
 * `tailwindConfig`. Core rules: no-unknown-classes (off, with
 * detectComponentClasses), no-conflicting-classes, no-restricted-classes.
 * When `stylistic` is enabled, adds formatting rules (consistent line wrapping,
 * class order, variable syntax shorthand, canonical classes, no-duplicate-classes,
 * no-deprecated-classes, no-unnecessary-whitespace).
 *
 * @param options - Options with overrides, stylistic, tailwindVersion, tailwindEntryPoint, and tailwindConfig
 * @returns Flat config items enabling Tailwind CSS rules
 */
export async function tailwind(
  options: Readonly<Required<RequiredOptionsTailwindCSS> & RequiredOptionsStylistic>,
): Promise<FlatConfigItem[]> {
  const { overrides, stylistic, tailwindVersion, tailwindEntryPoint, tailwindConfig } = options;

  const [pluginBetterTailwind] = await loadPlugins(["eslint-plugin-better-tailwindcss"]);

  return [
    {
      name: "rs:tailwind-better",
      plugins: {
        "tailwind-better": pluginBetterTailwind,
      },
      settings: {
        "better-tailwindcss":
          tailwindVersion === 4
            ? {
                entryPoint: tailwindEntryPoint,
              }
            : {
                tailwindConfig,
              },
      },
      rules: {
        "tailwind-better/no-unknown-classes": [
          "off",
          {
            detectComponentClasses: true,
          },
        ],
        "tailwind-better/no-conflicting-classes": "error",
        "tailwind-better/no-restricted-classes": "error",

        ...(stylistic !== false && {
          "tailwind-better/enforce-consistent-line-wrapping": [
            "error",
            {
              classesPerLine: 0,
              group: "newLine",
              indent: stylistic.indent,
              lineBreakStyle: "unix",
              preferSingleLine: false,
              printWidth: stylistic.printWidth,
            },
          ],
          "tailwind-better/enforce-consistent-class-order": [
            "error",
            {
              order: "strict",
              detectComponentClasses: true,
              componentClassOrder: "preserve",
              componentClassPosition: "start",
              unknownClassOrder: "preserve",
              unknownClassPosition: "start",
            },
          ],
          "tailwind-better/enforce-consistent-variable-syntax": [
            "error",
            {
              syntax: "shorthand",
            },
          ],
          "tailwind-better/enforce-consistent-important-position": "off",
          "tailwind-better/enforce-shorthand-classes": "off",
          "tailwind-better/enforce-canonical-classes": "error",

          "tailwind-better/no-duplicate-classes": "error",
          "tailwind-better/no-deprecated-classes": "warn",
          "tailwind-better/no-unnecessary-whitespace": "warn",
        }),

        ...overrides,
      },
    },
  ];
}
