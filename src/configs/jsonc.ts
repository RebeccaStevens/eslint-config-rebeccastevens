import type { ESLint } from "eslint";

import type {
  FlatConfigItem,
  OptionsFiles,
  OptionsHasTypeScript,
  OptionsOverrides,
  RequiredOptionsStylistic,
} from "../types";
import { loadPackages } from "../utils";

import { StylisticConfigDefaults } from "./stylistic";

const TSCONFIG_SORT_TOP_LEVEL = ["extends", "compilerOptions", "references", "files", "include", "exclude"];

const TSCONFIG_SORT_COMPILER_OPTIONS = [
  // Projects
  "incremental",
  "composite",
  "tsBuildInfoFile",
  "disableSourceOfProjectReferenceRedirect",
  "disableSolutionSearching",
  "disableReferencedProjectLoad",

  // Language and Environment
  "target",
  "jsx",
  "jsxFactory",
  "jsxFragmentFactory",
  "jsxImportSource",
  "lib",
  "moduleDetection",
  "noLib",
  "reactNamespace",
  "useDefineForClassFields",
  "emitDecoratorMetadata",
  "experimentalDecorators",

  // Modules
  "baseUrl",
  "rootDir",
  "rootDirs",
  "customConditions",
  "module",
  "moduleResolution",
  "moduleSuffixes",
  "noResolve",
  "paths",
  "resolveJsonModule",
  "resolvePackageJsonExports",
  "resolvePackageJsonImports",
  "typeRoots",
  "types",
  "allowArbitraryExtensions",
  "allowImportingTsExtensions",
  "allowUmdGlobalAccess",

  // JavaScript Support
  "allowJs",
  "checkJs",
  "maxNodeModuleJsDepth",

  // Type Checking
  "strict",
  "strictBindCallApply",
  "strictFunctionTypes",
  "strictNullChecks",
  "strictPropertyInitialization",
  "allowUnreachableCode",
  "allowUnusedLabels",
  "alwaysStrict",
  "exactOptionalPropertyTypes",
  "noFallthroughCasesInSwitch",
  "noImplicitAny",
  "noImplicitOverride",
  "noImplicitReturns",
  "noImplicitThis",
  "noPropertyAccessFromIndexSignature",
  "noUncheckedIndexedAccess",
  "noUnusedLocals",
  "noUnusedParameters",
  "useUnknownInCatchVariables",

  // Emit
  "declaration",
  "declarationDir",
  "declarationMap",
  "downlevelIteration",
  "emitBOM",
  "emitDeclarationOnly",
  "importHelpers",
  "importsNotUsedAsValues",
  "inlineSourceMap",
  "inlineSources",
  "mapRoot",
  "newLine",
  "noEmit",
  "noEmitHelpers",
  "noEmitOnError",
  "outDir",
  "outFile",
  "preserveConstEnums",
  "preserveValueImports",
  "removeComments",
  "sourceMap",
  "sourceRoot",
  "stripInternal",

  // Interop Constraints
  "allowSyntheticDefaultImports",
  "esModuleInterop",
  "forceConsistentCasingInFileNames",
  "isolatedModules",
  "preserveSymlinks",
  "verbatimModuleSyntax",

  // Completeness
  "skipDefaultLibCheck",
  "skipLibCheck",
];

/**
 * Enable JSON, JSONC, and JSON5 linting via `eslint-plugin-jsonc` and `jsonc-eslint-parser`.
 *
 * Enforces JSON validity error rules (e.g. `no-dupe-keys`, `no-nan`, `no-template-literals`,
 * `valid-json-number`). Stylistic rules like `indent`, `quotes`, and `comma-dangle` are
 * enabled only when `stylistic` is not `false`.
 *
 * When TypeScript is available, also enforces tsconfig.json key ordering
 * via `jsonc/sort-keys` (independent of the `stylistic` option — key
 * ordering is consistency, not styling).
 *
 * @param options - Options with `files`, `overrides`, `stylistic`, and `typescript`
 * @returns Flat config items enabling jsonc rules
 */
