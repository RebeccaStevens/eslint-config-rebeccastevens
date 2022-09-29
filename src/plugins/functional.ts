import type { Linter } from "eslint";

export const settings: Linter.Config = {
  plugins: ["functional"],

  extends: ["plugin:functional/recommended"],

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
    "functional/no-let": [
      "error",
      {
        allowInForLoopInit: true,
        ignorePattern: ["^mutable", "^m_"],
      },
    ],
  },
};
