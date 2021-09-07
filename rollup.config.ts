/**
 * Rollup Config.
 */

import rollupPluginCommonjs from "@rollup/plugin-commonjs";
import rollupPluginNodeResolve from "@rollup/plugin-node-resolve";
import rollupPluginTypescript from "@rollup/plugin-typescript";
import * as fs from "fs";
import path from "path";
import type { RollupOptions } from "rollup";
import rollupPluginAutoExternal from "rollup-plugin-auto-external";

const configDir = "./src/configs/";

const configFiles: ReadonlyArray<string> = fs
  .readdirSync(configDir)
  .filter((file) => file !== "index.ts" && file.endsWith(".ts"));

const common: Partial<RollupOptions> = {
  output: {
    dir: "./dist",
    sourcemap: false,
    exports: "default",
  },

  treeshake: {
    annotations: true,
    moduleSideEffects: [],
    propertyReadSideEffects: false,
    unknownGlobalSideEffects: false,
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
    rollupPluginTypescript({
      tsconfig: "tsconfig.build.json",
    }),
  ];
}

/**
 * Get the cjs rollup config for the given entry point.
 */
function getCjsConfig(filename: string): RollupOptions {
  return {
    ...common,

    input: `${configDir}${filename}`,

    output: {
      ...common.output,
      entryFileNames: `${path.basename(filename, ".ts")}.cjs`,
      format: "cjs",
    },

    plugins: getPlugins(),
  };
}

/**
 * Get the esm rollup config for the given entry point.
 */
function getEsmConfig(filename: string): RollupOptions {
  return {
    ...common,

    input: `${configDir}${filename}`,

    output: {
      ...common.output,
      entryFileNames: `${path.basename(filename, ".ts")}.mjs`,
      format: "esm",
    },

    plugins: getPlugins(),
  };
}

/**
 * Get the rollup config for the given entry point file.
 */
function getEntryConfigs(filename: string): RollupOptions[] {
  return [getCjsConfig(filename), getEsmConfig(filename)];
}

export default configFiles.flatMap(getEntryConfigs);
