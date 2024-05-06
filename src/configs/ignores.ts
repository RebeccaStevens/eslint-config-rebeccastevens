import { GLOB_EXCLUDE } from "../globs";
import { type FlatConfigItem, type OptionsIgnores } from "../types";

export function ignores(
  options: Readonly<{ ignores: OptionsIgnores }>,
): FlatConfigItem[] {
  const ignoresOptions = options.ignores;

  const [extend, files] = Array.isArray(ignoresOptions)
    ? [true, ignoresOptions]
    : [ignoresOptions.extend, ignoresOptions.files];

  return [
    {
      ignores: extend ? [...GLOB_EXCLUDE, ...files] : [...files],
    },
  ];
}
