import { all as deepMerge } from "deepmerge";

import { rules as builtinRules } from "~/builtin";
import { pluginConfigs } from "~/plugins";

const options = {
  parser: "@typescript-eslint/parser",

  parserOptions: {
    ecmaVersion: 2019,
    ecmaFeatures: {
      globalReturn: false,
      impliedStrict: true,
    },
    sourceType: "module",
    extraFileExtensions: [".cjs", ".mjs"],
  },

  extends: ["eslint:recommended"],

  env: {
    es6: true,
  },

  rules: builtinRules,

  ignorePatterns: ["dist/"],
};

export default deepMerge([options, ...pluginConfigs]);
