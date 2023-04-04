import {
  type DeepMergeMergeFunctionUtils,
  deepmergeCustom,
} from "deepmerge-ts";
import { type Linter } from "eslint";

type Meta = Readonly<{
  keyPath: PropertyKey[];
}>;

/**
 * Merge multiple eslint configs into one.
 */
export const mergeConfigs = deepmergeCustom<{}, Meta>({
  metaDataUpdater: (previousMeta, metaMeta): Meta => {
    if (previousMeta === undefined) {
      if (metaMeta.key === undefined) {
        return { keyPath: [] };
      }
      return { keyPath: [metaMeta.key] };
    }
    if (metaMeta.key === undefined) {
      return previousMeta;
    }
    return {
      ...metaMeta,
      keyPath: [...previousMeta.keyPath, metaMeta.key],
    };
  },
  mergeArrays(values, utils, meta): unknown {
    if (isRuleSettings(meta)) {
      return mergeRuleSettings(values, utils);
    }

    return [...new Set(utils.defaultMergeFunctions.mergeArrays(values))];
  },
  mergeOthers(values, utils, meta): unknown {
    if (isRuleSettings(meta)) {
      return mergeRuleSettings(values, utils);
    }

    return utils.actions.defaultMerge;
  },
});

/**
 * Based on the meta data, should the current data be for rule settings.
 */
function isRuleSettings(meta: Meta | undefined) {
  return (
    meta !== undefined &&
    ((meta.keyPath.length === 2 && meta.keyPath[0] === "rules") ||
      (meta.keyPath.length === 4 &&
        meta.keyPath[1] === "overrides" &&
        typeof meta.keyPath[2] === "number" &&
        meta.keyPath[3] === "rules"))
  );
}

/**
 * Merge eslint rule settings.
 *
 * @throws When invalid rule setting syntax are given.
 */
function mergeRuleSettings(
  values: ReadonlyArray<unknown>,
  utils: DeepMergeMergeFunctionUtils<Meta>
): Linter.RuleEntry | (typeof utils.actions)[keyof typeof utils.actions] {
  const settingsData = values.findLast(
    (value): value is [unknown, ...unknown[]] =>
      Array.isArray(value) && value.length >= 2
  );
  if (settingsData === undefined) {
    return utils.actions.defaultMerge;
  }
  const severityData = values.at(-1);
  const severity: unknown = Array.isArray(severityData)
    ? severityData[0]
    : severityData;

  if (severity === "off" || severity === 0) {
    return severity;
  }
  if (
    severity !== "error" &&
    severity !== 2 &&
    severity !== "warn" &&
    severity !== 1
  ) {
    throw new Error(`Unknow rule severity: "${String(severity)}"`);
  }
  const settings = settingsData.slice(1);
  return [severity, ...settings];
}
