import type { ESLint } from "eslint";

import type { FlatConfigItem } from "../types";
import { loadPackages } from "../utils";

export async function promise(): Promise<FlatConfigItem[]> {
  const [pluginPromise] = (await loadPackages(["eslint-plugin-promise"])) as [ESLint.Plugin];

  return [
    {
      name: "rs:promise",
      plugins: {
        promise: pluginPromise,
      },
      rules: {
        // "promise/avoid-new": "warn",
        "promise/no-callback-in-promise": "error",
        "promise/no-nesting": "error",
        "promise/no-new-statics": "error",
        "promise/no-promise-in-callback": "error",
        "promise/no-return-in-finally": "error",
        "promise/no-return-wrap": "error",
        "promise/param-names": "error",
        "promise/valid-params": "error",
      },
    },
  ];
}
