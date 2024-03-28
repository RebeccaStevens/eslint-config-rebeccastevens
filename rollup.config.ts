import { rollupPlugin as rollupPluginDeassert } from "deassert";
import { type RollupOptions } from "rollup";
import rollupPluginAutoExternal from "rollup-plugin-auto-external";
import rollupPluginTs from "rollup-plugin-ts";

import pkg from "./package.json" assert { type: "json" };

const treeshake = {
  annotations: true,
  moduleSideEffects: [],
  propertyReadSideEffects: false,
  unknownGlobalSideEffects: false,
} satisfies RollupOptions["treeshake"];

export default {
  input: "src/index.ts",

  output: {
    file: pkg.exports.import.default,
    format: "esm",
    sourcemap: false,
  },

  plugins: [
    rollupPluginAutoExternal(),
    rollupPluginTs({
      transpileOnly: true,
      tsconfig: "tsconfig.build.json",
    }),
    rollupPluginDeassert({
      include: ["**/*.{js,ts}"],
    }),
  ],

  treeshake,
} satisfies RollupOptions;
