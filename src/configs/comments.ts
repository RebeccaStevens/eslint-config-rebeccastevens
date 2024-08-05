import type { ESLint } from "eslint";

import type { FlatConfigItem } from "../types";
import { loadPackages } from "../utils";

export async function comments(): Promise<FlatConfigItem[]> {
  const [pluginComments] = (await loadPackages([
    "eslint-plugin-eslint-comments",
  ])) as [ESLint.Plugin];

  return [
    {
      name: "rs:comments",
      plugins: {
        comments: pluginComments,
      },
      rules: {
        "comments/no-aggregating-enable": "error",
        "comments/no-duplicate-disable": "error",
        "comments/no-unlimited-disable": "error",
        "comments/no-unused-enable": "error",
        "comments/disable-enable-pair": ["error", { allowWholeFile: true }],
      },
    },
  ];
}
