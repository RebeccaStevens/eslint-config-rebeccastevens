import type { ESLint } from "eslint";

import type { FlatConfigItem, OptionsTailwindCSS } from "../types";
import { loadPackages } from "../utils";

export async function tailwind(options: Readonly<Required<OptionsTailwindCSS>>): Promise<FlatConfigItem[]> {
  const { overrides } = options;

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
        "tailwindcss/classnames-order": "warn",
        "tailwindcss/enforces-negative-arbitrary-values": "warn",
        "tailwindcss/enforces-shorthand": "warn",
        "tailwindcss/no-arbitrary-value": "off",
        "tailwindcss/no-custom-classname": "off",
        "tailwindcss/no-contradicting-classname": "error",
        "tailwindcss/no-unnecessary-arbitrary-value": "warn",

        "tailwindcss-readable/multiline": "warn",
        "tailwindcss-readable/no-unnecessary-whitespace": "warn",

        ...overrides,
      },
    },
  ];
}
