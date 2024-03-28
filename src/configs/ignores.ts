import { GLOB_EXCLUDE } from "../globs";
import { type FlatConfigItem } from "../types";

export function ignores(): FlatConfigItem[] {
  return [
    {
      ignores: GLOB_EXCLUDE,
    },
  ];
}
