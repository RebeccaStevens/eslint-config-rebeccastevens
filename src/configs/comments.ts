import type { FlatConfigItem } from "../types";
import { loadPlugins } from "../utils";

export async function comments(): Promise<FlatConfigItem[]> {
  const [pluginComments] = await loadPlugins(["@eslint-community/eslint-plugin-eslint-comments"]);

  return [
    {
      name: "rs:comments",
      plugins: {
        "eslint-comments": pluginComments,
      },
      rules: {
        "eslint-comments/no-aggregating-enable": "error",
        "eslint-comments/no-duplicate-disable": "error",
        "eslint-comments/no-unlimited-disable": "error",
        "eslint-comments/no-unused-enable": "error",
        "eslint-comments/disable-enable-pair": ["error", { allowWholeFile: true }],
      },
    },
  ];
}
