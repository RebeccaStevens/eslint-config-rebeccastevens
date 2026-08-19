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
    jsonc: {},
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

const dts = await flatConfigsToRulesDTS(configs, {
  includeIgnoreComments: false,
});

const fullDts = `// @ts-nocheck\n${dts}`;

await fs.writeFile("src/typegen.ts", fullDts);
