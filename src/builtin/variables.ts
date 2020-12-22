import type { Linter } from "eslint";

export const rules: Linter.Config["rules"] = {
  "init-declarations": "error",
  "no-delete-var": "error",
  "no-label-var": "error",
  "no-restricted-globals": [
    "error",
    {
      name: "event",
      message: "Use local parameter instead.",
    },
  ],
  "no-shadow": [
    "warn",
    {
      builtinGlobals: false,
      hoist: "never",
      allow: ["resolve", "reject", "done", "cb"],
    },
  ],
  "no-shadow-restricted-names": "error",
  "no-undef": "error",
  "no-undef-init": "off",
  "no-undefined": "off",
  "no-unused-vars": [
    "error",
    {
      vars: "all",
      args: "after-used",
      ignoreRestSiblings: true,
    },
  ],
  "no-use-before-define": [
    "error",
    {
      functions: true,
      classes: true,
      variables: true,
    },
  ],
};
