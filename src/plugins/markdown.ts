import type { Linter } from "eslint";

export const settings: Linter.Config = {
  plugins: ["markdown"],

  extends: ["plugin:markdown/recommended"],

  overrides: [
    {
      files: ["**/*.md"],
      processor: "markdown/markdown",
    },
    {
      files: ["**/*.md/**"],
      rules: {
        "no-console": "off",
        "prettier/prettier": "off",
      },
    },
  ],
};
