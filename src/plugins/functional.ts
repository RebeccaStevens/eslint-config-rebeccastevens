import { type Linter } from "eslint";

export const settings: Linter.Config = {
  plugins: ["functional"],

  extends: ["plugin:functional/recommended"],

  settings: {
    immutability: {
      overrides: [
        { type: "^ReadonlyDeep<.+>$", to: "ReadonlyDeep" },
        { type: "^Immutable<.+>$", to: "Immutable" },
      ],
    },
  },

  rules: {
    "functional/no-expression-statements": [
      "error",
      {
        ignorePattern: "^assert",
      },
    ],
    "functional/immutable-data": [
      "error",
      {
        ignoreAccessorPattern: ["**.mutable*.**", "**.m_*.**"],
        ignoreClasses: "fieldsOnly",
        ignoreImmediateMutation: true,
      },
    ],
    "functional/no-classes": "off",
    "functional/no-let": [
      "error",
      {
        allowInForLoopInit: true,
        ignorePattern: ["^mutable", "^m_"],
      },
    ],
    "functional/prefer-immutable-types": [
      "warn",
      {
        enforcement: "None",
        ignoreInferredTypes: true,
        ignoreNamePattern: ["^m_"],
        parameters: {
          enforcement: "ReadonlyShallow",
        },
        fixer: {
          ReadonlyShallow: [
            {
              pattern: "^(Array|Map|Set)<(.+)>$",
              replace: "Readonly$1<$2>",
            },
            {
              pattern: "^(.+)$",
              replace: "Readonly<$1>",
            },
          ],
          ReadonlyDeep: [
            {
              pattern: "^(?:Readonly<(.+)>|(.+))$",
              replace: "ReadonlyDeep<$1$2>",
            },
          ],
          Immutable: [
            {
              pattern: "^(?:Readonly(?:Deep)?<(.+)>|(.+))$",
              replace: "Immutable<$1$2>",
            },
          ],
        },
      },
    ],
  },
};
