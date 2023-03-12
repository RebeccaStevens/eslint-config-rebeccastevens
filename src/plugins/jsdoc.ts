import { typescriptFiles } from "common/files";
import type { Linter } from "eslint";

export const settings: Linter.Config = {
  plugins: ["jsdoc"],

  extends: ["plugin:jsdoc/recommended"],

  rules: {
    // waiting on https://github.com/eslint/eslint/issues/14745
    // "jsdoc/check-examples": "warn",
    "jsdoc/check-indentation": "warn",
    "jsdoc/check-line-alignment": "warn",
    "jsdoc/no-bad-blocks": "warn",
    "jsdoc/no-defaults": "warn",
    "jsdoc/require-asterisk-prefix": "warn",
    "jsdoc/require-description": "warn",
    // Rule is too strict.
    // "jsdoc/require-description-complete-sentence": "off",
    "jsdoc/require-hyphen-before-param-description": "warn",
    "jsdoc/require-jsdoc": [
      "warn",
      {
        contexts: [
          ":not(ExportNamedDeclaration) > FunctionDeclaration:not(TSDeclareFunction + FunctionDeclaration)",
          "ExportNamedDeclaration > FunctionDeclaration:not(ExportNamedDeclaration:has(TSDeclareFunction) + ExportNamedDeclaration > FunctionDeclaration)",
          "TSDeclareFunction",
          "ExportNamedDeclaration > TSTypeAliasDeclaration",
          "ExportNamedDeclaration > TSInterfaceDeclaration",
          "TSEnumDeclaration",
        ],
        enableFixer: false,
        require: {
          FunctionDeclaration: false,
        },
      },
    ],
    "jsdoc/require-throws": "warn",
    "jsdoc/tag-lines": [
      "warn",
      "never",
      { noEndLines: true, tags: { example: { lines: "always" } } },
    ],
  },

  overrides: [
    {
      files: typescriptFiles,
      rules: {
        "jsdoc/no-types": "warn",
        "jsdoc/require-param-type": "off",
        "jsdoc/require-param": "off",
        "jsdoc/require-property-type": "off",
        "jsdoc/require-property": "off",
        "jsdoc/require-returns-type": "off",
        "jsdoc/require-returns": "off",
      },
    },
  ],
};
