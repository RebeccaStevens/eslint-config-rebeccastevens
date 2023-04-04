import { type Linter } from "eslint";

import { typescriptDeclarationFiles } from "~/files";

const useNumberIsFinite = "Please use Number.isFinite instead";
const useNumberIsNan = "Please use Number.isNaN instead";
const useObjectDefineProperty = "Please use Object.defineProperty instead.";

export const rules: Linter.Config["rules"] = {
  "accessor-pairs": "error",
  "arrow-body-style": ["error", "as-needed"],
  "block-scoped-var": "error",
  "class-methods-use-this": "error",
  "consistent-return": [
    "error",
    {
      treatUndefinedAsUnspecified: false,
    },
  ],
  "curly": ["error", "all"],
  "default-case-last": "error",
  "default-param-last": "off",
  "dot-notation": "error",
  "eqeqeq": ["error", "always", { null: "always" }],
  "grouped-accessor-pairs": "error",
  "guard-for-in": "error",
  "init-declarations": "off",
  "logical-assignment-operators": "error",
  "max-classes-per-file": ["error", 1],
  "no-alert": "error",
  "no-caller": "error",
  "no-case-declarations": "error",
  "no-else-return": [
    "error",
    {
      allowElseIf: false,
    },
  ],
  "no-empty-function": "error",
  "no-eq-null": "error",
  "no-eval": "error",
  "no-extend-native": "error",
  "no-extra-bind": "error",
  "no-extra-label": "error",
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
  "no-multi-str": "off",
  "no-new-func": "error",
  "no-new-object": "error",
  "no-new-wrappers": "error",
  "no-new": "error",
  "no-octal-escape": "error",
  "no-octal": "error",
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
  ],
  "object-shorthand": "error",
  "no-delete-var": "error",
  "no-label-var": "error",
  "no-restricted-globals": [
    "error",
    {
      name: "event",
      message: "Use local parameter instead.",
    },
  ],
  "no-return-assign": "error",
  "no-return-await": "error",
  "no-script-url": "error",
  "no-sequences": "error",
  "no-shadow": [
    "warn",
    {
      builtinGlobals: false,
      hoist: "never",
      allow: ["resolve", "reject", "done", "cb"],
    },
  ],
  "no-shadow-restricted-names": "error",
  "no-throw-literal": "error",
  "no-unused-expressions": "error",
  "no-unused-labels": "error",
  "no-useless-call": "error",
  "no-useless-computed-key": "error",
  "no-useless-concat": "error",
  "no-useless-constructor": "warn",
  "no-useless-escape": "error",
  "no-useless-rename": "error",
  "no-useless-return": "error",
  "no-var": "error",
  "no-void": "off",
  "no-warning-comments": "off",
  "no-with": "error",
  "prefer-arrow-callback": "error",
  "prefer-const": [
    "error",
    {
      destructuring: "all",
    },
  ],
  "prefer-destructuring": [
    "error",
    {
      VariableDeclarator: {
        array: false,
        object: true,
      },
      AssignmentExpression: {
        array: true,
        object: true,
      },
    },
    {
      enforceForRenamedProperties: false,
    },
  ],
  "prefer-exponentiation-operator": "error",
  "prefer-numeric-literals": "error",
  "prefer-object-has-own": "error",
  "prefer-promise-reject-errors": "error",
  "prefer-regex-literals": "error",
  "prefer-rest-params": "error",
  "prefer-spread": "error",
  "prefer-template": "error",
  "radix": "error",
  "require-await": "error",
  "require-unicode-regexp": "error",
  "require-yield": "error",
  "strict": ["error", "never"],
  "symbol-description": "error",
  "yoda": ["error", "never"],
};

export const overrides: NonNullable<Linter.Config["overrides"]> = [
  {
    files: typescriptDeclarationFiles,
    rules: {
      "init-declarations": "off",
    },
  },
];
