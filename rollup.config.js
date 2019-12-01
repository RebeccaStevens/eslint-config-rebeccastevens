/**
 * Rollup Config.
 */
// @ts-check

import {
  isAbsolute as isAbsolutePath,
  join as joinPaths,
  normalize as normalizePath
} from 'path';
import rollupPluginCommonjs from 'rollup-plugin-commonjs';
import rollupPluginNodeResolve from 'rollup-plugin-node-resolve';
import rollupPluginTypescript from 'rollup-plugin-typescript2';

const common = {
  input: 'src/index.ts',

  external: (id) => {
    const localPaths = ['.', process.cwd()];
    const excludedPaths = ['node_modules'];
    const normalId = isAbsolutePath(id) ? normalizePath(id) : id;

    return !localPaths.some((localPath) =>
      // Local file?
      normalId.startsWith(localPath) &&
      // Not excluded?
      !excludedPaths.some((excludePath) =>
        normalId.startsWith(joinPaths(localPath, excludePath))));
  },

  treeshake: {
    annotations: true,
    moduleSideEffects: ['array.prototype.flatmap/auto.js'],
    propertyReadSideEffects: false
  }
};

const cjs = {
  ...common,

  output: {
    dir: './dist',
    entryFileNames: '[name].cjs',
    chunkFileNames: 'common/[hash].cjs',
    format: 'cjs',
    sourcemap: false
  },

  plugins: [
    rollupPluginNodeResolve(),
    rollupPluginCommonjs(),
    rollupPluginTypescript({
      tsconfigOverride: { compilerOptions: { target: 'es5' } }
    })
  ]
};

const esm = {
  ...common,

  output: {
    dir: './dist',
    entryFileNames: '[name].mjs',
    chunkFileNames: 'common/[hash].mjs',
    format: 'esm',
    sourcemap: false
  },

  plugins: [
    rollupPluginNodeResolve(),
    rollupPluginCommonjs(),
    rollupPluginTypescript({
      tsconfigOverride: { compilerOptions: { target: 'es2017' } }
    })
  ]
};

export default [cjs, esm];