export async function jsonc(
  options: Readonly<Required<OptionsFiles & RequiredOptionsStylistic & OptionsOverrides & OptionsHasTypeScript>>,
): Promise<FlatConfigItem[]> {
  const { files, overrides, stylistic, typescript } = options;

  const { indent = StylisticConfigDefaults.indent } = typeof stylistic === "boolean" ? {} : stylistic;

  const [pluginJsonc, parserJsonc] = (await loadPackages(["eslint-plugin-jsonc", "jsonc-eslint-parser"])) as [
    ESLint.Plugin,
    typeof import("jsonc-eslint-parser"),
  ];

  const stylisticEnforcement = stylistic === false ? "off" : "error";

  return [
    {
      name: "rs:jsonc:setup",
      plugins: {
        jsonc: pluginJsonc,
      },
    },
    {
      name: "rs:jsonc:rules",
      files,
      languageOptions: {
        parser: parserJsonc,
      },
      rules: {
        "jsonc/no-bigint-literals": "error",
        "jsonc/no-binary-expression": "error",
        "jsonc/no-binary-numeric-literals": "error",
        "jsonc/no-dupe-keys": "error",
        "jsonc/no-escape-sequence-in-identifier": "error",
        "jsonc/no-floating-decimal": "error",
        "jsonc/no-hexadecimal-numeric-literals": "error",
        "jsonc/no-infinity": "error",
        "jsonc/no-multi-str": "error",
        "jsonc/no-nan": "error",
        "jsonc/no-number-props": "error",
        "jsonc/no-numeric-separators": "error",
        "jsonc/no-octal": "error",
        "jsonc/no-octal-escape": "error",
        "jsonc/no-octal-numeric-literals": "error",
        "jsonc/no-parenthesized": "error",
        "jsonc/no-plus-sign": "error",
        "jsonc/no-regexp-literals": "error",
        "jsonc/no-sparse-arrays": "error",
        "jsonc/no-template-literals": "error",
        "jsonc/no-undefined-value": "error",
        "jsonc/no-unicode-codepoint-escapes": "error",
        "jsonc/no-useless-escape": "error",
        "jsonc/space-unary-ops": "error",
        "jsonc/valid-json-number": "error",
        "jsonc/vue-custom-block/no-parsing-error": "error",

        "jsonc/array-bracket-spacing": [stylisticEnforcement, "never"],
        "jsonc/comma-dangle": [stylisticEnforcement, "never"],
        "jsonc/comma-style": [stylisticEnforcement, "last"],
        "jsonc/indent": [
          stylisticEnforcement,
          indent,
          {
            SwitchCase: 1,
            VariableDeclarator: 1,
            outerIIFEBody: 1,
            MemberExpression: 1,
            FunctionDeclaration: { parameters: 1, body: 1 },
            FunctionExpression: { parameters: 1, body: 1 },
            CallExpression: { arguments: 1 },
            ArrayExpression: 1,
            ObjectExpression: 1,
            ImportDeclaration: 1,
            flatTernaryExpressions: false,
            ignoreComments: false,
          },
        ],
        "jsonc/key-spacing": [stylisticEnforcement, { afterColon: true, beforeColon: false }],
        "jsonc/object-curly-newline": [stylisticEnforcement, { consistent: true, multiline: true }],
        "jsonc/object-curly-spacing": [stylisticEnforcement, "always"],
        "jsonc/object-property-newline": [stylisticEnforcement, { allowMultiplePropertiesPerLine: true }],
        "jsonc/quote-props": stylisticEnforcement,
        "jsonc/quotes": stylisticEnforcement,

        ...overrides,
      },
    },

    // Sort tsconfig.json keys whenever TypeScript is available — key ordering
    // is consistency, not styling, so this stays independent of `stylistic`.
    ...(typescript
      ? [
          {
            files: ["**/tsconfig.json", "**/tsconfig.*.json"],
            name: "rs:jsonc:sort-tsconfig",
            rules: {
              "jsonc/sort-keys": [
                "error",
                {
                  order: TSCONFIG_SORT_TOP_LEVEL,
                  pathPattern: "^$",
                },
                {
                  order: TSCONFIG_SORT_COMPILER_OPTIONS,
                  pathPattern: "^compilerOptions$",
                },
              ],
            } as FlatConfigItem["rules"],
          },
        ]
      : []),
  ];
}
