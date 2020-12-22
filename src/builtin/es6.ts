import type { Linter } from "eslint";

export const rules: Linter.Config["rules"] = {
  "arrow-body-style": ["error", "as-needed"],
  "arrow-parens": ["error", "always"],
  "arrow-spacing": ["error", { before: true, after: true }],
  "constructor-super": "error",
  "generator-star-spacing": ["error", "after"],
  "no-class-assign": "error",
  "no-confusing-arrow": "off",
  "no-const-assign": "error",
  "no-dupe-class-members": "error",
  "no-duplicate-imports": "off",
  "no-new-symbol": "error",
  "no-this-before-super": "error",
  "no-useless-computed-key": "error",
  "no-useless-constructor": "error",
  "no-useless-rename": "error",
  "no-var": "error",
  "object-shorthand": "error",
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
  "prefer-numeric-literals": "error",
  "prefer-rest-params": "error",
  "prefer-spread": "error",
  "prefer-template": "error",
  "require-yield": "error",
  "rest-spread-spacing": ["error", "never"],
  "symbol-description": "error",
  "template-curly-spacing": ["error", "never"],
  "yield-star-spacing": ["error", "after"],
};
