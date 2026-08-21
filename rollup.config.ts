import assert from "node:assert";

import rollupPluginTypescript from "@rollup/plugin-typescript";
import type { RollupOptions } from "rollup";
import rollupPluginDeassert from "rollup-plugin-deassert";
import generateDtsBundle from "rollup-plugin-dts-bundle-generator-2";
import {
  type Node,
  type SourceFile,
  SyntaxKind,
  isCallExpression,
  isIdentifier,
  visitEachChild,
  visitNode,
} from "typescript";

import packageJson from "./package.json" with { type: "json" };

type PackageJSON = typeof packageJson & {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

const externalDependencies = [
  ...Object.keys((packageJson as PackageJSON).dependencies),
  ...Object.keys((packageJson as PackageJSON).peerDependencies),
];

export default {
  input: "src/index.ts",

  output: [
    {
      file: packageJson.exports.import,
      format: "esm",
      sourcemap: false,
      importAttributesKey: "with",
    },
    {
      file: packageJson.exports.require,
      format: "cjs",
      sourcemap: false,
    },
  ],

  plugins: [
    rollupPluginTypescript({
      tsconfig: "src/tsconfig.build.json",
      transformers: {
        after: [
          /**
           * Strip out TS relative import path rewrite helper from dynamic import() calls
           *
           * Required due to
           * https://github.com/rollup/plugins/issues/1820
           *
           * @param context
           */

          (context) => (source) => {
            function visitor(node: Node) {
              if (
                isCallExpression(node) &&
                isIdentifier(node.expression) &&
                node.expression.text === "__rewriteRelativeImportExtension" &&
                node.arguments.length > 0
              ) {
                return node.arguments[0]!;
              }
              return visitEachChild(node, visitor, context);
            }
            const result = visitNode(source, visitor);
            assert.ok(result.kind === SyntaxKind.SourceFile);
            return result as SourceFile;
          },
        ],
      },
    }),
    rollupPluginDeassert({
      include: ["**/*.{js,ts}"],
    }),
    generateDtsBundle({
      compilation: {
        preferredConfigPath: "src/tsconfig.build.json",
      },
      output: {
        exportReferencedTypes: false,
        inlineDeclareExternals: true,
      },
    }),
  ],

  treeshake: {
    annotations: true,
    moduleSideEffects: [],
    propertyReadSideEffects: false,
    unknownGlobalSideEffects: false,
  },

  external: (source) =>
    source.startsWith("node:") ||
    externalDependencies.some((dependency) => dependency === source || source.startsWith(`${dependency}/`)),
} satisfies RollupOptions;
