import assert from "node:assert/strict";

import type { ESLint, Linter } from "eslint";

import { GLOB_DTS, GLOB_JS, GLOB_JSX, GLOB_TESTS, GLOB_TS, GLOB_TSX } from "../globs";
import type {
  FlatConfigItem,
  OptionsComponentExts,
  OptionsFiles,
  OptionsFunctional,
  OptionsMode,
  OptionsOverrides,
  OptionsProjectRoot,
  OptionsTypeScriptParserOptions,
  OptionsTypeScriptUnsafeSeverity,
} from "../types";
import { loadPackages } from "../utils";

export const defaultFilesTypesAware: string[] = [GLOB_TS, GLOB_TSX, GLOB_DTS];

export async function typescript(
  options: Readonly<
    Required<
      OptionsComponentExts &
        OptionsFiles &
        OptionsFunctional &
        OptionsMode &
        OptionsOverrides &
        OptionsProjectRoot &
        OptionsTypeScriptParserOptions &
        OptionsTypeScriptUnsafeSeverity
    >
  >,
): Promise<FlatConfigItem[]> {
  const {
    mode,
    functionalEnforcement,
    componentExts,
    overrides,
    parserOptions,
    unsafe,
    files,
    filesTypeAware,
    projectRoot,
  } = options;

  const [pluginTs, parserTs] = (await loadPackages([
    "@typescript-eslint/eslint-plugin",
    "@typescript-eslint/parser",
  ])) as [ESLint.Plugin, Linter.Parser];

  function makeParser(typeAware: boolean, files: string[], ignores: string[] = []): FlatConfigItem {
    return {
      name: `rs:typescript:${typeAware ? "type-aware-parser" : "parser"}`,
      files,
      ignores,
      languageOptions: {
        parser: parserTs,
        parserOptions: {
          extraFileExtensions: componentExts.map((ext) => `.${ext}`),
          sourceType: "module",
          ...(typeAware
            ? {
                projectService: true,
                tsconfigRootDir: projectRoot,
              }
            : {}),
          ...(parserOptions as Linter.ParserOptions),
        },
      },
    };
  }

  return [
    {
      name: "rs:typescript:setup",
      plugins: { "@typescript-eslint": pluginTs },
    },
    makeParser(true, filesTypeAware),
    makeParser(false, files, filesTypeAware),
    {
      name: "rs:typescript:rules",
      files,
      rules: {
        ...(assert(!Array.isArray(pluginTs.configs?.["eslint-recommended"])),
        pluginTs.configs?.["eslint-recommended"]?.rules),

        "no-extra-boolean-cast": "off",
        "consistent-return": "off", // Don't turn on ts version
        "import-x/named": "off",
        "no-undef": "off",

        "@typescript-eslint/array-type": ["error", { default: "array-simple", readonly: "generic" }],
        "@typescript-eslint/await-thenable": "error",
        "@typescript-eslint/ban-ts-comment": ["error", { minimumDescriptionLength: 10 }],
        "@typescript-eslint/explicit-function-return-type": [
          "off",
          {
            allowConciseArrowFunctionExpressionsStartingWithVoid: true,
            allowExpressions: true,
            allowHigherOrderFunctions: true,
            allowTypedFunctionExpressions: true,
          },
        ],
        "@typescript-eslint/explicit-member-accessibility": ["error", { accessibility: "explicit" }],
        "@typescript-eslint/no-array-delete": "error",
        "@typescript-eslint/no-base-to-string": "error",
        "@typescript-eslint/no-confusing-void-expression": [
          "error",
          {
            ignoreArrowShorthand: false,
            ignoreVoidOperator: true,
            ignoreVoidReturningFunctions: true,
          },
        ],
        "@typescript-eslint/no-duplicate-enum-values": "error",
        "@typescript-eslint/no-duplicate-type-constituents": "error",
        "@typescript-eslint/no-dynamic-delete": "error",
        "@typescript-eslint/no-explicit-any": unsafe,
        "@typescript-eslint/no-extra-non-null-assertion": "error",
        "@typescript-eslint/no-extraneous-class": "error",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/no-for-in-array": "error",
        "@typescript-eslint/no-invalid-void-type": "error",
        // "@typescript-eslint/no-meaningless-void-operator": "error",
        "@typescript-eslint/no-misused-new": "error",
        "@typescript-eslint/no-misused-promises": "error",
        "@typescript-eslint/no-mixed-enums": "error",
        "@typescript-eslint/no-namespace": "error",
        "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "error",
        "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
        // "@typescript-eslint/no-non-null-assertion": "error",
        "@typescript-eslint/no-redundant-type-constituents": "error",
        "@typescript-eslint/no-this-alias": "error",
        "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
        "@typescript-eslint/no-unnecessary-condition": ["error", { allowConstantLoopConditions: true }],
        "@typescript-eslint/no-unnecessary-type-arguments": "error",
        "@typescript-eslint/no-unnecessary-type-assertion": "error",
        "@typescript-eslint/no-unnecessary-type-constraint": "error",
        "@typescript-eslint/no-unnecessary-type-conversion": "error",
        "@typescript-eslint/no-unsafe-argument": unsafe,
        "@typescript-eslint/no-unsafe-assignment": unsafe,
        "@typescript-eslint/no-unsafe-call": unsafe,
        "@typescript-eslint/no-unsafe-declaration-merging": unsafe,
        "@typescript-eslint/no-unsafe-enum-comparison": unsafe,
        "@typescript-eslint/no-unsafe-function-type": unsafe,
        "@typescript-eslint/no-unsafe-member-access": unsafe,
        "@typescript-eslint/no-unsafe-return": unsafe,
        "@typescript-eslint/no-unused-expressions": [
          "error",
          {
            allowShortCircuit: true,
            allowTaggedTemplates: true,
            allowTernary: true,
          },
        ],
        "@typescript-eslint/no-unnecessary-template-expression": "error",
        "@typescript-eslint/no-wrapper-object-types": "error",
        "@typescript-eslint/non-nullable-type-assertion-style": "error",
        "@typescript-eslint/prefer-as-const": "error",
        "@typescript-eslint/prefer-for-of": "error",
        "@typescript-eslint/prefer-includes": "error",
        "@typescript-eslint/prefer-literal-enum-member": "error",
        "@typescript-eslint/prefer-nullish-coalescing": "error",
        "@typescript-eslint/prefer-optional-chain": "error",
        // "@typescript-eslint/prefer-readonly-parameter-types": "error",
        "@typescript-eslint/prefer-reduce-type-parameter": "error",
        "@typescript-eslint/prefer-regexp-exec": "error",
        "@typescript-eslint/prefer-return-this-type": "error",
        "@typescript-eslint/prefer-string-starts-ends-with": "error",
        "@typescript-eslint/restrict-plus-operands": [
          "error",
          {
            allowAny: true,
            allowBoolean: false,
            allowNullish: false,
            allowNumberAndString: false,
            allowRegExp: false,
            skipCompoundAssignments: true,
          },
        ],
        "@typescript-eslint/restrict-template-expressions": [
          "error",
          {
            allowAny: true,
            allowBoolean: true,
            allowNullish: true,
            allowNumber: true,
            allowRegExp: false,
            allowNever: false,
          },
        ],
        "@typescript-eslint/strict-boolean-expressions": [
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
        "@typescript-eslint/switch-exhaustiveness-check": [
          "error",
          {
            allowDefaultCaseForExhaustiveSwitch: true,
            considerDefaultExhaustiveForUnions: true,
          },
        ],
        "@typescript-eslint/unbound-method": ["error", { ignoreStatic: true }],
        "@typescript-eslint/unified-signatures": ["error", { ignoreDifferentlyNamedParameters: true }],
        "@typescript-eslint/use-unknown-in-catch-callback-variable": "error",

        "no-loop-func": "off",
        "@typescript-eslint/no-loop-func": "error",

        "no-use-before-define": "off",
        "@typescript-eslint/no-use-before-define": [
          "error",
          {
            classes: true,
            functions: false,
            typedefs: true,
            variables: true,
          },
        ],

        "no-shadow": "off",
        "@typescript-eslint/no-shadow": [
          "warn",
          {
            allow: ["resolve", "reject", "done", "cb"],
            builtinGlobals: false,
            hoist: "never",
          },
        ],

        "no-dupe-class-members": "off",
        "@typescript-eslint/no-dupe-class-members": "off",

        "no-invalid-this": "off",
        "@typescript-eslint/no-invalid-this": "off",

        "no-redeclare": "off",
        "@typescript-eslint/no-redeclare": "off",

        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            args: "none",
            caughtErrors: "none",
            ignoreRestSiblings: true,
            vars: "all",
          },
        ],

        "no-throw-literal": "off",
        "@typescript-eslint/only-throw-error": [
          "error",
          {
            allowRethrowing: true,
            allowThrowingAny: true,
            allowThrowingUnknown: false,
          },
        ],

        "dot-notation": "off",
        "@typescript-eslint/dot-notation": ["error", { allowIndexSignaturePropertyAccess: true }],

        "@typescript-eslint/consistent-indexed-object-style": "error",
        "@typescript-eslint/consistent-type-definitions": ["error", "type"],

        "class-methods-use-this": "off",
        "@typescript-eslint/class-methods-use-this": "error",

        "no-array-constructor": "off",
        "@typescript-eslint/no-array-constructor": "error",

        "no-implied-eval": "off",
        "@typescript-eslint/no-implied-eval": "error",

        "no-return-await": "off",
        "@typescript-eslint/return-await": ["error", "in-try-catch"],

        "no-useless-constructor": "off",
        "@typescript-eslint/no-useless-constructor": "error",

        "prefer-destructuring": "off",
        "@typescript-eslint/prefer-destructuring": [
          "error",
          {
            VariableDeclarator: { array: false, object: true },
            AssignmentExpression: { array: true, object: true },
          },
          { enforceForRenamedProperties: false },
        ],

        "prefer-promise-reject-errors": "off",
        "@typescript-eslint/prefer-promise-reject-errors": "error",

        "require-await": "off",
        "@typescript-eslint/require-await": "error",

        ...(mode === "application"
          ? {
              "@typescript-eslint/no-empty-object-type": [
                "error",
                {
                  allowInterfaces: "with-single-extends",
                },
              ],
            }
          : {}),

        ...(functionalEnforcement === "none"
          ? {}
          : {
              "@typescript-eslint/naming-convention": [
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
                  prefix: ["mut_", "Mut_"],
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
                  prefix: ["mut_", "Mut_"],
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
                  filter: { regex: "^[mM]ut_[^_]+", match: true },
                  format: ["camelCase", "PascalCase"],
                  modifiers: ["const"],
                  prefix: ["mut_", "Mut_"],
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
                {
                  selector: "variable",
                  format: null,
                  modifiers: ["destructured"],
                },
                {
                  selector: ["autoAccessor", "parameterProperty", "property"],
                  filter: { regex: "^[A-Z0-9_]+$", match: true },
                  format: ["UPPER_CASE"],
                  leadingUnderscore: "forbid",
                  trailingUnderscore: "forbid",
                },
                {
                  selector: ["autoAccessor", "parameterProperty", "property"],
                  filter: { regex: "^[mM]ut_[^_]+", match: true },
                  format: ["camelCase", "PascalCase"],
                  prefix: ["mut_", "Mut_"],
                  leadingUnderscore: "forbid",
                  trailingUnderscore: "forbid",
                },
                {
                  selector: ["autoAccessor", "parameterProperty", "property"],
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
            }),

        ...overrides,
      },
    },
    {
      name: "rs:typescript:rules-non-type-aware",
      files,
      ignores: filesTypeAware,
      rules: ((pluginTs.configs?.["disable-type-checked"] as Linter.Config | undefined)?.rules ?? {}) as NonNullable<
        FlatConfigItem["rules"]
      >,
    },
    {
      name: "rs:typescript:tests-overrides",
      files: GLOB_TESTS,
      rules: {
        "@typescript-eslint/no-unused-expressions": "off",
        "@typescript-eslint/consistent-type-definitions": "off",
        "@typescript-eslint/triple-slash-reference": "off",
      },
    },
    {
      name: "rs:typescript:javascript-overrides",
      files: [GLOB_JS, GLOB_JSX],
      rules: {
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-require-imports": "off",
        "@typescript-eslint/no-var-requires": "off",
      },
    },
  ];
}
