import type { FlatConfigItem } from "../types";
import { loadPlugins } from "../utils";

/**
 * Enable `eslint-plugin-command` (inline `// command:` directives).
 *
 * @returns Flat config items enabling the `command/command` rule
 */
export async function command(): Promise<FlatConfigItem[]> {
  const [pluginCommand] = await loadPlugins(["eslint-plugin-command"]);

  return [
    {
      name: "rs:command",
      plugins: {
        command: pluginCommand,
      },
      rules: {
        "command/command": "error",
      },
    },
  ];
}
