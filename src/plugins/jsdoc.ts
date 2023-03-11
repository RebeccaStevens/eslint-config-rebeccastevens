import type { Linter } from "eslint";

export const settings: Linter.Config = {
  plugins: ["jsdoc"],

  rules: {
    "jsdoc/check-access": "warn",
    "jsdoc/check-alignment": "warn",
    // waiting on https://github.com/eslint/eslint/issues/14745
    // "jsdoc/check-examples": "warn",
    "jsdoc/check-indentation": "warn",
    "jsdoc/check-line-alignment": "warn",
    "jsdoc/check-param-names": "warn",
    "jsdoc/check-property-names": "warn",
    "jsdoc/check-tag-names": "warn",
    "jsdoc/check-types": "warn",
    "jsdoc/check-values": "warn",
    "jsdoc/empty-tags": "warn",
    "jsdoc/implements-on-classes": "warn",
    "jsdoc/multiline-blocks": "warn",
    "jsdoc/newline-after-description": "warn",
    "jsdoc/no-bad-blocks": "warn",
    "jsdoc/no-defaults": "warn",
    "jsdoc/no-multi-asterisks": "warn",
    // For TypeScript
    "jsdoc/no-types": "warn",
    "jsdoc/no-undefined-types": "warn",
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
    "jsdoc/require-param-description": "warn",
    "jsdoc/require-param-name": "warn",
    "jsdoc/require-property-description": "warn",
    "jsdoc/require-property-name": "warn",
    "jsdoc/require-returns-check": "warn",
    "jsdoc/require-returns-description": "warn",
    "jsdoc/require-throws": "error",
    "jsdoc/require-yields": "warn",
    "jsdoc/require-yields-check": "warn",
    "jsdoc/tag-lines": [
      "warn",
      "never",
      { noEndLines: true, tags: { example: { lines: "always" } } },
    ],
    "jsdoc/valid-types": "warn",
  },
};
