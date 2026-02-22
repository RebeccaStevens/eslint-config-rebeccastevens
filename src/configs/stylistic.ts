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
    pluginName: "style",
    quotes,
    semi,
  } as StylisticCustomizeOptions);

  return [
    {
      name: "rs:stylistic",
      plugins: {
        style: pluginStylistic as ESLint.Plugin,
      },
      rules: {
        ...config.rules,

        "style/array-bracket-spacing": ["error", "never"],
        "style/arrow-parens": ["error", "always"],
        "style/arrow-spacing": ["error", { before: true, after: true }],
        "style/block-spacing": ["error", "always"],
        "style/brace-style": "error",
        "style/comma-dangle": [
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
        "style/comma-spacing": ["error", { before: false, after: true }],
        "style/comma-style": ["error", "last"],
        "style/computed-property-spacing": "error",
        "style/dot-location": ["error", "property"],
        "style/eol-last": "error",
        "style/function-call-spacing": ["error", "never"],
        "style/generator-star-spacing": ["error", "after"],
        "style/indent": typescript
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
        "style/indent-binary-ops": "error",
        "style/key-spacing": ["error", { beforeColon: false, afterColon: true }],
        "style/keyword-spacing": ["error", { before: true, after: true }],
        "style/linebreak-style": ["error", "unix"],
        "style/lines-around-comment": [
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
        "style/lines-between-class-members": [
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
        "style/max-statements-per-line": ["error", { max: 1 }],
        "style/multiline-ternary": ["error", "always-multiline"],
        "style/new-parens": "error",
        "style/newline-per-chained-call": ["error", { ignoreChainWithDepth: 2 }],
        "style/no-extra-parens": ["error", "all", { nestedBinaryExpressions: false }],
        "style/no-extra-semi": "error",
        "style/no-floating-decimal": "error",
        "style/no-mixed-operators": [
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
        "style/no-mixed-spaces-and-tabs": "error",
        "style/no-multi-spaces": ["error", { ignoreEOLComments: true }],
        "style/no-multiple-empty-lines": ["error", { max: 1, maxEOF: 1 }],
        "style/no-tabs": "error",
        "style/no-trailing-spaces": "error",
        "style/no-whitespace-before-property": "error",
        "style/nonblock-statement-body-position": ["error", "beside", { overrides: {} }],
        "style/object-curly-newline": [
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
        "style/object-curly-spacing": ["error", "always"],
        "style/object-property-newline": ["error", { allowAllPropertiesOnSameLine: true }],
        "style/one-var-declaration-per-line": ["error", "always"],
        "style/operator-linebreak": [
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
        "style/padded-blocks": [
          "error",
          {
            blocks: "never",
            switches: "never",
            classes: "never",
          },
        ],
        "style/quote-props": ["error", "consistent-as-needed"],
        "style/quotes": ["error", quotes, { avoidEscape: true, allowTemplateLiterals: true }],
        "style/rest-spread-spacing": ["error", "never"],
        "style/semi-spacing": ["error", { before: false, after: true }],
        "style/semi-style": ["error", "last"],
        "style/semi": ["error", semi ? "always" : "never"],
        "style/space-before-blocks": ["error", "always"],
        "style/space-before-function-paren": [
          "error",
          {
            asyncArrow: "always",
            anonymous: "never",
            named: "never",
          },
        ],
        "style/space-in-parens": ["error", "never"],
        "style/space-infix-ops": "error",
        "style/space-unary-ops": ["error", { words: true, nonwords: false }],
        "style/spaced-comment": [
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
        "style/switch-colon-spacing": ["error", { after: true, before: false }],
        "style/template-curly-spacing": ["error", "never"],
        "style/template-tag-spacing": ["error", "never"],
        "style/wrap-iife": ["error", "inside", { functionPrototypeMethods: true }],
        "style/yield-star-spacing": ["error", "after"],

        ...(typescript
          ? {
              "style/member-delimiter-style": "error",
              "style/type-annotation-spacing": "error",
            }
          : {}),

        ...overrides,
      },
    },
  ];
}
