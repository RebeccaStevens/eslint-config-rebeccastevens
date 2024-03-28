import { type ESLint, type Linter } from "eslint";

import { GLOB_DTS, GLOB_SRC, GLOB_TESTS, GLOB_TS, GLOB_TSX } from "../globs";
import {
  type FlatConfigItem,
  type OptionsComponentExts,
  type OptionsFiles,
  type OptionsOverrides,
  type OptionsTypeScriptParserOptions,
  type OptionsTypeScriptWithTypes,
} from "../types";
import { loadPackages, toArray } from "../utils";

export async function typescript(
  options: OptionsFiles &
    OptionsComponentExts &
    OptionsOverrides &
    OptionsTypeScriptWithTypes &
    OptionsTypeScriptParserOptions = {},
): Promise<FlatConfigItem[]> {
  const { componentExts = [], overrides = {}, parserOptions = {} } = options;

  const files = options.files ?? [
    GLOB_SRC,
    ...componentExts.map((ext) => `**/*.${ext}`),
  ];

  const filesTypeAware = options.filesTypeAware ?? [
    GLOB_TS,
    GLOB_TSX,
    GLOB_DTS,
  ];
  const tsconfigPath =
    options.tsconfig === undefined
      ? undefined
      : typeof options.tsconfig === "boolean"
        ? options.tsconfig
        : toArray(options.tsconfig);
  const isTypeAware = Boolean(tsconfigPath);

  const [pluginTs, parserTs] = (await loadPackages([
    "@typescript-eslint/eslint-plugin",
    "@typescript-eslint/parser",
  ])) as [ESLint.Plugin, Linter.FlatConfigParserModule];

  function makeParser(
    typeAware: boolean,
    files: Readonly<string[]>,
    ignores?: Readonly<string[]>,
  ): FlatConfigItem {
    return {
      name: `rs:typescript:${typeAware ? "type-aware-parser" : "parser"}`,
      files: [...files],
      ...(ignores === undefined ? {} : { ignores: [...ignores] }),
      languageOptions: {
        parser: parserTs,
        parserOptions: {
          extraFileExtensions: componentExts.map((ext) => `.${ext}`),
          sourceType: "module",
          ...(typeAware
            ? {
                project: tsconfigPath,
                tsconfigRootDir: process.cwd(),
              }
            : {}),
          ...(parserOptions as Linter.ParserOptions),
        },
      },
    };
  }

  const rules = {
    "no-extra-boolean-cast": "off",
    "no-implied-eval": "off",
    "ts/ban-types": [
      "error",
      {
        extendDefaults: true,
        types: {
          "{}": false,
          object: false,
          Object: { fixWith: "object", message: "Use `object` instead" },
        },
      },
    ],
    "ts/dot-notation": ["error", { allowIndexSignaturePropertyAccess: true }],
    // "ts/explicit-function-return-type": [
    //   "off",
    //   {
    //     allowConciseArrowFunctionExpressionsStartingWithVoid: true,
    //     allowExpressions: true,
    //     allowHigherOrderFunctions: true,
    //     allowTypedFunctionExpressions: true,
    //   },
    // ],
    "ts/explicit-member-accessibility": [
      "error",
      { accessibility: "explicit" },
    ],
    // "ts/explicit-module-boundary-types": "off",
    "ts/naming-convention": [
      "error",
      {
        selector: "default",
        format: ["camelCase", "PascalCase"],
        leadingUnderscore: "allow",
        trailingUnderscore: "forbid",
      },
      {
        selector: "variableLike",
        filter: { regex: "_[^_]+", match: true },
        format: ["camelCase", "PascalCase"],
        prefix: ["m_", "M_"],
        leadingUnderscore: "forbid",
        trailingUnderscore: "forbid",
      },
      {
        selector: "variableLike",
        format: ["camelCase", "PascalCase"],
        leadingUnderscore: "allow",
        trailingUnderscore: "forbid",
      },
      {
        selector: "variable",
        format: ["camelCase", "PascalCase", "UPPER_CASE"],
        prefix: ["m_", "M_"],
        leadingUnderscore: "forbid",
        trailingUnderscore: "forbid",
      },
      {
        selector: "variable",
        filter: { regex: "^[A-Z0-9_]+$", match: true },
        format: ["UPPER_CASE"],
        modifiers: ["const"],
        leadingUnderscore: "forbid",
        trailingUnderscore: "forbid",
      },
      {
        selector: "variable",
        filter: { regex: "_[^_]+", match: true },
        format: ["camelCase", "PascalCase"],
        modifiers: ["const"],
        prefix: ["m_", "M_"],
        leadingUnderscore: "forbid",
        trailingUnderscore: "forbid",
      },
      {
        selector: "variable",
        format: ["camelCase", "PascalCase", "UPPER_CASE"],
        modifiers: ["const"],
        leadingUnderscore: "allow",
        trailingUnderscore: "forbid",
      },
      { selector: "variable", format: null, modifiers: ["destructured"] },
      {
        selector: "memberLike",
        filter: { regex: "^[A-Z0-9_]+$", match: true },
        format: ["UPPER_CASE"],
        leadingUnderscore: "forbid",
        trailingUnderscore: "forbid",
      },
      {
        selector: "memberLike",
        format: ["camelCase", "PascalCase"],
        prefix: ["m_", "M_"],
        leadingUnderscore: "forbid",
        trailingUnderscore: "forbid",
      },
      {
        selector: "memberLike",
        filter: { regex: "_[^_]+", match: true },
        format: ["camelCase", "PascalCase"],
        modifiers: ["readonly"],
        prefix: ["m_", "M_"],
        leadingUnderscore: "forbid",
        trailingUnderscore: "forbid",
      },
      {
        selector: "memberLike",
        format: ["camelCase", "PascalCase", "UPPER_CASE"],
        modifiers: ["readonly"],
        leadingUnderscore: "allow",
        trailingUnderscore: "forbid",
      },
      {
        selector: ["accessor", "classMethod", "typeMethod", "typeProperty"],
        format: ["camelCase", "PascalCase", "UPPER_CASE"],
        leadingUnderscore: "allow",
        trailingUnderscore: "forbid",
      },
      {
        selector: "enumMember",
        format: ["PascalCase", "UPPER_CASE"],
        leadingUnderscore: "allow",
        trailingUnderscore: "forbid",
      },
      {
        selector: "typeLike",
        format: ["PascalCase"],
        leadingUnderscore: "allow",
        trailingUnderscore: "forbid",
      },
      {
        selector: ["objectLiteralProperty", "objectLiteralMethod"],
        format: null,
      },
    ],
    "ts/no-confusing-void-expression": [
      "error",
      { ignoreArrowShorthand: false, ignoreVoidOperator: true },
    ],
    "ts/no-empty-interface": ["error", { allowSingleExtends: true }],
    "ts/no-explicit-any": "warn",
    "ts/no-invalid-void-type": "error",
    "ts/no-loop-func": "error",
    "ts/no-loss-of-precision": "error",
    // "ts/no-meaningless-void-operator": "off",
    // "ts/no-non-null-assertion": "off",
    // "ts/no-redeclare": "error",
    // "ts/no-require-imports": "off",
    "ts/no-shadow": [
      "warn",
      {
        allow: ["resolve", "reject", "done", "cb"],
        builtinGlobals: false,
        hoist: "never",
      },
    ],
    "no-throw-literal": "off",
    "ts/only-throw-error": "error",
    "ts/no-unnecessary-condition": [
      "error",
      { allowConstantLoopConditions: true },
    ],
    "ts/no-unnecessary-type-constraint": "error",
    "ts/no-unsafe-argument": "warn",
    "ts/no-unsafe-assignment": "warn",
    "ts/no-unsafe-call": "warn",
    "ts/no-unsafe-member-access": "warn",
    "ts/no-unsafe-return": "warn",
    "ts/no-unused-expressions": [
      "error",
      {
        allowShortCircuit: true,
        allowTaggedTemplates: true,
        allowTernary: true,
      },
    ],
    "ts/no-unused-vars": [
      "error",
      {
        args: "none",
        caughtErrors: "none",
        ignoreRestSiblings: true,
        vars: "all",
      },
    ],
    "ts/no-use-before-define": [
      "error",
      { classes: true, functions: false, typedefs: true, variables: true },
    ],
    "ts/no-var-requires": "error",
    "ts/non-nullable-type-assertion-style": "error",
    "ts/prefer-for-of": "error",
    "ts/prefer-includes": "error",
    // "ts/prefer-interface": "off",
    "ts/prefer-nullish-coalescing": "error",
    "ts/prefer-optional-chain": "error",
    "ts/prefer-readonly-parameter-types": "error",
    "ts/prefer-regexp-exec": "error",
    "ts/prefer-string-starts-ends-with": "error",
    "ts/prefer-ts-expect-error": "error",
    // "ts/promise-function-async": "off",
    "ts/restrict-plus-operands": ["error", { skipCompoundAssignments: true }],
    "ts/restrict-template-expressions": [
      "error",
      {
        allowAny: true,
        allowBoolean: true,
        allowNullish: true,
        allowNumber: true,
      },
    ],
    "ts/strict-boolean-expressions": [
      "error",
      {
        allowAny: false,
        allowNullableBoolean: false,
        allowNullableNumber: false,
        allowNullableObject: false,
        allowNullableString: false,
        allowNumber: false,
        allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing: false,
        allowString: false,
      },
    ],
    "ts/switch-exhaustiveness-check": "error",
    "ts/unbound-method": ["error", { ignoreStatic: true }],
    "ts/unified-signatures": [
      "error",
      { ignoreDifferentlyNamedParameters: true },
    ],
    "ts/array-type": [
      "error",
      { default: "array-simple", readonly: "generic" },
    ],
    "ts/consistent-indexed-object-style": "error",
    "ts/consistent-type-definitions": ["error", "type"],
    // "ts/sort-type-union-intersection-members": "off",

    ...overrides,
  } satisfies FlatConfigItem["rules"];

  return [
    {
      name: "rs:typescript:setup",
      plugins: { ts: pluginTs },
    },
    ...(isTypeAware
      ? [
          makeParser(true, filesTypeAware),
          makeParser(false, files, filesTypeAware),
        ]
      : [makeParser(false, files)]),
    {
      name: "rs:typescript:rules",
      files,
      rules: Object.fromEntries(
        Object.entries(rules).flatMap(([key, value]) => {
          if (key.startsWith("ts/")) {
            const baseName = key.slice("ts/".length);
            return [
              [baseName, "off"],
              [key, value],
            ];
          }
          return [[key, value]];
        }),
      ) as NonNullable<FlatConfigItem["rules"]>,
    },
    {
      files,
      ignores: filesTypeAware,
      name: "rs:typescript:rules-non-type-aware",
      rules: ((pluginTs.configs?.["disable-type-checked"] as Linter.FlatConfig)
        .rules ?? {}) as NonNullable<FlatConfigItem["rules"]>,
    },
    {
      files: [GLOB_DTS],
      name: "rs:typescript:dts-overrides",
      rules: {
        "eslint-comments/no-unlimited-disable": "off",
        "import/no-duplicates": "off",
        "no-restricted-syntax": "off",
      },
    },
    {
      files: GLOB_TESTS,
      name: "rs:typescript:tests-overrides",
      rules: {
        "ts/no-unused-expressions": "off",
        "ts/consistent-type-definitions": "off",
        "ts/triple-slash-reference": "off",
      },
    },
    {
      files: ["**/*.js", "**/*.cjs"],
      name: "rs:typescript:javascript-overrides",
      rules: {
        "ts/no-require-imports": "off",
        "ts/no-var-requires": "off",
      },
    },
  ];
}
