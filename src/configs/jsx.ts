import { GLOB_JSX, GLOB_TSX } from "../globs";
import type { FlatConfigItem } from "../types";

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
