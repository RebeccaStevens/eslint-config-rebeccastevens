import type { Linter } from "eslint";

import type { FlatConfigItem, OptionsOverrides } from "../types";
import { loadPlugins } from "../utils";

/**
 * Enable `eslint-plugin-perfectionist` with the `recommended-natural` preset.
 *
 * Object, class, interface, JSX prop, enum, set, map, and array-include sorting
 * rules are disabled to relax strictness; `import/order` is turned off to avoid
 * conflicting with the imports config.
 *
 * @param options - Options with user rule overrides
 * @returns Flat config items enabling perfectionist sorting rules
 */
export async function perfectionist(options: OptionsOverrides = {}): Promise<FlatConfigItem[]> {
  const { overrides = {} } = options;
  const [pluginPerfectionist] = await loadPlugins(["eslint-plugin-perfectionist"]);

  const recommendedNatural = pluginPerfectionist.configs?.["recommended-natural"] as Linter.Config | undefined;

  return [
    {
      name: "rs:perfectionist",
      plugins: {
        perfectionist: pluginPerfectionist,
      },
      rules: {
        ...recommendedNatural?.rules,

        // Relaxing the strictness per user request
        "perfectionist/sort-objects": "off",
        "perfectionist/sort-classes": "off",
        "perfectionist/sort-interfaces": "off",
        "perfectionist/sort-jsx-props": "off",
        "perfectionist/sort-enums": "off",
        "perfectionist/sort-sets": "off",
        "perfectionist/sort-maps": "off",
        "perfectionist/sort-array-includes": "off",

        ...overrides,
      },
    },
    {
      name: "rs:perfectionist:imports",
      rules: {
        "import/order": "off",
      },
    },
  ];
}
