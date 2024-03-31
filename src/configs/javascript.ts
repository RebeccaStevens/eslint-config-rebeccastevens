import { type ESLint } from "eslint";
import globals from "globals";

import {
  type FlatConfigItem,
  type OptionsFunctional,
  type OptionsIsInEditor,
  type OptionsOverrides,
} from "../types";
import { loadPackages } from "../utils";

const useNumberIsFinite = "Please use Number.isFinite instead";
const useNumberIsNan = "Please use Number.isNaN instead";
const useObjectDefineProperty = "Please use Object.defineProperty instead.";

export async function javascript(
  options: OptionsIsInEditor & OptionsOverrides & OptionsFunctional = {},
): Promise<FlatConfigItem[]> {
  const {
    isInEditor = false,
    functionalEnforcement = "none",
    overrides = {},
  } = options;

  const [pluginOptimizeRegex, pluginPromise, pluginSonar] = (await loadPackages(
    [
      "eslint-plugin-optimize-regex",
      "eslint-plugin-promise",
      "eslint-plugin-sonarjs",
    ],
  )) as [ESLint.Plugin, ESLint.Plugin, ESLint.Plugin];

  return [
    {
      name: "rs:javascript",
      languageOptions: {
        ecmaVersion: "latest",
        globals: {
          ...globals.browser,
          ...globals.es2021,
          ...globals.node,
          document: "readonly",
          navigator: "readonly",
          window: "readonly",
        },
        parserOptions: {
          ecmaFeatures: { jsx: true },
          ecmaVersion: "latest",
          sourceType: "module",
        },
        sourceType: "module",
      },
      linterOptions: {
        reportUnusedDisableDirectives: true,
      },
      plugins: {
        "optimize-regex": pluginOptimizeRegex,
        promise: pluginPromise,
        sonar: pluginSonar,
      },
      rules: {
        "accessor-pairs": "error",
        "array-callback-return": "error",
        "arrow-body-style": ["error", "as-needed"],
        "block-scoped-var": "error",
        "class-methods-use-this": "error",
        "consistent-return": ["error", { treatUndefinedAsUnspecified: false }],
        "constructor-super": "error",
        curly: ["error", "all"],
        "default-case-last": "error",
        "dot-notation": ["error", { allowKeywords: true }],
        eqeqeq: ["error", "always", { null: "always" }],
        "for-direction": "error",
        "func-name-matching": "error",
        "func-names": ["error", "as-needed"],
        "func-style": ["error", "declaration", { allowArrowFunctions: true }],
        "getter-return": "error",
        "grouped-accessor-pairs": "error",
        "guard-for-in": "error",
        "logical-assignment-operators": "error",
        "max-classes-per-file": ["error", 1],
        "max-depth": ["error", 10],
        "new-cap": [
          "error",
          { capIsNew: false, newIsCap: true, properties: true },
        ],
        "no-alert": "error",
        "no-array-constructor": "error",
        "no-async-promise-executor": "error",
        "no-await-in-loop": "error",
        "no-caller": "error",
        "no-case-declarations": "error",
        "no-class-assign": "error",
        "no-compare-neg-zero": "error",
        "no-cond-assign": ["error", "always"],
        "no-console": isInEditor
          ? "off"
          : ["error", { allow: ["warn", "error"] }],
        "no-const-assign": "error",
        "no-constant-binary-expression": "error",
        "no-constant-condition": "error",
        "no-constructor-return": "error",
        "no-control-regex": "error",
        "no-debugger": isInEditor ? "off" : "error",
        "no-delete-var": "error",
        "no-dupe-args": "error",
        "no-dupe-class-members": "error",
        "no-dupe-keys": "error",
        "no-duplicate-case": "error",
        "no-else-return": ["error", { allowElseIf: false }],
        "no-empty-character-class": "error",
        "no-empty-pattern": "error",
        "no-empty": ["error", { allowEmptyCatch: true }],
        "no-eq-null": "error",
        "no-eval": "error",
        "no-ex-assign": "error",
        "no-extend-native": "error",
        "no-extra-bind": "error",
        "no-extra-boolean-cast": "error",
        "no-extra-label": "error",
        "no-fallthrough": "error",
        "no-func-assign": "error",
        "no-global-assign": "error",
        "no-implicit-coercion": "error",
        "no-implicit-globals": "error",
        "no-implied-eval": "error",
        "no-import-assign": "error",
        "no-inner-declarations": ["error", "functions"],
        "no-invalid-regexp": "error",
        "no-invalid-this": "error",
        "no-irregular-whitespace": "error",
        "no-iterator": "error",
        "no-label-var": "error",
        "no-labels": ["error", { allowLoop: true, allowSwitch: true }],
        "no-lone-blocks": "error",
        "no-lonely-if": "error",
        "no-loop-func": "error",
        "no-loss-of-precision": "error",
        "no-misleading-character-class": "error",
        "no-multi-assign": "error",
        "no-multi-str": "error",
        "no-new-func": "error",
        "no-new-object": "error",
        "no-new-symbol": "error",
        "no-new-wrappers": "error",
        "no-new": "error",
        "no-obj-calls": "error",
        "no-octal-escape": "error",
        "no-octal": "error",
        "no-promise-executor-return": "error",
        "no-proto": "error",
        "no-prototype-builtins": "error",
        "no-redeclare": ["error", { builtinGlobals: false }],
        "no-regex-spaces": "error",
        "no-restricted-globals": [
          "error",
          { name: "event", message: "Use local parameter instead." },
          { name: "global", message: "Use `globalThis` instead." },
          { name: "self", message: "Use `globalThis` instead." },
          { name: "window", message: "Use `globalThis` instead." },
        ],
        "no-restricted-properties": [
          "error",
          {
            property: "__proto__",
            message:
              "Use `Object.getPrototypeOf` or `Object.setPrototypeOf` instead.",
          },
          {
            property: "__lookupGetter__",
            message: "Use `Object.getOwnPropertyDescriptor` instead.",
          },
          {
            property: "__lookupSetter__",
            message: "Use `Object.getOwnPropertyDescriptor` instead.",
          },
          {
            object: "arguments",
            property: "callee",
            message: "arguments.callee is deprecated",
          },
          {
            object: "global",
            property: "isFinite",
            message: useNumberIsFinite,
          },
          { object: "self", property: "isFinite", message: useNumberIsFinite },
          {
            object: "window",
            property: "isFinite",
            message: useNumberIsFinite,
          },
          { object: "global", property: "isNaN", message: useNumberIsNan },
          { object: "self", property: "isNaN", message: useNumberIsNan },
          { object: "window", property: "isNaN", message: useNumberIsNan },
          { property: "__defineGetter__", message: useObjectDefineProperty },
          { property: "__defineSetter__", message: useObjectDefineProperty },
        ],
        "no-restricted-syntax": [
          "error",
          {
            selector: "ForInStatement",
            message:
              "for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.",
          },
          {
            selector: "WithStatement",
            message:
              "`with` is disallowed in strict mode because it makes code impossible to predict and optimize.",
          },
          {
            selector:
              ':not(ArrowFunctionExpression) > UnaryExpression[operator="void"] > :not(CallExpression)',
            message: 'Don\'t use "void".',
          },
        ],
        "no-return-assign": "error",
        "no-return-await": "error",
        "no-script-url": "error",
        "no-self-assign": ["error", { props: true }],
        "no-self-compare": "error",
        "no-sequences": "error",
        "no-shadow-restricted-names": "error",
        "no-shadow": [
          "warn",
          {
            allow: ["resolve", "reject", "done", "cb"],
            builtinGlobals: false,
            hoist: "never",
          },
        ],
        "no-sparse-arrays": "error",
        "no-template-curly-in-string": "error",
        "no-this-before-super": "error",
        "no-throw-literal": "error",
        "no-undef-init": "error",
        "no-undef": "error",
        "no-unexpected-multiline": "error",
        "no-unmodified-loop-condition": "error",
        "no-unneeded-ternary": ["error", { defaultAssignment: false }],
        "no-unreachable-loop": "error",
        "no-unreachable": "error",
        "no-unsafe-finally": "error",
        "no-unsafe-negation": "error",
        "no-unused-expressions": [
          "error",
          {
            allowShortCircuit: true,
            allowTaggedTemplates: true,
            allowTernary: true,
          },
        ],
        "no-unused-labels": "error",
        "no-unused-private-class-members": "error",
        "no-unused-vars": [
          "error",
          {
            args: "none",
            caughtErrors: "none",
            ignoreRestSiblings: true,
            vars: "all",
          },
        ],
        "no-use-before-define": [
          "error",
          { classes: true, functions: false, variables: true },
        ],
        "no-useless-backreference": "error",
        "no-useless-call": "error",
        "no-useless-catch": "error",
        "no-useless-computed-key": "error",
        "no-useless-concat": "error",
        "no-useless-constructor": "error",
        "no-useless-escape": "error",
        "no-useless-rename": "error",
        "no-useless-return": "error",
        "no-var": "error",
        "no-with": "error",
        "object-shorthand": [
          "error",
          "always",
          { avoidQuotes: true, ignoreConstructors: false },
        ],
        "one-var": ["error", { var: "never", let: "never", const: "never" }],
        "operator-assignment": ["error", "always"],
        "prefer-arrow-callback": [
          "error",
          { allowNamedFunctions: false, allowUnboundThis: true },
        ],
        "prefer-const": isInEditor
          ? "off"
          : ["error", { destructuring: "all", ignoreReadBeforeAssign: true }],
        "prefer-destructuring": [
          "error",
          {
            VariableDeclarator: { array: false, object: true },
            AssignmentExpression: { array: true, object: true },
          },
          { enforceForRenamedProperties: false },
        ],
        "prefer-exponentiation-operator": "error",
        "prefer-numeric-literals": "error",
        "prefer-object-has-own": "error",
        "prefer-object-spread": "error",
        "prefer-promise-reject-errors": "error",
        "prefer-regex-literals": ["error", { disallowRedundantWrapping: true }],
        "prefer-rest-params": "error",
        "prefer-spread": "error",
        "prefer-template": "error",
        radix: "error",
        "require-atomic-updates": "error",
        "require-await": "error",
        "require-unicode-regexp": "error",
        "require-yield": "error",
        "sort-imports": [
          "error",
          {
            allowSeparatedGroups: false,
            ignoreCase: false,
            ignoreDeclarationSort: true,
            ignoreMemberSort: false,
            memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
          },
        ],
        strict: ["error", "never"],
        "symbol-description": "error",
        "unicode-bom": ["error", "never"],
        "use-isnan": [
          "error",
          { enforceForIndexOf: true, enforceForSwitchCase: true },
        ],
        "valid-typeof": ["error", { requireStringLiterals: true }],
        "vars-on-top": "error",
        yoda: ["error", "never"],

        "optimize-regex/optimize-regex": "error",

        "promise/avoid-new": "warn",
        "promise/no-callback-in-promise": "error",
        // "promise/no-nesting": "error", // Doesn't work with eslint 9 yet
        "promise/no-new-statics": "error",
        // "promise/no-promise-in-callback": "error", // Doesn't work with eslint 9 yet
        "promise/no-return-in-finally": "error",
        // "promise/no-return-wrap": "error", // Doesn't work with eslint 9 yet
        "promise/param-names": "error",
        "promise/valid-params": "error",

        ...(isInEditor
          ? {}
          : {
              "sonar/no-all-duplicated-branches": "error",
              "sonar/no-collapsible-if": "error",
              "sonar/no-collection-size-mischeck": "error",
              "sonar/no-duplicated-branches": "error",
              "sonar/no-element-overwrite": "error",
              // "sonar/no-empty-collection": "error", // Doesn't work with eslint 9 yet
              // "sonar/no-extra-arguments": "error", // Doesn't work with eslint 9 yet
              // "sonar/no-gratuitous-expressions": "error", // Doesn't work with eslint 9 yet
              "sonar/no-identical-conditions": "error",
              "sonar/no-identical-expressions": "error",
              "sonar/no-identical-functions": "error",
              "sonar/no-ignored-return": "error",
              "sonar/no-inverted-boolean-check": "error",
              "sonar/no-nested-switch": "error",
              "sonar/no-nested-template-literals": "error",
              "sonar/no-one-iteration-loop": "error",
              "sonar/no-redundant-boolean": "error",
              // "sonar/no-redundant-jump": "error", // Doesn't work with eslint 9 yet
              "sonar/no-same-line-conditional": "error",
              // "sonar/no-unused-collection": "error", // Doesn't work with eslint 9 yet
              // "sonar/no-use-of-empty-return-value": "error", // Doesn't work with eslint 9 yet
              "sonar/no-useless-catch": "error",
              "sonar/non-existent-operator": "error",
              "sonar/prefer-immediate-return": "error",
              "sonar/prefer-object-literal": "error",
              "sonar/prefer-single-boolean-return": "error",
              "sonar/prefer-while": "error",
            }),

        ...(functionalEnforcement === "none"
          ? {}
          : functionalEnforcement === "lite"
            ? { "no-param-reassign": "error" }
            : {
                "no-param-reassign": "error",
                "sonar/elseif-without-else": "error",
              }),

        ...overrides,
      },
    },
  ];
}
