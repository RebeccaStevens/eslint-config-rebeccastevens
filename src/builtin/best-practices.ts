import type { Linter } from "eslint";

const useNumberIsFinite = "Please use Number.isFinite instead";
const useNumberIsNan = "Please use Number.isNaN instead";
const useObjectDefineProperty = "Please use Object.defineProperty instead.";

export const rules: Linter.Config["rules"] = {
  "accessor-pairs": "error",
  "array-callback-return": [
    "error",
    {
      allowImplicit: false,
    },
  ],
  "block-scoped-var": "error",
  "class-methods-use-this": "error",
  "complexity": "off",
  "consistent-return": [
    "error",
    {
      treatUndefinedAsUnspecified: false,
    },
  ],
  "curly": ["error", "all"],
  "default-case": "error",
  "dot-location": ["error", "property"],
  "dot-notation": "error",
  "eqeqeq": ["error", "always", { null: "always" }],
  "guard-for-in": "error",
  "max-classes-per-file": ["error", 1],
  "no-alert": "error",
  "no-caller": "error",
  "no-case-declarations": "error",
  "no-div-regex": "off",
  "no-else-return": [
    "error",
    {
      allowElseIf: false,
    },
  ],
  "no-empty-function": ["error"],
  "no-empty-pattern": "error",
  "no-eq-null": "error",
  "no-eval": "error",
  "no-extend-native": "error",
  "no-extra-bind": "error",
  "no-extra-label": "error",
  "no-fallthrough": "error",
  "no-floating-decimal": "error",
  "no-global-assign": "error",
  "no-implicit-coercion": "error",
  "no-implicit-globals": "error",
  "no-implied-eval": "error",
  "no-invalid-this": "error",
  "no-iterator": "error",
  "no-labels": "error",
  "no-lone-blocks": "error",
  "no-loop-func": "error",
  "no-magic-numbers": "off",
  "no-multi-spaces": [
    "error",
    {
      ignoreEOLComments: true,
    },
  ],
  "no-multi-str": "off",
  "no-new": "error",
  "no-new-func": "error",
  "no-new-wrappers": "error",
  "no-octal": "error",
  "no-octal-escape": "error",
  "no-param-reassign": "error",
  "no-proto": "error",
  "no-redeclare": "error",
  "no-restricted-properties": [
    "error",
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
    {
      object: "self",
      property: "isFinite",
      message: useNumberIsFinite,
    },
    {
      object: "window",
      property: "isFinite",
      message: useNumberIsFinite,
    },
    {
      object: "global",
      property: "isNaN",
      message: useNumberIsNan,
    },
    {
      object: "self",
      property: "isNaN",
      message: useNumberIsNan,
    },
    {
      object: "window",
      property: "isNaN",
      message: useNumberIsNan,
    },
    {
      property: "__defineGetter__",
      message: useObjectDefineProperty,
    },
    {
      property: "__defineSetter__",
      message: useObjectDefineProperty,
    },
    {
      object: "Math",
      property: "pow",
      message: "Use the exponentiation operator (**) instead.",
    },
  ],
  "no-return-assign": "error",
  "no-return-await": "error",
  "no-script-url": "error",
  "no-self-assign": "error",
  "no-self-compare": "error",
  "no-sequences": "error",
  "no-throw-literal": "error",
  "no-unmodified-loop-condition": "error",
  "no-unused-expressions": "error",
  "no-unused-labels": "error",
  "no-useless-call": "error",
  "no-useless-concat": "error",
  "no-useless-escape": "error",
  "no-useless-return": "error",
  "no-void": "off",
  "no-warning-comments": "warn",
  "no-with": "error",
  "prefer-named-capture-group": "off",
  "prefer-promise-reject-errors": "error",
  "radix": "error",
  "require-await": "off",
  "require-unicode-regexp": "error",
  "vars-on-top": "off",
  "wrap-iife": [
    "error",
    "inside",
    {
      functionPrototypeMethods: true,
    },
  ],
  "yoda": ["error", "never"],
};
