import type { Linter } from "eslint";

import {
  rules as deprecatedRules,
  overrides as deprecatedOverrides,
} from "./deprecated";
import {
  rules as layoutRules,
  overrides as layoutOverrides,
} from "./layout+formatting";
import {
  rules as possibleProblemsRules,
  overrides as possibleProblemsOverrides,
} from "./possible-problems";
import {
  rules as suggestionsRules,
  overrides as suggestionsOverrides,
} from "./suggestions";

export const rules: Linter.Config["rules"] = {
  ...possibleProblemsRules,
  ...suggestionsRules,
  ...layoutRules,
  ...deprecatedRules,
};

export const overrides: NonNullable<Linter.Config["overrides"]> = [
  ...deprecatedOverrides,
  ...layoutOverrides,
  ...possibleProblemsOverrides,
  ...suggestionsOverrides,
];
