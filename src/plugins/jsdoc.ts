import type { Linter } from "eslint";

export const settings: Linter.Config = {
  plugins: ["jsdoc"],

  rules: {
    "jsdoc/check-alignment": "warn",
    "jsdoc/check-indentation": "warn",
    "jsdoc/check-param-names": "warn",
    "jsdoc/check-tag-names": "warn",
    "jsdoc/implements-on-classes": "warn",
    "jsdoc/newline-after-description": "warn",
    "jsdoc/no-types": "warn",
    "jsdoc/require-description": "warn",
    // Rule is too strict.
    "jsdoc/require-description-complete-sentence": "off",
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
    "jsdoc/require-param-description": "warn",
    "jsdoc/require-param-name": "warn",
    "jsdoc/require-returns-check": "warn",
    "jsdoc/require-returns-description": "warn",
  },
};
