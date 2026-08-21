import { GLOB_JSX, GLOB_TSX } from "../globs";
import type { FlatConfigItem } from "../types";

/**
 * Enable JSX parsing for `.jsx` and `.tsx` files.
 *
 * Purely a parser setup config — sets `ecmaFeatures.jsx: true` in parser
 * options. No rules are applied.
 *
 * @returns Flat config item enabling JSX parsing
 */
export function jsx(): FlatConfigItem[] {
  return [
    {
      name: "rs:jsx:setup",
      files: [GLOB_JSX, GLOB_TSX],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
    },
  ];
}
