import type { ESLint } from "eslint";

import type { FlatConfigItem, OptionsTailwindCSS, RequiredOptionsStylistic } from "../types";
import { loadPackages } from "../utils";

export async function tailwind(
  options: Readonly<Required<OptionsTailwindCSS> & RequiredOptionsStylistic>,
): Promise<FlatConfigItem[]> {
  const { overrides, stylistic } = options;

  const [pluginTailwindCSS, pluginReadableTailwind] = (await loadPackages([
    "eslint-plugin-tailwindcss",
    "eslint-plugin-readable-tailwind",
  ])) as [ESLint.Plugin, ESLint.Plugin];

  return [
    {
      name: "js:tailwindcss",
      plugins: {
        tailwind: pluginTailwindCSS,
        "tailwind-readable": pluginReadableTailwind,
      },
      rules: {
        "tailwind/no-contradicting-classname": "error",
        "tailwind/no-arbitrary-value": "off",
        "tailwind/no-custom-classname": "off",

        ...(stylistic === false
          ? {}
          : {
              "tailwind/classnames-order": "warn",
              "tailwind/enforces-negative-arbitrary-values": "warn",
              "tailwind/enforces-shorthand": "warn",
              "tailwind/no-unnecessary-arbitrary-value": "warn",

              "tailwind-readable/multiline": [
                "warn",
                {
                  group: "newLine",
                  indent: stylistic.indent,
                  printWidth: stylistic.printWidth,
                },
              ],
              "tailwind-readable/no-unnecessary-whitespace": "warn",
            }),

        ...overrides,
      },
    },
  ];
}
