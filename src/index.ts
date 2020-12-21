import { all as deepMerge } from "deepmerge";

import { pluginConfigs } from "@plugins";

import { rules as defaultRules } from "./builtin";

const options = {
  parser: "@typescript-eslint/parser",

  parserOptions: {
    ecmaVersion: 2019,
    ecmaFeatures: {
      globalReturn: false,
      impliedStrict: true,
    },
    sourceType: "module",
  },

  extends: ["eslint:recommended"],

  env: {
    es6: true,
  },

  rules: defaultRules,
};

export default deepMerge([options, ...pluginConfigs]);
