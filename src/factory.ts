import type { Linter } from "eslint";

import { assembleConfigs } from "./assembly";
import type { Awaitable, FlatConfigItem, OptionsConfig } from "./types";
import { loadPackages } from "./utils";

export { getOverrides, resolveSubOptions } from "./assembly";
export type { ResolvedOptions } from "./assembly";

export const defaultPluginRenaming = {
  "@intlify/vue-i18n": "vue-i18n",
  "@stylistic": "style",
  "@typescript-eslint": "ts",
  "eslint-comments": "comments",
  "import-x": "import",
  n: "node",
  "optimize-regex": "regexp",
  sonarjs: "sonar",
  vitest: "test",
  yml: "yaml",
};

/**
 * Construct an array of ESLint flat config items.
 *
 * @param {OptionsConfig & FlatConfigItem} options - The options for generating the ESLint configurations.
 * @param {Awaitable<FlatConfigItem | FlatConfigItem[]>[]} userConfigs - The user configurations to be merged with the generated configurations.
 * @returns {Promise<FlatConfigItem[]>} The merged ESLint configurations.
 */
export async function rsEslint(
  options: OptionsConfig,
  ...userConfigs: ReadonlyArray<Awaitable<FlatConfigItem | FlatConfigItem[]>>
): Promise<Linter.Config[]> {
  const [FlatConfigComposer] = await loadPackages(["eslint-flat-config-utils"]).then(
    ([a]) => [(a as typeof import("eslint-flat-config-utils")).FlatConfigComposer] as const,
  );

  const mut_configs = assembleConfigs(options);

  let mut_composer = new FlatConfigComposer<FlatConfigItem>().append(...mut_configs, ...userConfigs);

  if (options.autoRenamePlugins !== false) {
    mut_composer = mut_composer.renamePlugins(defaultPluginRenaming, {
      mergePlugins: true,
    });
  }

  return mut_composer.toConfigs();
}
