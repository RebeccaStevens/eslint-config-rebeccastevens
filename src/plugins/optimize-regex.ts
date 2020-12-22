import type { Linter } from "eslint";

export const settings: Linter.Config = {
  plugins: ["optimize-regex"],

  rules: {
    "optimize-regex/optimize-regex": "warn",
  },
};
