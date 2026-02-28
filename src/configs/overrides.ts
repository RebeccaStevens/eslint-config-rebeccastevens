import { GLOB_DTS, GLOB_SRC, GLOB_SRC_EXT, GLOB_TYPINGS } from "../globs";
import type { FlatConfigItem } from "../types";
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
        "import-x/no-duplicates": "off",
        "no-restricted-syntax": "off",
      },
    },
    {
      name: "rs:overrides-typings",
      files: [GLOB_TYPINGS],
      rules: {
        ...pluginFunctional?.configs.off.rules,

        "import-x/no-unassigned-import": "off",

        "jsdoc/check-examples": "off",
        "jsdoc/check-indentation": "off",
        "jsdoc/check-line-alignment": "off",
        "jsdoc/check-param-names": "off",
        "jsdoc/check-property-names": "off",
        "jsdoc/check-types": "off",
        "jsdoc/check-values": "off",
        "jsdoc/no-bad-blocks": "off",
        "jsdoc/no-defaults": "off",
        "jsdoc/require-asterisk-prefix": "off",
        "jsdoc/require-description": "off",
        "jsdoc/require-description-complete-sentence": "off",
        "jsdoc/require-hyphen-before-param-description": "off",
        "jsdoc/require-jsdoc": "off",
        "jsdoc/require-param-name": "off",
        "jsdoc/require-param": "off",
        "jsdoc/require-property-name": "off",
        "jsdoc/require-property": "off",
        "jsdoc/require-returns-check": "off",
        "jsdoc/require-returns": "off",
        "jsdoc/require-throws": "off",
        "jsdoc/require-yields-check": "off",
        "jsdoc/tag-lines": "off",
        "jsdoc/check-access": "off",
        "jsdoc/empty-tags": "off",
        "jsdoc/implements-on-classes": "off",
        "jsdoc/no-multi-asterisks": "off",
        "jsdoc/require-property-description": "off",
        "jsdoc/require-returns-description": "off",
        "jsdoc/check-alignment": "off",
        "jsdoc/multiline-blocks": "off",

        "@typescript-eslint/consistent-type-definitions": "off",
        "@typescript-eslint/no-empty-object-type": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": "off",
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

        "n/no-sync": "off",
        "n/no-unpublished-import": "off",
      },
    },
  ];
}
