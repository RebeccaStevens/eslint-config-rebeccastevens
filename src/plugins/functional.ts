import type { Linter } from "eslint";

export const settings: Linter.Config = {
  plugins: ["functional"],

  extends: [
    "plugin:functional/external-recommended",
    "plugin:functional/recommended",
    "plugin:functional/stylistic",
  ],

  rules: {
    "functional/prefer-readonly-type": [
      "error",
      {
        allowMutableReturnType: true,
        ignoreClass: true,
      },
    ],
    "functional/no-conditional-statement": [
      "error",
      {
        allowReturningBranches: true,
      },
    ],
    "functional/prefer-type-literal": "off",
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
