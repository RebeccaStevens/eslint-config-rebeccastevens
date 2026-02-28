import type { ESLint } from "eslint";

import type { FlatConfigItem, OptionsFunctional } from "../types";
import { loadPackages } from "../utils";

export async function sonar(options: Readonly<Required<OptionsFunctional>>): Promise<FlatConfigItem[]> {
  const { functionalEnforcement = "none" } = options;

  const [pluginSonar] = (await loadPackages(["eslint-plugin-sonarjs"])) as [ESLint.Plugin];

  return [
    {
      name: "rs:sonar",
      plugins: {
        sonarjs: pluginSonar,
      },
      rules: {
        "sonarjs/no-all-duplicated-branches": "error",
        "sonarjs/no-collapsible-if": "error",
        "sonarjs/no-collection-size-mischeck": "error",
        "sonarjs/no-duplicated-branches": "error",
        "sonarjs/no-element-overwrite": "error",
        "sonarjs/no-empty-collection": "error",
        "sonarjs/no-extra-arguments": "error",
        "sonarjs/no-gratuitous-expressions": "error",
        "sonarjs/no-identical-conditions": "error",
        "sonarjs/no-identical-expressions": "error",
        "sonarjs/no-identical-functions": "error",
        "sonarjs/no-ignored-return": "error",
        "sonarjs/no-inverted-boolean-check": "error",
        "sonarjs/no-nested-switch": "error",
        "sonarjs/no-nested-template-literals": "error",
        "sonarjs/no-redundant-boolean": "error",
        "sonarjs/no-redundant-jump": "error",
        "sonarjs/no-same-line-conditional": "error",
        "sonarjs/no-unused-collection": "error",
        "sonarjs/no-use-of-empty-return-value": "error",
        "sonarjs/no-useless-catch": "error",
        "sonarjs/non-existent-operator": "error",
        "sonarjs/prefer-immediate-return": "error",
        "sonarjs/prefer-object-literal": "error",
        "sonarjs/prefer-single-boolean-return": "error",
        "sonarjs/prefer-while": "error",

        ...(functionalEnforcement === "recommended" || functionalEnforcement === "strict"
          ? {
              "sonarjs/elseif-without-else": "error",
            }
          : {}),
      },
    },
  ];
}
