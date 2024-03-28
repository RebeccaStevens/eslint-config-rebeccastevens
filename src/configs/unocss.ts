import { type ESLint } from "eslint";

import { type FlatConfigItem, type OptionsUnoCSS } from "../types";
import { loadPackages } from "../utils";

export async function unocss(
  options: OptionsUnoCSS = {},
): Promise<FlatConfigItem[]> {
  const { attributify = true, strict = true } = options;

  const [pluginUnoCSS] = (await loadPackages(["@unocss/eslint-plugin"])) as [
    ESLint.Plugin,
  ];

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
