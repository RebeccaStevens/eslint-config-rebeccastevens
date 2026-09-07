import type { ESLint } from "eslint";

import type { FlatConfigItem, OptionsHasTypeScript, OptionsOverrides, StylisticConfig } from "../types";
import { loadPackages } from "../utils";

import { buildStylisticRules } from "./stylistic-rules";

/**
 * Default stylistic configuration: indent 2, jsx true, quotes double, semi true, printWidth 120.
 */
export const StylisticConfigDefaults: Required<StylisticConfig> = {
  indent: 2,
  jsx: true,
  quotes: "double",
  semi: true,
  printWidth: 120,
};

/**
 * Generates stylistic ESLint flat config from `@stylistic/eslint-plugin`.
 *
 * Configures indent, quotes, semicolons, and JSX formatting rules via the
 * shared rule builder (`buildStylisticRules`) also consumed by the `"eslint"`
 * formatter backend; the default profile reproduces this config's historical
 * output exactly. Disables stylistic rules when `stylistic: false`.
 *
 * @param options - Stylistic config, overrides, and TypeScript flag.
 * @returns The stylistic flat config items.
 */
export async function stylistic(
  options: Readonly<Required<{ stylistic: Required<StylisticConfig> } & OptionsOverrides & OptionsHasTypeScript>>,
): Promise<FlatConfigItem[]> {
  const {
    stylistic: { indent, jsx, quotes, semi },
    overrides,
    typescript,
  } = options;

  const [pluginStylistic] = (await loadPackages(["@stylistic/eslint-plugin"])) as [
    typeof import("@stylistic/eslint-plugin").default,
  ];

  return [
    {
      name: "rs:stylistic",
      plugins: {
        "@stylistic": pluginStylistic as ESLint.Plugin,
      },
      rules: {
        ...(await buildStylisticRules({ indent, jsx, quotes, semi, typescript })),

        ...overrides,
      },
    },
  ];
}
