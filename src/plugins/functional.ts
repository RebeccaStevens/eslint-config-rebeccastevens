import type { Linter } from "eslint";

export const settings: Linter.Config = {
  plugins: ["functional"],

  extends: ["plugin:functional/recommended"],

  rules: {
    "functional/no-expression-statements": "error",
    "functional/immutable-data": [
      "error",
      {
        ignoreAccessorPattern: ["**.mutable*.**", "**.m_*.**"],
        ignoreClasses: "fieldsOnly",
        ignoreImmediateMutation: true,
      },
    ],
    "functional/no-let": [
      "error",
      {
        allowInForLoopInit: true,
        ignorePattern: ["^mutable", "^m_"],
      },
    ],
  },
};
