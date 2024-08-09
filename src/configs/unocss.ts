import type { ESLint } from "eslint";

import type { FlatConfigItem, OptionsUnoCSS } from "../types";
import { loadPackages } from "../utils";

export async function unocss(options: Readonly<Required<OptionsUnoCSS>>): Promise<FlatConfigItem[]> {
  const { attributify, strict } = options;

  const [pluginUnoCSS] = (await loadPackages(["@unocss/eslint-plugin"])) as [ESLint.Plugin];

  return [
    {
      name: "js:unocss",
      plugins: {
        unocss: pluginUnoCSS,
      },
      rules: {
        "unocss/order": "error",
        ...(attributify
          ? {
              "unocss/order-attributify": "error",
            }
          : {}),
        ...(strict
          ? {
              "unocss/blocklist": "error",
            }
          : {}),
      },
    },
  ];
}
