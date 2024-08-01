import { rollupPlugin as rollupPluginDeassert } from "deassert";
import { type RollupOptions } from "rollup";
import rollupPluginTs from "rollup-plugin-ts";

import pkg from "./package.json" with { type: "json" };

const treeshake = {
  annotations: true,
  moduleSideEffects: ["src/typegen.ts"],
  propertyReadSideEffects: false,
  unknownGlobalSideEffects: false,
} satisfies RollupOptions["treeshake"];

export default {
  input: "src/index.ts",

  output: [
    {
      file: pkg.exports.import,
      format: "esm",
      sourcemap: false,
      generatedCode: {
        preset: "es2015",
      },
    },
    {
      file: pkg.exports.require,
      format: "cjs",
      sourcemap: false,
      generatedCode: {
        preset: "es2015",
      },
    },
  ],

  external: [
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.peerDependencies),
  ],

  plugins: [
    rollupPluginTs({
      transpileOnly: true,
      tsconfig: "tsconfig.build.json",
    }),
    rollupPluginDeassert({
      include: ["**/*.{js,ts}"],
      exclude: ["**/*.d.ts"],
    }),
  ],

  treeshake,
} satisfies RollupOptions;
