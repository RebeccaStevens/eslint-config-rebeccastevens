import type { ESLint } from "eslint";

import type { FlatConfigItem, RequiredOptionsStylistic, RequiredOptionsTailwindCSS } from "../types";
import { loadPackages } from "../utils";

export async function tailwind(
  options: Readonly<Required<RequiredOptionsTailwindCSS> & RequiredOptionsStylistic>,
): Promise<FlatConfigItem[]> {
  const { overrides, stylistic, tailwindVersion, tailwindEntryPoint, tailwindConfig } = options;

  const [pluginBetterTailwind] = (await loadPackages(["eslint-plugin-better-tailwindcss"])) as [ESLint.Plugin];

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
            : // eslint-disable-next-line ts/no-unnecessary-condition
              tailwindVersion === 3
              ? {
                  tailwindConfig,
                }
              : undefined,
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

        ...(stylistic === false
          ? {}
          : {
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
