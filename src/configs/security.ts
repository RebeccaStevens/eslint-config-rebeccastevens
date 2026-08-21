import type { Linter } from "eslint";

import type { FlatConfigItem, OptionsSecurity } from "../types";
import { loadPlugins } from "../utils";

/**
 * Enable `eslint-plugin-security` with configurable severity.
 *
 * `severity: "moderate"` (default) and lower turns off `security/detect-object-injection`
 * due to frequent false positives with standard object indexing, and
 * `security/detect-non-literal-fs-filename`.
 * `security/detect-unsafe-regex` is disabled in favor of `regexp/no-super-linear-backtracking`.
 *
 * @param options - Options with severity and user rule overrides
 * @returns Flat config items enabling security rules
 */
export async function security(options: OptionsSecurity = {}): Promise<FlatConfigItem[]> {
  const { overrides = {}, severity = "moderate" } = options;

  if (severity === "none") {
    return [];
  }

  const [pluginSecurity] = await loadPlugins(["eslint-plugin-security"]);

  const recommended = pluginSecurity.configs?.["recommended"] as Linter.Config | undefined;

  const baseRules =
    severity === "lite"
      ? recommended?.rules
      : Object.fromEntries(Object.keys(recommended?.rules ?? {}).map((key) => [key, "error"]));

  return [
    {
      name: "rs:security",
      plugins: {
        security: pluginSecurity,
      },
      rules: {
        ...baseRules,
        "security/detect-unsafe-regex": "off",
        ...(severity === "strict"
          ? {}
          : {
              "security/detect-non-literal-fs-filename": "off",
              "security/detect-object-injection": "off",
            }),
        ...overrides,
      },
    },
  ];
}
