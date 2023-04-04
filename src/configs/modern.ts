import { type Linter } from "eslint";

import {
  rules as builtinRules,
  overrides as builtinOverrides,
} from "~/builtin";
import { mergeConfigs } from "~/merge-configs";
import { settings as eslintComments } from "~/plugins/eslint-comments";
import { settings as functional } from "~/plugins/functional";
import { settings as importPlugin } from "~/plugins/import";
import { settings as jsdoc } from "~/plugins/jsdoc";
import { settings as markdown } from "~/plugins/markdown";
import { settings as node } from "~/plugins/node";
import { settings as optimizeRegex } from "~/plugins/optimize-regex";
import { settings as promise } from "~/plugins/promise";
import { settings as sonarjs } from "~/plugins/sonarjs";
import { settings as unicorn } from "~/plugins/unicorn";

const baseConfig: Linter.Config = {
  parser: "babel-eslint",

  parserOptions: {
    ecmaVersion: "latest",
    ecmaFeatures: {
      globalReturn: false,
      impliedStrict: true,
    },
    sourceType: "module",
  },

  extends: ["eslint:recommended"],

  rules: builtinRules,

  overrides: builtinOverrides,

  ignorePatterns: ["/dist"],

  reportUnusedDisableDirectives: true,
};

export default mergeConfigs(
  baseConfig,
  eslintComments,
  functional,
  importPlugin,
  jsdoc,
  markdown,
  node,
  optimizeRegex,
  promise,
  sonarjs,
  unicorn
);
