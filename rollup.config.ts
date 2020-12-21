/**
 * Rollup Config.
 */

import {
  basename,
  isAbsolute as isAbsolutePath,
  join as joinPaths,
  normalize as normalizePath,
} from "path";

import type { RollupOptions } from "rollup";
import rollupPluginCommonjs from "@rollup/plugin-commonjs";
import rollupPluginNodeResolve from "@rollup/plugin-node-resolve";
import rollupPluginTypescript from "@rollup/plugin-typescript";

import * as pkg from "./package.json";

const common: Partial<RollupOptions> = {
  input: "src/index.ts",

  external: (id: string) => {
    const localPaths = [".", process.cwd()];
    const excludedPaths = ["node_modules"];
    const normalId = isAbsolutePath(id) ? normalizePath(id) : id;

    return !localPaths.some(
      (localPath) =>
        // Local file?
        normalId.startsWith(localPath) &&
        // Not excluded?
        !excludedPaths.some((excludePath) =>
          normalId.startsWith(joinPaths(localPath, excludePath))
        )
    );
  },

  treeshake: {
    annotations: true,
    propertyReadSideEffects: false,
  },
};

const dir = "./dist";
const sourcemap = false;

function getPlugins() {
  return [
    rollupPluginNodeResolve(),
    rollupPluginCommonjs(),
    rollupPluginTypescript(),
  ];
}

const cjs: RollupOptions = {
  ...common,

  output: {
    dir,
    entryFileNames: basename(pkg.main),
    format: "cjs",
    sourcemap,
  },

  plugins: getPlugins(),
};

const esm: RollupOptions = {
  ...common,

  output: {
    dir,
    entryFileNames: basename(pkg.module),
    format: "esm",
    sourcemap,
  },

  plugins: getPlugins(),
};

export default [cjs, esm];
