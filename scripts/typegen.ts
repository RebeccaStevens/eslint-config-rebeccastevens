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
  markdown,
  node,
  overrides,
  promise,
  regexp,
  sonar,
  sortTsconfig,
  stylistic,
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
  functional({}),
  ignores({}),
  imports({}),
  inEditor(),
  javascript({}),
  jsdoc({}),
  jsonc({}),
  markdown({}),
  node(),
  overrides(),
  promise(),
  regexp(),
  sonar({}),
  sortTsconfig(),
  stylistic({}),
  test({}),
  toml({}),
  typescript({}),
  unicorn(),
  unocss({}),
  vue({}),
  yaml({}),
)) as Linter.FlatConfig[];

const dts = await flatConfigsToRulesDTS(configs, {
  includeAugmentation: false,
});

await fs.writeFile("src/typegen.d.ts", dts);
