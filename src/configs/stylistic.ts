import type { StylisticCustomizeOptions } from "@stylistic/eslint-plugin";
import type { ESLint } from "eslint";

import type { FlatConfigItem, OptionsHasTypeScript, OptionsOverrides, StylisticConfig } from "../types";
import { loadPackages } from "../utils";

export const StylisticConfigDefaults: Required<StylisticConfig> = {
  indent: 2,
  jsx: true,
  quotes: "double",
  semi: true,
  printWidth: 120,
};

export async function stylistic(
  options: Readonly<Required<{ stylistic: Required<StylisticConfig> } & OptionsOverrides & OptionsHasTypeScript>>,
): Promise<FlatConfigItem[]> {
  const {
    stylistic: { indent, jsx, quotes, semi },
    overrides,
    typescript,
  } = options;

  const [pluginStylistic] = (await loadPackages(["@stylistic/eslint-plugin"])) as [
    typeof import("@stylistic/eslint-plugin").default,
  ];

  const config = pluginStylistic.configs.customize({
    flat: true,
    indent,
    jsx,
    pluginName: "@stylistic",
    quotes,
    semi,
  } as StylisticCustomizeOptions);

  return [
    {
      name: "rs:stylistic",
      plugins: {
        "@stylistic": pluginStylistic as ESLint.Plugin,
      },
      rules: {
        ...config.rules,

        "@stylistic/array-bracket-spacing": ["error", "never"],
        "@stylistic/arrow-parens": ["error", "always"],
        "@stylistic/arrow-spacing": ["error", { before: true, after: true }],
        "@stylistic/block-spacing": ["error", "always"],
        "@stylistic/brace-style": "error",
        "@stylistic/comma-dangle": [
          "error",
          {
            arrays: "only-multiline",
            exports: "only-multiline",
            functions: "ignore",
            imports: "only-multiline",
            objects: "only-multiline",

            ...(typescript
              ? {
                  enums: "only-multiline",
                  generics: "only-multiline",
                  tuples: "only-multiline",
                }
              : {}),
          },
        ],
        "@stylistic/comma-spacing": ["error", { before: false, after: true }],
        "@stylistic/comma-style": ["error", "last"],
        "@stylistic/computed-property-spacing": "error",
        "@stylistic/dot-location": ["error", "property"],
        "@stylistic/eol-last": "error",
        "@stylistic/function-call-spacing": ["error", "never"],
        "@stylistic/generator-star-spacing": ["error", "after"],
        "@stylistic/indent": typescript
          ? "off"
          : [
              "error",
              indent,
              {
                SwitchCase: 1,
                VariableDeclarator: 1,
                outerIIFEBody: 1,
                MemberExpression: 1,
                FunctionDeclaration: { parameters: 1, body: 1 },
                FunctionExpression: { parameters: 1, body: 1 },
                CallExpression: { arguments: 1 },
                ArrayExpression: 1,
                ObjectExpression: 1,
                ImportDeclaration: 1,
                flatTernaryExpressions: false,
                ignoreComments: false,
              },
            ],
        "@stylistic/indent-binary-ops": "error",
        "@stylistic/key-spacing": ["error", { beforeColon: false, afterColon: true }],
        "@stylistic/keyword-spacing": ["error", { before: true, after: true }],
        "@stylistic/linebreak-style": ["error", "unix"],
        "@stylistic/lines-around-comment": [
          "warn",
          {
            beforeBlockComment: true,
            beforeLineComment: false,
            afterBlockComment: false,
            afterLineComment: false,
            afterHashbangComment: true,
            allowBlockStart: true,
            allowBlockEnd: true,
            allowObjectStart: true,
            allowObjectEnd: true,
            allowArrayStart: true,
            allowArrayEnd: true,
            allowClassStart: true,
            allowClassEnd: true,

            ...(typescript
              ? {
                  allowEnumEnd: true,
                  allowEnumStart: true,
                  allowInterfaceEnd: true,
                  allowInterfaceStart: true,
                  allowModuleEnd: true,
                  allowModuleStart: true,
                  allowTypeEnd: true,
                  allowTypeStart: true,
                }
              : {}),
          },
        ],
        "@stylistic/lines-between-class-members": [
          "error",
          "always",
          {
            exceptAfterSingleLine: true,
            ...(typescript
              ? {
                  exceptAfterOverload: true,
                }
              : {}),
          },
        ],
        "@stylistic/max-statements-per-line": ["error", { max: 1 }],
        "@stylistic/multiline-ternary": ["error", "always-multiline"],
        "@stylistic/new-parens": "error",
        "@stylistic/newline-per-chained-call": ["error", { ignoreChainWithDepth: 2 }],
        "@stylistic/no-extra-parens": ["error", "all", { nestedBinaryExpressions: false }],
        "@stylistic/no-extra-semi": "error",
        "@stylistic/no-floating-decimal": "error",
        "@stylistic/no-mixed-operators": [
          "error",
          {
            groups: [
              ["+", "-", "*", "/", "%", "**"],
              ["&", "|", "^", "~", "<<", ">>", ">>>"],
              ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
              ["&&", "||"],
              ["in", "instanceof"],
            ],
            allowSamePrecedence: true,
          },
        ],
        "@stylistic/no-mixed-spaces-and-tabs": "error",
        "@stylistic/no-multi-spaces": ["error", { ignoreEOLComments: true }],
        "@stylistic/no-multiple-empty-lines": ["error", { max: 1, maxEOF: 1 }],
        "@stylistic/no-tabs": "error",
        "@stylistic/no-trailing-spaces": "error",
        "@stylistic/no-whitespace-before-property": "error",
        "@stylistic/nonblock-statement-body-position": ["error", "beside", { overrides: {} }],
        "@stylistic/object-curly-newline": [
          "error",
          {
            ObjectExpression: {
              minProperties: 3,
              multiline: true,
              consistent: true,
            },
            ObjectPattern: {
              minProperties: 3,
              multiline: true,
              consistent: true,
            },
          },
        ],
        "@stylistic/object-curly-spacing": ["error", "always"],
        "@stylistic/object-property-newline": ["error", { allowAllPropertiesOnSameLine: true }],
        "@stylistic/one-var-declaration-per-line": ["error", "always"],
        "@stylistic/operator-linebreak": [
          "error",
          "after",
          {
            overrides: {
              // "=": "none",
              "==": "none",
              "===": "none",
              "?": "before",
              ":": "before",
              "|": "before",
            },
          },
        ],
        "@stylistic/padded-blocks": [
          "error",
          {
            blocks: "never",
            switches: "never",
            classes: "never",
          },
        ],
        "@stylistic/quote-props": ["error", "consistent-as-needed"],
        "@stylistic/quotes": ["error", quotes, { avoidEscape: true, allowTemplateLiterals: "never" }],
        "@stylistic/rest-spread-spacing": ["error", "never"],
        "@stylistic/semi-spacing": ["error", { before: false, after: true }],
        "@stylistic/semi-style": ["error", "last"],
        "@stylistic/semi": ["error", semi ? "always" : "never"],
        "@stylistic/space-before-blocks": ["error", "always"],
        "@stylistic/space-before-function-paren": [
          "error",
          {
            asyncArrow: "always",
            anonymous: "never",
            named: "never",
          },
        ],
        "@stylistic/space-in-parens": ["error", "never"],
        "@stylistic/space-infix-ops": "error",
        "@stylistic/space-unary-ops": ["error", { words: true, nonwords: false }],
        "@stylistic/spaced-comment": [
          "error",
          "always",
          {
            line: {
              exceptions: ["-", "+", "*"],
              markers: ["*package", "!", "/", ",", "="],
            },
            block: {
              balanced: true,
              exceptions: ["-", "+", "*"],
              markers: ["*package", "!", "*", ",", ":", "::", "flow-include"],
            },
          },
        ],
        "@stylistic/switch-colon-spacing": ["error", { after: true, before: false }],
        "@stylistic/template-curly-spacing": ["error", "never"],
        "@stylistic/template-tag-spacing": ["error", "never"],
        "@stylistic/wrap-iife": ["error", "inside", { functionPrototypeMethods: true }],
        "@stylistic/yield-star-spacing": ["error", "after"],

        ...(typescript
          ? {
              "@stylistic/member-delimiter-style": "error",
              "@stylistic/type-annotation-spacing": "error",
            }
          : {}),

        ...overrides,
      },
    },
  ];
}
