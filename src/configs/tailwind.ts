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
        tailwindcss: pluginTailwindCSS,
        "tailwindcss-readable": pluginReadableTailwind,
      },
      rules: {
        "tailwindcss/no-contradicting-classname": "error",
        "tailwindcss/no-arbitrary-value": "off",
        "tailwindcss/no-custom-classname": "off",

        ...(stylistic === false
          ? {}
          : {
              "tailwindcss/classnames-order": "warn",
              "tailwindcss/enforces-negative-arbitrary-values": "warn",
              "tailwindcss/enforces-shorthand": "warn",
              "tailwindcss/no-unnecessary-arbitrary-value": "warn",

              "tailwindcss-readable/multiline": [
                "warn",
                {
                  group: "newLine",
                  indent: stylistic.indent,
                  printWidth: stylistic.printWidth,
                },
              ],
              "tailwindcss-readable/no-unnecessary-whitespace": "warn",
            }),

        ...overrides,
      },
    },
  ];
}
