import type { FlatConfigItem } from "../types";

export function inEditor(): FlatConfigItem[] {
  return [
    {
      name: "rs:in-editor",
      rules: {
        "no-console": "off",
        "no-debugger": "off",
        "prefer-const": "off",

        "sonar/no-all-duplicated-branches": "off",
        "sonar/no-collapsible-if": "off",
        "sonar/no-collection-size-mischeck": "off",
        "sonar/no-duplicated-branches": "off",
        "sonar/no-element-overwrite": "off",
        "sonar/no-empty-collection": "off",
        "sonar/no-extra-arguments": "off",
        "sonar/no-gratuitous-expressions": "off",
        "sonar/no-identical-conditions": "off",
        "sonar/no-identical-expressions": "off",
        "sonar/no-identical-functions": "off",
        "sonar/no-ignored-return": "off",
        "sonar/no-inverted-boolean-check": "off",
        "sonar/no-nested-switch": "off",
        "sonar/no-nested-template-literals": "off",
        "sonar/no-redundant-boolean": "off",
        "sonar/no-redundant-jump": "off",
        "sonar/no-same-line-conditional": "off",
        "sonar/no-unused-collection": "off",
        "sonar/no-use-of-empty-return-value": "off",
        "sonar/no-useless-catch": "off",
        "sonar/non-existent-operator": "off",
        "sonar/prefer-immediate-return": "off",
        "sonar/prefer-object-literal": "off",
        "sonar/prefer-single-boolean-return": "off",
        "sonar/prefer-while": "off",

        "test/no-only-tests": "off",

        "unicorn/no-lonely-if": "off",
      },
    },
  ];
}
