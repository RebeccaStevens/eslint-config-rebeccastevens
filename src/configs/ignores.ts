import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";

import { GLOB_EXCLUDE } from "../globs";
import type { FlatConfigItem, OptionsIgnoreFiles, OptionsIgnores, OptionsProjectRoot } from "../types";
import { loadPackages } from "../utils";

export async function ignores(
  options: Readonly<{ ignores: OptionsIgnores } & OptionsProjectRoot & OptionsIgnoreFiles>,
): Promise<FlatConfigItem[]> {
  const { ignoreFiles, ignores: ignoresOptions, projectRoot } = options;

  const includeIgnoreFile =
    ignoreFiles.length === 0
      ? undefined
      : // eslint-disable-next-line ts/no-deprecated
        await loadPackages(["@eslint/compat"]).then(([p]) => (p as typeof import("@eslint/compat")).includeIgnoreFile);

  const [extend, files] = Array.isArray(ignoresOptions)
    ? [true, ignoresOptions]
    : [ignoresOptions.extend, ignoresOptions.files];

  const ignoreConfig = {
    ignores: extend ? [...GLOB_EXCLUDE, ...files] : [...files],
  };

  const ignoreFileConfigs = await Promise.all(
    ignoreFiles.map((file) => {
      assert.ok(includeIgnoreFile !== undefined);
      const filePath = path.resolve(projectRoot, file);
      return (
        fs
          .access(filePath)
          // eslint-disable-next-line ts/no-deprecated
          .then(() => includeIgnoreFile(filePath))
          .catch(() => {
            console.warn(`Ignore file "${filePath}" not found.`);
            return null;
          })
      );
    }),
  );

  return [ignoreConfig, ...ignoreFileConfigs.filter(<T>(v: T | null): v is T => v !== null)];
}
