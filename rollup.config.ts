/**
 * Rollup Config.
 */

import rollupPluginCommonjs from "@rollup/plugin-commonjs";
import rollupPluginNodeResolve from "@rollup/plugin-node-resolve";
import rollupPluginTypescript from "@rollup/plugin-typescript";
import path from "path";
import type { RollupOptions } from "rollup";
import rollupPluginAutoExternal from "rollup-plugin-auto-external";

import * as pkg from "./package.json";

const common: Partial<RollupOptions> = {
  input: "src/index.ts",

  output: {
    dir: "./dist",
    sourcemap: false,
    exports: "default",
  },

  treeshake: {
    annotations: true,
    propertyReadSideEffects: false,
  },
};

/**
 * Get new instances of all the common plugins.
 */
function getPlugins() {
  return [
    rollupPluginAutoExternal(),
    rollupPluginNodeResolve(),
    rollupPluginCommonjs(),
    rollupPluginTypescript(),
  ];
}

const cjs: RollupOptions = {
  ...common,

  output: {
    ...common.output,
    entryFileNames: path.basename(pkg.main),
    format: "cjs",
  },

  plugins: getPlugins(),
};

const esm: RollupOptions = {
  ...common,

  output: {
    ...common.output,
    entryFileNames: path.basename(pkg.module),
    format: "esm",
  },

  plugins: getPlugins(),
};

export default [cjs, esm];
