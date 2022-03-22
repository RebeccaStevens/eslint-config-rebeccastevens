import type { Linter } from "eslint";

import { rules as bestPractices } from "./best-practices";
import { rules as deprecated } from "./deprecated";
import { rules as es6 } from "./es6";
import { rules as possibleErrors } from "./possible-errors";
import { rules as strict } from "./strict";
import { rules as stylisticIssues } from "./stylistic-issues";
import { rules as variables } from "./variables";

export const rules: Linter.Config["rules"] = {
  ...bestPractices,
  ...es6,
  ...possibleErrors,
  ...strict,
  ...stylisticIssues,
  ...variables,
  ...deprecated,
};
