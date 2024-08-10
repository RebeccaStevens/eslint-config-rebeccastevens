import fs from "node:fs/promises";

import { type Linter } from "eslint";
import { flatConfigsToRulesDTS } from "eslint-typegen/core";

import {
  comments,
  formatters,
  functional,
  ignores,
  imports,
  inEditor,
  javascript,
  jsdoc,
  jsonc,
  jsx,
  markdown,
  node,
  overrides,
  promise,
  react,
  regexp,
  sonar,
  sortTsconfig,
  stylistic,
  tailwind,
  test,
  toml,
  typescript,
  unicorn,
  unocss,
  vue,
  yaml,
} from "../src/configs";
import { combine } from "../src/utils";

const configs = (await combine(
  comments(),
  formatters({}, {}),
  functional({
    functionalEnforcement: "none",
    ignoreNamePattern: [],
    stylistic: false,
    overrides: undefined,
    parserOptions: {},
    filesTypeAware: [],
    mode: "none",
  }),
  ignores({
    projectRoot: process.cwd(),
    ignores: [],
    ignoreFiles: [],
  }),
  imports({
    stylistic: false,
    typescript: false,
    parserOptions: {},
    filesTypeAware: [],
  }),
  inEditor(),
  javascript({
    overrides: undefined,
    functionalEnforcement: "none",
    ignoreNamePattern: [],
  }),
  jsdoc({
    stylistic: false,
  }),
  jsonc({
    files: [],
    stylistic: false,
    overrides: undefined,
  }),
  jsx(),
  markdown({
    files: [],
    enableTypeRequiredRules: false,
    componentExts: [],
    overrides: undefined,
  }),
  node(),
  overrides(),
  promise(),
  react({
    files: [],
    filesTypeAware: [],
    i18n: false,
    overrides: undefined,
    parserOptions: {},
    typescript: false,
  }),
  regexp(),
  sonar({
    functionalEnforcement: "none",
    ignoreNamePattern: [],
  }),
  sortTsconfig(),
  stylistic({
    stylistic: {
      indent: 2,
      jsx: true,
      quotes: "double",
      semi: true,
    },
    overrides: undefined,
    typescript: false
  }),
  tailwind({
    overrides: undefined,
  }),
  test({
    files: [],
    overrides: undefined,
  }),
  toml({
    overrides: undefined,
    stylistic: false,
    files: [],
  }),
  typescript({
    files: [],
    componentExts: [],
    overrides: undefined,
    parserOptions: {},
    filesTypeAware: [],
    unsafe: "off",
    functionalEnforcement: "none",
    ignoreNamePattern: [],
    projectRoot: process.cwd(),
    mode: "none",
  }),
  unicorn(),
  unocss({
    attributify: false,
    strict: false,
    overrides: undefined,
  }),
  vue({
    sfcBlocks: false,
    vueVersion: 2,
    i18n: false,
    overrides: undefined,
    typescript: false,
    stylistic: false,
    files: [],
    filesTypeAware: [],
    parserOptions: {},
  }),
  yaml({
    overrides: undefined,
    stylistic: false,
    files: [],
  }),
)) as Linter.FlatConfig[];

const dts = await flatConfigsToRulesDTS(configs, {
  includeIgnoreComments: false,
});

const fullDts = `// @ts-nocheck\n${dts}`;

await fs.writeFile("src/typegen.ts", fullDts);
