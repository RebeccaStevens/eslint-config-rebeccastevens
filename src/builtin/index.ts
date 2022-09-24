import type { Linter } from "eslint";

import { rules as deprecated } from "./deprecated";
import { rules as layout } from "./layout+formatting";
import { rules as possibleProblems } from "./possible-problems";
import { rules as suggestions } from "./suggestions";

export const rules: Linter.Config["rules"] = {
  ...possibleProblems,
  ...suggestions,
  ...layout,
  ...deprecated,
};
