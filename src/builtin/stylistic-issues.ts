import type { Linter } from "eslint";

export const rules: Linter.Config["rules"] = {
  "array-bracket-spacing": ["error", "never"],
  "block-spacing": ["error", "always"],
  "brace-style": "error",
  "capitalized-comments": "off",
  "comma-dangle": [
    "error",
    {
      arrays: "only-multiline",
      objects: "only-multiline",
      imports: "only-multiline",
      exports: "only-multiline",
      functions: "ignore",
    },
  ],
  "comma-spacing": ["error", { before: false, after: true }],
  "comma-style": ["error", "last"],
  "computed-property-spacing": "error",
  "consistent-this": "off",
  "eol-last": "error",
  "func-call-spacing": ["error", "never"],
  "func-name-matching": "error",
  "func-names": ["error", "as-needed"],
  "func-style": ["error", "declaration", { allowArrowFunctions: true }],
  "function-paren-newline": "off",
  "implicit-arrow-linebreak": "off",
  "indent": [
    "error",
    2,
    {
      SwitchCase: 1,
      VariableDeclarator: 1,
      outerIIFEBody: 1,
      MemberExpression: 1,
      FunctionDeclaration: {
        parameters: 1,
        body: 1,
      },
      FunctionExpression: {
        parameters: 1,
        body: 1,
      },
      CallExpression: {
        arguments: 1,
      },
      ArrayExpression: 1,
      ObjectExpression: 1,
      ImportDeclaration: 1,
      flatTernaryExpressions: false,
      ignoreComments: false,
    },
  ],
  "key-spacing": ["error", { beforeColon: false, afterColon: true }],
  "keyword-spacing": ["error", { before: true, after: true }],
  "line-comment-position": "off",
  "linebreak-style": ["error", "unix"],
  "lines-around-comment": [
    "warn",
    {
      beforeBlockComment: true,
      beforeLineComment: false,
      afterBlockComment: false,
      afterLineComment: false,
      allowBlockStart: true,
      allowBlockEnd: true,
      allowObjectStart: true,
      allowObjectEnd: true,
      allowArrayStart: true,
      allowArrayEnd: true,
      allowClassStart: true,
      allowClassEnd: true,
    },
  ],
  "lines-between-class-members": [
    "error",
    "always",
    {
      exceptAfterSingleLine: false,
    },
  ],
  "max-depth": ["error", 10],
  "max-len": [
    "off",
    {
      code: 100,
      ignoreComments: true,
    },
  ],
  "max-lines-per-function": "off",
  "max-nested-callbacks": "off",
  "max-params": "off",
  "max-statements-per-line": ["error", { max: 1 }],
  "multiline-comment-style": "off",
  "multiline-ternary": ["error", "always-multiline"],
  // This rule is implemented in a not very nice way when it comes to working with 3rd parties.
  "new-cap": "off",
  "new-parens": "error",
  "newline-per-chained-call": [
    "error",
    {
      ignoreChainWithDepth: 2,
    },
  ],
  "no-array-constructor": "error",
  "no-inline-comments": "off",
  "no-lonely-if": "error",
  "no-mixed-operators": [
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
  "no-mixed-spaces-and-tabs": "error",
  "no-multi-assign": "error",
  "no-multiple-empty-lines": [
    "error",
    {
      max: 1,
      maxEOF: 1,
    },
  ],
  "no-negated-condition": "off",
  "no-nested-ternary": "off",
  "no-new-object": "error",
  "no-plusplus": [
    "error",
    {
      allowForLoopAfterthoughts: true,
    },
  ],
  "no-restricted-syntax": [
    "error",
    {
      selector: "ForInStatement",
      message:
        "for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.",
    },
    {
      selector: "LabeledStatement",
      message:
        "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.",
    },
    {
      selector: "WithStatement",
      message:
        "`with` is disallowed in strict mode because it makes code impossible to predict and optimize.",
    },
    {
      selector:
        ':not(ArrowFunctionExpression) > UnaryExpression[operator="void"] > :not(CallExpression)',
      message: 'Don\'t use "void".',
    },
  ],
  "no-tabs": "error",
  "no-trailing-spaces": "error",
  "no-underscore-dangle": "off",
  "no-unneeded-ternary": "error",
  "no-whitespace-before-property": "error",
  "nonblock-statement-body-position": [
    "error",
    "beside",
    {
      overrides: {},
    },
  ],
  "object-curly-newline": [
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
  "object-curly-spacing": ["error", "always"],
  "object-property-newline": [
    "error",
    {
      allowAllPropertiesOnSameLine: true,
    },
  ],
  "one-var": [
    "error",
    {
      var: "never",
      let: "never",
      const: "never",
    },
  ],
  "one-var-declaration-per-line": ["error", "always"],
  "operator-assignment": ["error", "always"],
  "operator-linebreak": [
    "error",
    "after",
    {
      overrides: {
        "=": "none",
        "==": "none",
        "===": "none",
        "?": "before",
        ":": "before",
      },
    },
  ],
  "padded-blocks": [
    "error",
    {
      blocks: "never",
      switches: "never",
      classes: "never",
    },
  ],
  "prefer-object-spread": "error",
  "quote-props": ["error", "consistent-as-needed"],
  "quotes": [
    "error",
    "double",
    {
      avoidEscape: true,
      allowTemplateLiterals: true,
    },
  ],
  "semi": ["error", "always"],
  "semi-spacing": ["error", { before: false, after: true }],
  "semi-style": ["error", "last"],
  "space-before-blocks": ["error", "always"],
  "space-before-function-paren": [
    "error",
    {
      asyncArrow: "always",
      anonymous: "never",
      named: "never",
    },
  ],
  "space-in-parens": ["error", "never"],
  "space-infix-ops": "error",
  "space-unary-ops": [
    "error",
    {
      words: true,
      nonwords: false,
    },
  ],
  "spaced-comment": [
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
  "switch-colon-spacing": ["error", { after: true, before: false }],
  "template-tag-spacing": ["error", "never"],
  "unicode-bom": ["error", "never"],
  "wrap-regex": "off",
};
