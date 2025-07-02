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
              "tailwind-better/no-unnecessary-whitespace": "warn",
              "tailwind-better/enforce-consistent-class-order": [
                "error",
                {
                  order: "improved",
                },
              ],
              "tailwind-better/no-duplicate-classes": "error",
              "tailwind-better/enforce-consistent-variable-syntax": [
                "error",
                {
                  syntax: "parentheses",
                },
              ],

              "tailwind-better/no-unregistered-classes": [
                "off",
                {
                  detectComponentClasses: true,
                },
              ],
              "tailwind-better/no-conflicting-classes": "error",
              "tailwind-better/no-restricted-classes": "error",
            }),

        ...overrides,
      },
    },
  ];
}
