import fs from "node:fs/promises";

import { type Linter } from "eslint";
import { flatConfigsToRulesDTS } from "eslint-typegen/core";

import { assembleConfigs } from "../src/assembly";
import { functional, inEditor } from "../src/configs";
import { combine } from "../src/utils";

const configs = (await combine(
  ...assembleConfigs({
    projectRoot: process.cwd(),
    mode: "none",
    functional: {
      functionalEnforcement: "none",
      ignoreNamePattern: [],
    },
    typescript: {
      unsafe: "off",
    },
    vue: {
      i18n: false,
      sfcBlocks: false,
    },
    react: {
      i18n: false,
    },
    tailwind: {
      tailwindEntryPoint: "src/global.css",
      tailwindVersion: 4,
    },
    unocss: {
      attributify: false,
      strict: false,
    },
    markdown: {
      enableTypeRequiredRules: false,
    },
    json: {},
    yaml: {},
    toml: {},
  }),
  // These configs are only included by the assembly under conditions that don't
  // hold here; include them explicitly so their rules are still part of the
  // generated types.
  functional({
    functionalEnforcement: "none",
    ignoreNamePattern: [],
    stylistic: false,
    overrides: undefined,
    parserOptions: {},
    filesTypeAware: [],
    mode: "none",
  }),
  inEditor(),
)) as Linter.Config[];

const pluginRules = new Map<string, Record<string, unknown>>();
for (const config of configs) {
  for (const [name, plugin] of Object.entries(config.plugins ?? {})) {
    pluginRules.set(name, plugin.rules ?? {});
  }
}

const mut_errors: string[] = [];
for (const config of configs) {
  for (const [rule, value] of Object.entries(config.rules ?? {})) {
    const severity = Array.isArray(value) ? value[0] : value;
    if (severity === "off") continue;
    const separatorIndex = rule.indexOf("/");
    if (separatorIndex === -1) continue;
    const pluginName = rule.slice(0, separatorIndex);
    const ruleName = rule.slice(separatorIndex + 1);
    if (!pluginRules.has(pluginName)) {
      mut_errors.push(`Missing plugin "${pluginName}" referenced by rule "${rule}".`);
      continue;
    }
    if (!Object.hasOwn(pluginRules.get(pluginName) ?? {}, ruleName)) {
      mut_errors.push(`Rule "${rule}" not found in plugin "${pluginName}".`);
    }
  }
}
if (mut_errors.length > 0) {
  console.error("Invalid rules found:\n" + mut_errors.map((error) => `  - ${error}`).join("\n"));
  process.exitCode = 1;
}

const dts = await flatConfigsToRulesDTS(configs, {
  includeIgnoreComments: false,
});

const fullDts = `// @ts-nocheck\n${dts}`;

await fs.writeFile("src/typegen.ts", fullDts);
