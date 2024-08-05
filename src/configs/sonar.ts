import type { ESLint } from "eslint";

import type { FlatConfigItem, OptionsFunctional } from "../types";
import { loadPackages } from "../utils";

export async function sonar(
  options: Readonly<Required<OptionsFunctional>>,
): Promise<FlatConfigItem[]> {
  const { functionalEnforcement = "none" } = options;

  const [pluginSonar] = (await loadPackages(["eslint-plugin-sonarjs"])) as [
    ESLint.Plugin,
  ];

  return [
    {
      name: "rs:node",
      plugins: {
        sonar: pluginSonar,
      },
      rules: {
        "sonar/no-all-duplicated-branches": "error",
        "sonar/no-collapsible-if": "error",
        "sonar/no-collection-size-mischeck": "error",
        "sonar/no-duplicated-branches": "error",
        "sonar/no-element-overwrite": "error",
        "sonar/no-empty-collection": "error",
        "sonar/no-extra-arguments": "error",
        "sonar/no-gratuitous-expressions": "error",
        "sonar/no-identical-conditions": "error",
        "sonar/no-identical-expressions": "error",
        "sonar/no-identical-functions": "error",
        "sonar/no-ignored-return": "error",
        "sonar/no-inverted-boolean-check": "error",
        "sonar/no-nested-switch": "error",
        "sonar/no-nested-template-literals": "error",
        "sonar/no-one-iteration-loop": "error",
        "sonar/no-redundant-boolean": "error",
        "sonar/no-redundant-jump": "error",
        "sonar/no-same-line-conditional": "error",
        "sonar/no-unused-collection": "error",
        "sonar/no-use-of-empty-return-value": "error",
        "sonar/no-useless-catch": "error",
        "sonar/non-existent-operator": "error",
        "sonar/prefer-immediate-return": "error",
        "sonar/prefer-object-literal": "error",
        "sonar/prefer-single-boolean-return": "error",
        "sonar/prefer-while": "error",

        ...(functionalEnforcement === "recommended" ||
        functionalEnforcement === "strict"
          ? {
              "sonar/elseif-without-else": "error",
            }
          : {}),
      },
    },
  ];
}
