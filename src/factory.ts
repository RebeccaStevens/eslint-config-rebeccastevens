import type { Linter } from "eslint";

import { assembleConfigs } from "./assembly";
import type { Awaitable, FlatConfigItem, OptionsConfig } from "./types";
import { loadPackages } from "./utils";

export { getOverrides, resolveSubOptions } from "./assembly";
export type { ResolvedOptions } from "./assembly";

/**
 * Plugin name renames applied by default when `autoRenamePlugins` is not `false`.
 *
 * When writing rule overrides in user configs, use the **renamed** prefix
 * (e.g. `"ts/no-explicit-any"`, not `"@typescript-eslint/no-explicit-any"`).
 * Pass `autoRenamePlugins: false` to `rsEslint` to opt out.
 */
export const defaultPluginRenaming = {
  "@intlify/vue-i18n": "vue-i18n",
  "@stylistic": "style",
  "@typescript-eslint": "ts",
  "eslint-comments": "comments",
  "erasable-syntax-only": "ts/erasable-syntax",
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
 * @param options - The options for generating the ESLint configurations.
 * @param userConfigs - The user configurations to be merged with the generated configurations.
 * @returns The merged ESLint configurations.
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

  const { renamePlugins = true } = options;
  if (renamePlugins !== false) {
    const rawRenamingMap =
      typeof renamePlugins === "object" ? { ...defaultPluginRenaming, ...renamePlugins } : defaultPluginRenaming;

    const renamingMap: Record<string, string> = Object.fromEntries(
      Object.entries(rawRenamingMap).map(([from, to]) => {
        const slashIndex = to.indexOf("/");
        return [from, slashIndex === -1 ? to : to.slice(0, slashIndex)];
      }),
    );

    mut_composer = mut_composer.renamePlugins(renamingMap, {
      mergePlugins: true,
    });
  }

  return mut_composer.toConfigs();
}
