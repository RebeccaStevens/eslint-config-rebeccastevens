import { type Linter } from "eslint";

export const settings: Linter.Config = {
  plugins: ["markdown"],

  extends: ["plugin:markdown/recommended"],

  overrides: [
    {
      files: ["./**/*.md"],
      processor: "markdown/markdown",
    },
    {
      files: ["./**/*.md/**"],
      parserOptions: {
        project: null,
      },
      extends: [
        "plugin:markdown/recommended",
        "plugin:@typescript-eslint/disable-type-checked",
        "plugin:functional/off",
      ],
      rules: {
        "@typescript-eslint/consistent-type-definitions": "off",
        "@typescript-eslint/explicit-member-accessibility": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-expressions": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "import/no-unresolved": "off",
        "init-declarations": "off",
        "jsdoc/require-jsdoc": "off",
        "n/handle-callback-err": "off",
        "prefer-const": "off",
        "prettier/prettier": "off",
        "sonarjs/no-extra-arguments": "off",
        "sonarjs/no-unused-collection": "off",
        "unicorn/prefer-optional-catch-binding": "off",
        "unicorn/prefer-top-level-await": "off",
        "unicorn/switch-case-braces": "off",
        "no-console": "off",
        "no-empty": "off",
        "no-invalid-this": "off",
        "no-undef": "off",
        "no-useless-return": "off",
        "dot-notation": "off",
        "no-empty-function": "off",
        "no-throw-literal": "off",
        "no-unused-vars": "off",
      },
    },
  ],
};
