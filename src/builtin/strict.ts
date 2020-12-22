import type { Linter } from "eslint";

export const rules: Linter.Config["rules"] = {
  strict: ["error", "never"],
};
