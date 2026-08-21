import type { FlatConfigItem } from "../types";
import { loadPlugins } from "../utils";

/**
 * Enforce Promise best practices via `eslint-plugin-promise`.
 *
 * Loads the plugin under the `promise` prefix and enables error-level rules
 * covering callback misuse (`no-callback-in-promise`, `no-promise-in-callback`),
 * nesting, `new` statics, `finally`/`return` misuse, and parameter validation
 * (`param-names`, `valid-params`). Takes no options.
 *
 * @returns Flat config items enabling Promise best-practice rules
 */
export async function promise(): Promise<FlatConfigItem[]> {
  const [pluginPromise] = await loadPlugins(["eslint-plugin-promise"]);

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
