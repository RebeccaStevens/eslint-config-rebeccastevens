import { type Linter } from "eslint";

import { typescriptFiles } from "~/files";

export const settings: Linter.Config = {
  plugins: ["jsdoc"],

  extends: ["plugin:jsdoc/recommended"],

  rules: {
    "jsdoc/check-alignment": "error",
    // waiting on https://github.com/eslint/eslint/issues/14745
    // "jsdoc/check-examples": "error",
    "jsdoc/check-indentation": "error",
    "jsdoc/check-line-alignment": "error",
    "jsdoc/check-param-names": "error",
    "jsdoc/check-property-names": "error",
    "jsdoc/check-types": "error",
    "jsdoc/check-values": "error",
    "jsdoc/no-bad-blocks": [
      "error",
      {
        ignore: [
          "ts-check",
          "ts-expect-error",
          "ts-ignore",
          "ts-nocheck",
          "vue-ignore",
        ],
      },
    ],
    "jsdoc/no-defaults": "warn",
    "jsdoc/require-asterisk-prefix": "error",
    "jsdoc/require-description": "warn",
    // Rule is too strict.
    // "jsdoc/require-description-complete-sentence": "off",
    "jsdoc/require-hyphen-before-param-description": "error",
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
    "jsdoc/require-param-name": "error",
    "jsdoc/require-param": "off",
    "jsdoc/require-property-name": "error",
    "jsdoc/require-property": "off",
    "jsdoc/require-returns-check": "error",
    "jsdoc/require-returns": "off",
    "jsdoc/require-throws": "warn",
    "jsdoc/require-yields-check": "error",
    "jsdoc/tag-lines": [
      "warn",
      "never",
      {
        applyToEndTag: false,
        startLines: 1,
        tags: { example: { lines: "always" } },
      },
    ],
  },

  overrides: [
    {
      files: typescriptFiles,
      rules: {
        "jsdoc/no-types": "warn",
        "jsdoc/require-param-type": "off",
        "jsdoc/require-property-type": "off",
        "jsdoc/require-returns-type": "off",
      },
    },
  ],
};
