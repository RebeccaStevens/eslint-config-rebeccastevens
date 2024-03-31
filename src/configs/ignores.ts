import { GLOB_EXCLUDE } from "../globs";
import { type FlatConfigItem, type OptionsIgnores } from "../types";

export function ignores(options: Readonly<OptionsIgnores>): FlatConfigItem[] {
  const [extend, files] =
    options === undefined || Array.isArray(options)
      ? [true, options ?? []]
      : [options.extend ?? true, options.files ?? []];

  const ignores = extend ? [...GLOB_EXCLUDE, ...files] : [...files];

  return [
    {
      ignores,
    },
  ];
}
