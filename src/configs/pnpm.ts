import type { Linter } from "eslint";

import type { FlatConfigItem, OptionsPnpm } from "../types";
import { detectPnpmCatalog, loadPlugins } from "../utils";

const catalogRuleNames = [
  "pnpm/json-enforce-catalog",
  "pnpm/json-valid-catalog",
  "pnpm/json-prefer-workspace-settings",
];

/**
 * Enable `eslint-plugin-pnpm` workspace rules.
 *
 * Catalog enforcement rules are only applied when `catalog` is enabled; when
 * unset, catalog usage is auto-detected from `pnpm-workspace.yaml`.
 *
 * @param options - Options including the project root and user rule overrides
 * @returns Flat config items from the plugin's `recommended` preset, filtered and renamed
 */
export async function pnpm(options: Readonly<OptionsPnpm & { projectRoot: string }>): Promise<FlatConfigItem[]> {
  const { projectRoot, overrides = {} } = options;
  const catalog = options.catalog ?? (await detectPnpmCatalog(projectRoot));
  const [pluginPnpm] = await loadPlugins(["eslint-plugin-pnpm"]);

  const configs = (pluginPnpm.configs?.["recommended"] ?? []) as Linter.Config[];
  const configsArray = Array.isArray(configs) ? configs : [configs];

  return configsArray
    .filter((config) => {
      // Filter out the json config when catalog is disabled
      if (!catalog) {
        const ruleKeys = Object.keys(config.rules ?? {});
        const hasCatalogRules = ruleKeys.some((key) => catalogRuleNames.includes(key));
        if (hasCatalogRules) {
          return false;
        }
      }
      return true;
    })
    .map((config, index) => ({
      ...config,
      name: `rs:pnpm:${index}`,
      rules: {
        ...config.rules,
        // Disable catalog rules when catalog is disabled
        ...(catalog ? {} : Object.fromEntries(catalogRuleNames.map((rule) => [rule, "off"]))),
        ...overrides,
      },
    }));
}
