import * as fs from "node:fs";
import * as path from "node:path";

import rollupPluginCommonjs from "@rollup/plugin-commonjs";
import rollupPluginNodeResolve from "@rollup/plugin-node-resolve";
import rollupPluginTypescript from "@rollup/plugin-typescript";
import { type RollupOptions } from "rollup";
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
 * Get the rollup config for the given eslint config.
 */
function getConfig(filename: string): RollupOptions {
  return {
    ...common,

    input: `${configDir}${filename}`,

    output: [
      {
        ...common.output,
        entryFileNames: `${path.basename(filename, ".ts")}.cjs`,
        format: "cjs",
      },
      {
        ...common.output,
        entryFileNames: `${path.basename(filename, ".ts")}.mjs`,
        format: "esm",
      },
    ],

    plugins: [
      rollupPluginAutoExternal(),
      rollupPluginNodeResolve(),
      rollupPluginCommonjs(),
      rollupPluginTypescript({
        tsconfig: "tsconfig.build.json",
      }),
    ],
  };
}

export default configFiles.map((filename) => getConfig(filename));
