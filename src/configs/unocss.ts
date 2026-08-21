import type { FlatConfigItem, OptionsUnoCSS } from "../types";
import { loadPlugins } from "../utils";

/**
 * Enable UnoCSS linting via `@unocss/eslint-plugin`.
 *
 * `unocss/order` is always enabled; `unocss/order-attributify` is enabled when `attributify`
 * is true, and `unocss/blocklist` when `strict` is true. Simple config — no parser or
 * stylistic options.
 *
 * @param options - Options with `attributify` and `strict`
 * @returns Flat config item enabling unocss rules
 */
export async function unocss(options: Readonly<Required<OptionsUnoCSS>>): Promise<FlatConfigItem[]> {
  const { attributify, strict } = options;

  const [pluginUnoCSS] = await loadPlugins(["@unocss/eslint-plugin"]);

  return [
    {
      name: "rs:unocss",
      plugins: {
        unocss: pluginUnoCSS,
      },
      rules: {
        "unocss/order": "error",
        ...(attributify && {
          "unocss/order-attributify": "error",
        }),
        ...(strict && {
          "unocss/blocklist": "error",
        }),
      },
    },
  ];
}
