/**
 * Rollup Config.
 */
// @ts-check

import rollupPluginCommonjs from 'rollup-plugin-commonjs';
import rollupPluginNodeResolve from 'rollup-plugin-node-resolve';
import rollupPluginTypescript from 'rollup-plugin-typescript2';

const common = {
  input: 'src/index.ts',

  external: (id) =>
    // Not a Local File?
    !(id.startsWith('.') || id.startsWith('/')),

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
    entryFileNames: '[name].js',
    chunkFileNames: 'common/[hash].js',
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
