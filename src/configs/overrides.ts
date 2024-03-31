import { GLOB_DTS, GLOB_SRC, GLOB_SRC_EXT, GLOB_TYPINGS } from "../globs";
import { type FlatConfigItem } from "../types";
import { interopDefault } from "../utils";

export async function overrides(): Promise<FlatConfigItem[]> {
  const [pluginFunctional] = await Promise.all([
    interopDefault(import("eslint-plugin-functional")).catch(() => undefined),
  ]);

  return [
    {
      files: [GLOB_DTS],
      name: "rs:typescript:dts-overrides",
      rules: {
        "eslint-comments/no-unlimited-disable": "off",
        "import/no-duplicates": "off",
        "no-restricted-syntax": "off",
      },
    },
    {
      name: "rs:overrides-typings",
      files: [GLOB_TYPINGS],
      rules: {
        ...pluginFunctional?.configs.off.rules,
        "ts/consistent-type-definitions": "off",
        "ts/no-unused-vars": "off",
        "ts/no-explicit-any": "off",
      },
    },
    {
      name: "rs:overrides-scripts",
      files: [`scripts/${GLOB_SRC}`, `cli.${GLOB_SRC_EXT}`],
      rules: {
        "no-console": "off",

        "functional/no-conditional-statements": "off",
        "functional/no-expression-statements": "off",
        "functional/no-loop-statements": "off",
        "functional/no-return-void": "off",
        "functional/no-throw-statements": "off",

        "node/no-sync": "off",
        "node/no-unpublished-import": "off",
      },
    },
  ];
}
