import { type ESLint } from "eslint";

import { type FlatConfigItem } from "../types";
import { loadPackages } from "../utils";

export async function comments(
  options: unknown = {},
): Promise<FlatConfigItem[]> {
  const [pluginComments] = (await loadPackages([
    "eslint-plugin-eslint-comments",
  ])) as [ESLint.Plugin];

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
        "eslint-comments/disable-enable-pair": [
          "error",
          { allowWholeFile: true },
        ],
      },
    },
  ];
}
