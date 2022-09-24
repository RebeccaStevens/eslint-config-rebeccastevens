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
    "@typescript-eslint/array-type": [
      "error",
      {
        default: "array-simple",
        readonly: "generic",
      },
    ],
    "@typescript-eslint/ban-types": [
      "error",
      {
        extendDefaults: true,
        types: {
          "{}": false,
          "object": false,
          "Object": {
            fixWith: "object",
            message: "Use object instead",
          },
        },
      },
    ],
    "@typescript-eslint/comma-dangle": [
      "error",
      {
        arrays: "only-multiline",
        exports: "only-multiline",
        functions: "ignore",
        imports: "only-multiline",
        objects: "only-multiline",
      },
    ],
    "@typescript-eslint/consistent-indexed-object-style": "error",
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/dot-notation": "error",
    "@typescript-eslint/explicit-function-return-type": [
      "off",
      {
        allowConciseArrowFunctionExpressionsStartingWithVoid: true,
        allowExpressions: true,
        allowHigherOrderFunctions: true,
        allowTypedFunctionExpressions: true,
      },
    ],
    "@typescript-eslint/explicit-member-accessibility": [
      "error",
      {
        accessibility: "explicit",
      },
    ],
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/indent": ["error", 2],
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
        format: ["camelCase", "PascalCase"],
        leadingUnderscore: "allow",
        trailingUnderscore: "forbid",
      },
      {
        selector: "variable",
        format: ["camelCase", "PascalCase", "UPPER_CASE"],
        prefix: ["m_", "M_"],
        leadingUnderscore: "allow",
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
        selector: "memberLike",
        format: ["camelCase", "PascalCase", "UPPER_CASE"],
        prefix: ["m_", "M_"],
        leadingUnderscore: "allow",
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
        selector: ["classMethod", "typeMethod", "typeProperty"],
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
    "@typescript-eslint/no-confusing-void-expression": [
      "error",
      {
        ignoreArrowShorthand: false,
        ignoreVoidOperator: true,
      },
    ],
    "@typescript-eslint/no-extra-parens": [
      "error",
      "all",
      {
        nestedBinaryExpressions: false,
      },
    ],
    "@typescript-eslint/no-invalid-void-type": "error",
    "@typescript-eslint/no-loop-func": "error",
    "@typescript-eslint/no-loss-of-precision": "error",
    "@typescript-eslint/no-non-null-assertion": "off",
    // "node" plugin will handle this.
    "@typescript-eslint/no-require-imports": "off",
    "@typescript-eslint/no-shadow": [
      "warn",
      {
        allow: ["resolve", "reject", "done", "cb"],
        builtinGlobals: false,
        hoist: "never",
      },
    ],
    "@typescript-eslint/no-throw-literal": "error",
    "@typescript-eslint/no-unnecessary-condition": "error",
    "@typescript-eslint/no-unnecessary-type-constraint": "error",
    "@typescript-eslint/no-unsafe-argument": "warn",
    "@typescript-eslint/no-unsafe-assignment": "warn",
    "@typescript-eslint/no-unsafe-call": "warn",
    "@typescript-eslint/no-unsafe-member-access": "warn",
    "@typescript-eslint/no-unsafe-return": "warn",
    "@typescript-eslint/no-unused-expressions": [
      "error",
      {
        allowShortCircuit: true,
        allowTaggedTemplates: true,
        allowTernary: true,
      },
    ],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        args: "none",
        caughtErrors: "none",
        ignoreRestSiblings: true,
        vars: "all",
      },
    ],
    "@typescript-eslint/no-use-before-define": [
      "error",
      {
        classes: true,
        functions: false,
        typedefs: true,
        variables: true,
      },
    ],
    "@typescript-eslint/no-var-requires": "error",
    "@typescript-eslint/non-nullable-type-assertion-style": "error",
    "@typescript-eslint/object-curly-spacing": ["error", "always"],
    "@typescript-eslint/prefer-for-of": "warn",
    "@typescript-eslint/prefer-includes": "warn",
    "@typescript-eslint/prefer-interface": "off",
    "@typescript-eslint/prefer-nullish-coalescing": "warn",
    "@typescript-eslint/prefer-optional-chain": "warn",
    "@typescript-eslint/prefer-readonly-parameter-types": "off",
    "@typescript-eslint/prefer-regexp-exec": "error",
    "@typescript-eslint/prefer-string-starts-ends-with": "warn",
    "@typescript-eslint/prefer-ts-expect-error": "warn",
    "@typescript-eslint/promise-function-async": "off",
    "@typescript-eslint/restrict-plus-operands": [
      "error",
      {
        checkCompoundAssignments: true,
      },
    ],
    "@typescript-eslint/restrict-template-expressions": [
      "error",
      {
        allowAny: true,
        allowBoolean: true,
        allowNullish: true,
        allowNumber: true,
      },
    ],
    "@typescript-eslint/space-infix-ops": "error",
    "@typescript-eslint/sort-type-union-intersection-members": "off",
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
    "@typescript-eslint/switch-exhaustiveness-check": "warn",
    "@typescript-eslint/type-annotation-spacing": "error",
    "@typescript-eslint/unbound-method": [
      "error",
      {
        ignoreStatic: true,
      },
    ],
    "@typescript-eslint/unified-signatures": "warn",
    "@typescript-eslint/no-redeclare": "error",
  },
};
