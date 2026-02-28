import type { FlatConfigItem } from "../types";

export function inEditor(): FlatConfigItem[] {
  return [
    {
      name: "rs:in-editor",
      rules: {
        "no-console": "off",
        "no-debugger": "off",
        "prefer-const": "off",

        "sonarjs/no-all-duplicated-branches": "off",
        "sonarjs/no-collapsible-if": "off",
        "sonarjs/no-collection-size-mischeck": "off",
        "sonarjs/no-duplicated-branches": "off",
        "sonarjs/no-element-overwrite": "off",
        "sonarjs/no-empty-collection": "off",
        "sonarjs/no-extra-arguments": "off",
        "sonarjs/no-gratuitous-expressions": "off",
        "sonarjs/no-identical-conditions": "off",
        "sonarjs/no-identical-expressions": "off",
        "sonarjs/no-identical-functions": "off",
        "sonarjs/no-ignored-return": "off",
        "sonarjs/no-inverted-boolean-check": "off",
        "sonarjs/no-nested-switch": "off",
        "sonarjs/no-nested-template-literals": "off",
        "sonarjs/no-redundant-boolean": "off",
        "sonarjs/no-redundant-jump": "off",
        "sonarjs/no-same-line-conditional": "off",
        "sonarjs/no-unused-collection": "off",
        "sonarjs/no-use-of-empty-return-value": "off",
        "sonarjs/no-useless-catch": "off",
        "sonarjs/non-existent-operator": "off",
        "sonarjs/prefer-immediate-return": "off",
        "sonarjs/prefer-object-literal": "off",
        "sonarjs/prefer-single-boolean-return": "off",
        "sonarjs/prefer-while": "off",

        "vitest/no-only-tests": "off",

        "unicorn/no-lonely-if": "off",
      },
    },
  ];
}
