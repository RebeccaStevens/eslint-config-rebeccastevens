import type { FlatConfigItem, OptionsUnoCSS } from "../types";
import { loadPlugins } from "../utils";

export async function unocss(options: Readonly<Required<OptionsUnoCSS>>): Promise<FlatConfigItem[]> {
  const { attributify, strict } = options;

  const [pluginUnoCSS] = await loadPlugins(["@unocss/eslint-plugin"]);

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
