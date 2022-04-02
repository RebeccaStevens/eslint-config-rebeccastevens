import type { Linter } from "eslint";

export const settings: Linter.Config = {
  plugins: ["functional"],

  rules: {
    "functional/no-expression-statement": "error",
    "functional/immutable-data": [
      "error",
      {
        ignoreAccessorPattern: ["**.mutable*.**", "**.m_*.**"],
        ignoreClass: "fieldsOnly",
        ignoreImmediateMutation: true,
      },
    ],
    "functional/no-conditional-statement": [
      "error",
      {
        allowReturningBranches: true,
      },
    ],
    "functional/no-let": [
      "error",
      {
        allowInForLoopInit: true,
        ignorePattern: ["^mutable", "^m_"],
      },
    ],
    "functional/no-loop-statement": "error",
    "functional/no-mixed-type": "error",
    "functional/no-throw-statement": [
      "error",
      {
        allowInAsyncFunctions: true,
      },
    ],
    "functional/no-return-void": "error",
  },

  overrides: [
    {
      files: ["**/*.cjs"],
      rules: {
        "functional/immutable-data": "off",
        "functional/no-expression-statement": "off",
      },
    },
  ],
};
