import type { Linter } from "eslint";

export const settings: Linter.Config = {
  plugins: ["tsdoc"],

  rules: {
    "tsdoc/syntax": "warn",
  },
};
