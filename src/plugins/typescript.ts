import type { Linter } from "eslint";

export const settings: Linter.Config = {
  plugins: ["@typescript-eslint"],

  extends: [
    "plugin:import/typescript",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],

  rules: {
    "@typescript-eslint/array-type": ["error", { default: "generic", readonly: "generic" }],
    "@typescript-eslint/consistent-indexed-object-style": "error",
    "@typescript-eslint/indent": ["error", 2],
    "@typescript-eslint/no-non-null-assertion": "off",
    // "node" plugin will handle this.
    "@typescript-eslint/no-require-imports": "off",
    // Don't enable is non-ts files.
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-unused-vars": [
      "off",
      {
        args: "after-used",
        argsIgnorePattern: "^_",
        caughtErrors: "none",
        ignoreRestSiblings: true,
        vars: "all",
      },
    ],
    "@typescript-eslint/prefer-interface": "off",
    "@typescript-eslint/ban-types": [
      "error",
      {
        types: {
          "Object": { message: "Use object instead", fixWith: "object" },
          "{}": false,
          "object": false,
        },
        extendDefaults: true,
      },
    ],
    "@typescript-eslint/no-confusing-void-expression": [
      "error",
      {
        ignoreArrowShorthand: false,
        ignoreVoidOperator: true,
      },
    ],
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/explicit-function-return-type": [
      "off",
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true,
        allowConciseArrowFunctionExpressionsStartingWithVoid: true,
      },
    ],
    "@typescript-eslint/explicit-member-accessibility": ["error", { accessibility: "explicit" }],
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "default",
        format: ["camelCase", "PascalCase"],
        leadingUnderscore: "allow",
        trailingUnderscore: "forbid",
      },
      {
        selector: "variable",
        format: ["camelCase", "PascalCase", "UPPER_CASE"],
        leadingUnderscore: "forbid",
        trailingUnderscore: "forbid",
      },
      {
        selector: "variableLike",
        format: ["camelCase", "PascalCase"],
        leadingUnderscore: "allow",
        trailingUnderscore: "forbid",
      },
      { selector: "memberLike", format: ["camelCase", "PascalCase", "UPPER_CASE"] },
      {
        selector: "enumMember",
        format: ["UPPER_CASE"],
        leadingUnderscore: "forbid",
        trailingUnderscore: "forbid",
      },
      {
        selector: "typeLike",
        format: ["PascalCase"],
        leadingUnderscore: "forbid",
        trailingUnderscore: "forbid",
      },
    ],
    "@typescript-eslint/no-invalid-void-type": "error",
    "@typescript-eslint/no-loop-func": "error",
    "@typescript-eslint/no-throw-literal": "error",
    "@typescript-eslint/no-unnecessary-condition": "error",
    "@typescript-eslint/no-unnecessary-type-constraint": "error",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/no-unused-expressions": [
      "error",
      {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true,
      },
    ],
    "@typescript-eslint/no-unused-vars-experimental": [
      "warn",
      { ignoredNamesRegex: "^_", ignoreArgsIfArgsAfterAreUsed: true },
    ],
    "@typescript-eslint/no-use-before-define": [
      "error",
      {
        functions: false,
        classes: true,
        variables: true,
        typedefs: true,
      },
    ],
    "@typescript-eslint/non-nullable-type-assertion-style": "error",
    "@typescript-eslint/restrict-template-expressions": [
      "error",
      {
        allowNumber: true,
        allowBoolean: true,
        allowAny: true,
        allowNullish: true,
      },
    ],
    "@typescript-eslint/prefer-for-of": "warn",
    "@typescript-eslint/prefer-includes": "warn",
    "@typescript-eslint/prefer-nullish-coalescing": "warn",
    "@typescript-eslint/prefer-optional-chain": "warn",
    "@typescript-eslint/prefer-readonly-parameter-types": "warn",
    "@typescript-eslint/prefer-string-starts-ends-with": "warn",
    "@typescript-eslint/prefer-ts-expect-error": "warn",
    "@typescript-eslint/sort-type-union-intersection-members": "error",
    "@typescript-eslint/switch-exhaustiveness-check": "warn",
    "@typescript-eslint/unbound-method": [
      "error",
      {
        ignoreStatic: true,
      },
    ],
    "@typescript-eslint/unified-signatures": "warn",
  },

  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      rules: {
        "@typescript-eslint/no-var-requires": "error",
      },
    },
  ],
};
