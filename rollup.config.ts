import rollupPluginTypescript from "@rollup/plugin-typescript";
import type { RollupOptions } from "rollup";
import rollupPluginDeassert from "rollup-plugin-deassert";
import { generateDtsBundle } from "rollup-plugin-dts-bundle-generator";

import pkg from "./package.json" with { type: "json" };

const externalDependencies = [
  ...Object.keys((pkg as any).dependencies ?? {}),
  ...Object.keys((pkg as any).peerDependencies ?? {}),
];

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
      plugins: [
        generateDtsBundle({
          compilation: {
            preferredConfigPath: "tsconfig.build.json",
          },
          outFile: pkg.exports.types.import,
        }) as any,
      ],
    },
    {
      file: pkg.exports.require,
      format: "cjs",
      sourcemap: false,
      generatedCode: {
        preset: "es2015",
      },
      plugins: [
        generateDtsBundle({
          compilation: {
            preferredConfigPath: "tsconfig.build.json",
          },
          outFile: pkg.exports.types.require,
        }) as any,
      ],
    },
  ],

  external: (source) => {
    if (source.startsWith("node:")) {
      return true;
    }
    if (externalDependencies.some((dep) => source.startsWith(dep))) {
      return true;
    }
    return undefined;
  },

  plugins: [
    rollupPluginTypescript({
      compilerOptions: {
        noCheck: true,
        declaration: false,
      },
      tsconfig: "tsconfig.build.json",
    }),
    rollupPluginDeassert({
      include: ["**/*.{js,ts}"],
    }),
  ],

  treeshake: {
    annotations: true,
    moduleSideEffects: [],
    propertyReadSideEffects: false,
    unknownGlobalSideEffects: false,
  },
} satisfies RollupOptions;
