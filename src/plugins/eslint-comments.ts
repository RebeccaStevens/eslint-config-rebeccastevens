import type { Linter } from "eslint";

export const settings: Linter.Config = {
  plugins: ["eslint-comments"],

  extends: ["plugin:eslint-comments/recommended"],
};
