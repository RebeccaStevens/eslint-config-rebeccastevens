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
      plugins: { ts: pluginTs },
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
        "import/named": "off",
        "no-undef": "off",

        "ts/array-type": ["error", { default: "array-simple", readonly: "generic" }],
        "ts/await-thenable": "error",
        "ts/ban-ts-comment": ["error", { minimumDescriptionLength: 10 }],
        "ts/explicit-function-return-type": [
          "off",
          {
            allowConciseArrowFunctionExpressionsStartingWithVoid: true,
            allowExpressions: true,
            allowHigherOrderFunctions: true,
            allowTypedFunctionExpressions: true,
          },
        ],
        "ts/explicit-member-accessibility": ["error", { accessibility: "explicit" }],
        "ts/no-array-delete": "error",
        "ts/no-base-to-string": "error",
        "ts/no-confusing-void-expression": [
          "error",
          {
            ignoreArrowShorthand: false,
            ignoreVoidOperator: true,
            ignoreVoidReturningFunctions: true,
          },
        ],
        "ts/no-duplicate-enum-values": "error",
        "ts/no-duplicate-type-constituents": "error",
        "ts/no-dynamic-delete": "error",
        "ts/no-explicit-any": unsafe,
        "ts/no-extra-non-null-assertion": "error",
        "ts/no-extraneous-class": "error",
        "ts/no-floating-promises": "error",
        "ts/no-for-in-array": "error",
        "ts/no-invalid-void-type": "error",
        // "ts/no-meaningless-void-operator": "error",
        "ts/no-misused-new": "error",
        "ts/no-misused-promises": "error",
        "ts/no-mixed-enums": "error",
        "ts/no-namespace": "error",
        "ts/no-non-null-asserted-nullish-coalescing": "error",
        "ts/no-non-null-asserted-optional-chain": "error",
        // "ts/no-non-null-assertion": "error",
        "ts/no-redundant-type-constituents": "error",
        "ts/no-this-alias": "error",
        "ts/no-unnecessary-boolean-literal-compare": "error",
        "ts/no-unnecessary-condition": ["error", { allowConstantLoopConditions: true }],
        "ts/no-unnecessary-type-arguments": "error",
        "ts/no-unnecessary-type-assertion": "error",
        "ts/no-unnecessary-type-constraint": "error",
        "ts/no-unsafe-argument": unsafe,
        "ts/no-unsafe-assignment": unsafe,
        "ts/no-unsafe-call": unsafe,
        "ts/no-unsafe-declaration-merging": unsafe,
        "ts/no-unsafe-enum-comparison": unsafe,
        "ts/no-unsafe-function-type": unsafe,
        "ts/no-unsafe-member-access": unsafe,
        "ts/no-unsafe-return": unsafe,
        "ts/no-unused-expressions": [
          "error",
          {
            allowShortCircuit: true,
            allowTaggedTemplates: true,
            allowTernary: true,
          },
        ],
        "ts/no-unnecessary-template-expression": "error",
        "ts/no-wrapper-object-types": "error",
        "ts/non-nullable-type-assertion-style": "error",
        "ts/prefer-as-const": "error",
        "ts/prefer-for-of": "error",
        "ts/prefer-includes": "error",
        "ts/prefer-literal-enum-member": "error",
        "ts/prefer-nullish-coalescing": "error",
        "ts/prefer-optional-chain": "error",
        // "ts/prefer-readonly-parameter-types": "error",
        "ts/prefer-reduce-type-parameter": "error",
        "ts/prefer-regexp-exec": "error",
        "ts/prefer-return-this-type": "error",
        "ts/prefer-string-starts-ends-with": "error",
        "ts/restrict-plus-operands": [
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
        "ts/restrict-template-expressions": [
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
        "ts/switch-exhaustiveness-check": [
          "error",
          {
            allowDefaultCaseForExhaustiveSwitch: true,
            considerDefaultExhaustiveForUnions: true,
          },
        ],
        "ts/unbound-method": ["error", { ignoreStatic: true }],
        "ts/unified-signatures": ["error", { ignoreDifferentlyNamedParameters: true }],
        "ts/use-unknown-in-catch-callback-variable": "error",

        "no-loop-func": "off",
        "ts/no-loop-func": "error",

        "no-use-before-define": "off",
        "ts/no-use-before-define": [
          "error",
          {
            classes: true,
            functions: false,
            typedefs: true,
            variables: true,
          },
        ],

        "no-shadow": "off",
        "ts/no-shadow": [
          "warn",
          {
            allow: ["resolve", "reject", "done", "cb"],
            builtinGlobals: false,
            hoist: "never",
          },
        ],

        "no-dupe-class-members": "off",
        "ts/no-dupe-class-members": "off",

        "no-invalid-this": "off",
        "ts/no-invalid-this": "off",

        "no-redeclare": "off",
        "ts/no-redeclare": "off",

        "no-unused-vars": "off",
        "ts/no-unused-vars": [
          "error",
          {
            args: "none",
            caughtErrors: "none",
            ignoreRestSiblings: true,
            vars: "all",
          },
        ],

        "no-throw-literal": "off",
        "ts/only-throw-error": "error",

        "dot-notation": "off",
        "ts/dot-notation": ["error", { allowIndexSignaturePropertyAccess: true }],

        "ts/consistent-indexed-object-style": "error",
        "ts/consistent-type-definitions": ["error", "type"],

        "class-methods-use-this": "off",
        "ts/class-methods-use-this": "error",

        "no-array-constructor": "off",
        "ts/no-array-constructor": "error",

        "no-implied-eval": "off",
        "ts/no-implied-eval": "error",

        "no-return-await": "off",
        "ts/return-await": ["error", "in-try-catch"],

        "no-useless-constructor": "off",
        "ts/no-useless-constructor": "error",

        "prefer-destructuring": "off",
        "ts/prefer-destructuring": [
          "error",
          {
            VariableDeclarator: { array: false, object: true },
            AssignmentExpression: { array: true, object: true },
          },
          { enforceForRenamedProperties: false },
        ],

        "prefer-promise-reject-errors": "off",
        "ts/prefer-promise-reject-errors": "error",

        "require-await": "off",
        "ts/require-await": "error",

        ...(mode === "application"
          ? {
              "ts/no-empty-object-type": [
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
      rules: ((pluginTs.configs?.["disable-type-checked"] as Linter.FlatConfig).rules ?? {}) as NonNullable<
        FlatConfigItem["rules"]
      >,
    },
    {
      name: "rs:typescript:tests-overrides",
      files: GLOB_TESTS,
      rules: {
        "ts/no-unused-expressions": "off",
        "ts/consistent-type-definitions": "off",
        "ts/triple-slash-reference": "off",
      },
    },
    {
      name: "rs:typescript:javascript-overrides",
      files: [GLOB_JS, GLOB_JSX],
      rules: {
        "ts/ban-ts-comment": "off",
        "ts/no-require-imports": "off",
        "ts/no-var-requires": "off",
      },
    },
  ];
}
