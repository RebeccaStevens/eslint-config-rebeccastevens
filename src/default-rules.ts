import { Linter } from 'eslint';

export const rules: Linter.Config['rules'] = {
  /*
   * --------------------------------------------
   * Possible Errors.
   * --------------------------------------------
   */

  'for-direction': 'error',
  'getter-return': 'error',
  'no-await-in-loop': 'error',
  'no-compare-neg-zero': 'error',
  'no-cond-assign': ['error', 'always'],
  'no-console': 'off',
  'no-constant-condition': 'error',
  'no-control-regex': 'error',
  'no-debugger': 'warn',
  'no-dupe-args': 'error',
  'no-dupe-keys': 'error',
  'no-duplicate-case': 'error',
  'no-empty': ['error', { allowEmptyCatch: true }],
  'no-empty-character-class': 'error',
  'no-ex-assign': 'error',
  'no-extra-boolean-cast': 'error',
  'no-extra-parens': [
    'error',
    'all',
    {
      nestedBinaryExpressions: false
    }
  ],
  'no-extra-semi': 'error',
  'no-func-assign': 'error',
  'no-inner-declarations': ['error', 'functions'],
  'no-invalid-regexp': 'error',
  'no-irregular-whitespace': 'error',
  'no-misleading-character-class': 'error',
  'no-obj-calls': 'error',
  'no-prototype-builtins': 'error',
  'no-regex-spaces': 'error',
  'no-sparse-arrays': 'error',
  'no-template-curly-in-string': 'warn',
  'no-unexpected-multiline': 'error',
  'no-unreachable': 'error',
  'no-unsafe-finally': 'error',
  'no-unsafe-negation': 'error',
  'require-atomic-updates': 'error',
  'use-isnan': 'error',
  'valid-typeof': [
    'error',
    {
      requireStringLiterals: true
    }
  ],

  /*
   * --------------------------------------------
   * Best Practices
   * --------------------------------------------
   */

  'accessor-pairs': 'error',
  'array-callback-return': [
    'error',
    {
      allowImplicit: false
    }
  ],
  'block-scoped-var': 'error',
  'class-methods-use-this': 'error',
  'complexity': ['error', { max: 30 }],
  'consistent-return': [
    'error',
    {
      treatUndefinedAsUnspecified: false
    }
  ],
  'curly': ['error', 'all'],
  'default-case': 'error',
  'dot-location': ['error', 'property'],
  'dot-notation': 'error',
  'eqeqeq': ['error', 'always', { null: 'always' }],
  'guard-for-in': 'error',
  'max-classes-per-file': ['error', 1],
  'no-alert': 'error',
  'no-caller': 'error',
  'no-case-declarations': 'error',
  'no-div-regex': 'off',
  'no-else-return': [
    'error',
    {
      allowElseIf: false
    }
  ],
  'no-empty-function': ['error'],
  'no-empty-pattern': 'error',
  'no-eq-null': 'error',
  'no-eval': 'error',
  'no-extend-native': 'error',
  'no-extra-bind': 'error',
  'no-extra-label': 'error',
  'no-fallthrough': 'error',
  'no-floating-decimal': 'error',
  'no-global-assign': 'error',
  'no-implicit-coercion': 'error',
  'no-implicit-globals': 'error',
  'no-implied-eval': 'error',
  'no-invalid-this': 'error',
  'no-iterator': 'error',
  'no-labels': 'error',
  'no-lone-blocks': 'error',
  'no-loop-func': 'error',
  'no-magic-numbers': ['error', {
    ignore: [-1, 0, 1, 2, 3, 4, 6, 8, 10, 12, 16, 32],
    ignoreArrayIndexes: true,
    detectObjects: true
  }],
  'no-multi-spaces': [
    'error',
    {
      ignoreEOLComments: true
    }
  ],
  'no-multi-str': 'off',
  'no-new': 'error',
  'no-new-func': 'error',
  'no-new-wrappers': 'error',
  'no-octal': 'error',
  'no-octal-escape': 'error',
  'no-param-reassign': 'error',
  'no-proto': 'error',
  'no-redeclare': 'error',
  'no-restricted-properties': [
    'error',
    {
      object: 'arguments',
      property: 'callee',
      message: 'arguments.callee is deprecated'
    },
    {
      object: 'global',
      property: 'isFinite',
      message: 'Please use Number.isFinite instead'
    },
    {
      object: 'self',
      property: 'isFinite',
      message: 'Please use Number.isFinite instead'
    },
    {
      object: 'window',
      property: 'isFinite',
      message: 'Please use Number.isFinite instead'
    },
    {
      object: 'global',
      property: 'isNaN',
      message: 'Please use Number.isNaN instead'
    },
    {
      object: 'self',
      property: 'isNaN',
      message: 'Please use Number.isNaN instead'
    },
    {
      object: 'window',
      property: 'isNaN',
      message: 'Please use Number.isNaN instead'
    },
    {
      property: '__defineGetter__',
      message: 'Please use Object.defineProperty instead.'
    },
    {
      property: '__defineSetter__',
      message: 'Please use Object.defineProperty instead.'
    },
    {
      object: 'Math',
      property: 'pow',
      message: 'Use the exponentiation operator (**) instead.'
    }
  ],
  'no-return-assign': 'error',
  'no-return-await': 'error',
  'no-script-url': 'error',
  'no-self-assign': 'error',
  'no-self-compare': 'error',
  'no-sequences': 'error',
  'no-throw-literal': 'error',
  'no-unmodified-loop-condition': 'error',
  'no-unused-expressions': 'error',
  'no-unused-labels': 'error',
  'no-useless-call': 'error',
  'no-useless-concat': 'error',
  'no-useless-escape': 'error',
  'no-useless-return': 'error',
  'no-void': 'error',
  'no-warning-comments': 'warn',
  'no-with': 'error',
  'prefer-named-capture-group': 'off',
  'prefer-promise-reject-errors': 'error',
  'radix': 'error',
  // All functions that return a promise should be marked as async.
  'require-await': 'off',
  'require-unicode-regexp': 'error',
  'vars-on-top': 'off',
  'wrap-iife': [
    'error',
    'inside',
    {
      functionPrototypeMethods: true
    }
  ],
  'yoda': ['error', 'never'],

  /*
   * --------------------------------------------
   * Strict Mode
   * --------------------------------------------
   */

  'strict': ['error', 'never'],

  /*
   * --------------------------------------------
   * Variables
   * --------------------------------------------
   */

  'init-declarations': 'error',
  'no-delete-var': 'error',
  'no-label-var': 'error',
  'no-restricted-globals': [
    'error',
    {
      name: 'event',
      message: 'Use local parameter instead.'
    },
    {
      name: 'fdescribe',
      message: 'Do not commit fdescribe. Use describe instead.'
    }
  ],
  'no-shadow': [
    'error',
    {
      builtinGlobals: false,
      hoist: 'never',
      allow: ['resolve', 'reject', 'done', 'cb']
    }
  ],
  'no-shadow-restricted-names': 'error',
  'no-undef': 'error',
  'no-undef-init': 'off',
  'no-undefined': 'off',
  'no-unused-vars': [
    'error',
    {
      vars: 'all',
      args: 'after-used',
      ignoreRestSiblings: true
    }
  ],
  'no-use-before-define': [
    'error',
    {
      functions: true,
      classes: true,
      variables: true
    }
  ],

  /*
   * --------------------------------------------
   * Node.js and CommonJS
   * --------------------------------------------
   */

  'callback-return': 'error',
  'handle-callback-err': ['error', '^(err|error)$'],
  'no-buffer-constructor': 'error',
  'no-mixed-requires': [
    'error',
    {
      grouping: true,
      allowCall: true
    }
  ],
  'no-new-require': 'error',
  'no-path-concat': 'error',
  'no-process-exit': 'error',
  'no-sync': 'error',

  /*
   * --------------------------------------------
   * Stylistic Issues
   * --------------------------------------------
   */

  'array-bracket-spacing': ['error', 'never'],
  'block-spacing': ['error', 'always'],
  'brace-style': 'error',
  'capitalized-comments': [
    'error',
    'always',
    {
      ignoreInlineComments: true,
      ignoreConsecutiveComments: true
    }
  ],
  'comma-dangle': [
    'error',
    {
      arrays: 'never',
      objects: 'never',
      imports: 'never',
      exports: 'never',
      functions: 'never'
    }
  ],
  'comma-spacing': ['error', { before: false, after: true }],
  'comma-style': ['error', 'last'],
  'computed-property-spacing': 'error',
  'consistent-this': 'off',
  'eol-last': 'error',
  'func-call-spacing': ['error', 'never'],
  'func-name-matching': 'error',
  'func-names': ['error', 'as-needed'],
  'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
  'function-paren-newline': ['error', 'multiline'],
  'implicit-arrow-linebreak': 'off',
  'indent': [
    'error',
    2,
    {
      SwitchCase: 1,
      VariableDeclarator: 1,
      outerIIFEBody: 1,
      MemberExpression: 1,
      FunctionDeclaration: {
        parameters: 1,
        body: 1
      },
      FunctionExpression: {
        parameters: 1,
        body: 1
      },
      CallExpression: {
        arguments: 1
      },
      ArrayExpression: 1,
      ObjectExpression: 1,
      ImportDeclaration: 1,
      flatTernaryExpressions: false,
      ignoreComments: false
    }
  ],
  'key-spacing': ['error', { beforeColon: false, afterColon: true }],
  'keyword-spacing': ['error', { before: true, after: true }],
  'line-comment-position': ['error', { position: 'above' }],
  'linebreak-style': ['error', 'unix'],
  'lines-around-comment': [
    'warn',
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
      allowClassEnd: true
    }
  ],
  'lines-between-class-members': [
    'error',
    'always',
    {
      exceptAfterSingleLine: false
    }
  ],
  'max-depth': ['error', 10],
  'max-len': [
    'error',
    {
      code: 80,
      comments: 120,
      tabWidth: 2,
      ignoreUrls: true,
      ignoreComments: false,
      ignoreTrailingComments: false,
      ignoreStrings: false,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: false
    }
  ],
  'max-lines-per-function': ['error', {
    max: 50,
    skipBlankLines: true,
    skipComments: true,
    IIFEs: true
  }],
  'max-nested-callbacks': ['error', 10],
  'max-params': ['error', { max: 6 }],
  'max-statements-per-line': ['error', { max: 1 }],
  'multiline-comment-style': 'error',
  'multiline-ternary': ['error', 'always-multiline'],
  'new-cap': ['error', { newIsCap: true, capIsNew: true }],
  'new-parens': 'error',
  'newline-per-chained-call': [
    'error',
    {
      ignoreChainWithDepth: 2
    }
  ],
  'no-array-constructor': 'error',
  'no-inline-comments': 'error',
  'no-lonely-if': 'error',
  'no-mixed-operators': [
    'error',
    {
      groups: [
        ['+', '-', '*', '/', '%', '**'],
        ['&', '|', '^', '~', '<<', '>>', '>>>'],
        ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
        ['&&', '||'],
        ['in', 'instanceof']
      ],
      allowSamePrecedence: true
    }
  ],
  'no-mixed-spaces-and-tabs': 'error',
  'no-multi-assign': 'error',
  'no-multiple-empty-lines': [
    'error',
    {
      max: 1,
      maxEOF: 1
    }
  ],
  'no-negated-condition': 'error',
  'no-nested-ternary': 'off',
  'no-new-object': 'error',
  'no-plusplus': [
    'error',
    {
      allowForLoopAfterthoughts: true
    }
  ],
  'no-restricted-syntax': [
    'error',
    {
      selector: 'ForInStatement',
      message:
        'for..in loops iterate over the entire prototype chain, which is ' +
        'virtually never what you want. Use Object.{keys,values,entries}, ' +
        'and iterate over the resulting array.'
    },
    {
      selector: 'LabeledStatement',
      message:
        'Labels are a form of GOTO; using them makes code confusing and hard ' +
        'to maintain and understand.'
    },
    {
      selector: 'WithStatement',
      message:
        '`with` is disallowed in strict mode because it makes code ' +
        'impossible to predict and optimize.'
    }
  ],
  'no-tabs': 'error',
  'no-trailing-spaces': 'error',
  'no-underscore-dangle': [
    'error',
    {
      allow: [],
      allowAfterThis: false,
      allowAfterSuper: false,
      enforceInMethodNames: true
    }
  ],
  'no-unneeded-ternary': 'error',
  'no-whitespace-before-property': 'error',
  'nonblock-statement-body-position': [
    'error',
    'beside',
    {
      overrides: {}
    }
  ],
  'object-curly-newline': [
    'error',
    {
      ObjectExpression: {
        minProperties: 3,
        multiline: true,
        consistent: true
      },
      ObjectPattern: {
        minProperties: 3,
        multiline: true,
        consistent: true
      }
    }
  ],
  'object-curly-spacing': ['error', 'always'],
  'object-property-newline': [
    'error',
    {
      allowAllPropertiesOnSameLine: true
    }
  ],
  'one-var': [
    'error',
    {
      var: 'never',
      let: 'never',
      const: 'never'
    }
  ],
  'one-var-declaration-per-line': ['error', 'always'],
  'operator-assignment': ['error', 'always'],
  'operator-linebreak': [
    'error',
    'after',
    {
      overrides: {
        '=': 'none',
        '==': 'none',
        '===': 'none'
      }
    }
  ],
  'padded-blocks': [
    'error',
    {
      blocks: 'never', switches: 'never', classes: 'never'
    }
  ],

  'prefer-object-spread': 'error',
  'quote-props': ['error', 'consistent-as-needed'],
  'quotes': [
    'error',
    'single',
    {
      avoidEscape: true,
      allowTemplateLiterals: true
    }
  ],
  'semi': ['error', 'always'],
  'semi-spacing': ['error', { before: false, after: true }],
  'semi-style': ['error', 'last'],
  'space-before-blocks': ['error', 'always'],
  'space-before-function-paren': [
    'error',
    {
      asyncArrow: 'always',
      anonymous: 'never',
      named: 'never'
    }
  ],
  'space-in-parens': ['error', 'never'],
  'space-infix-ops': 'error',
  'space-unary-ops': [
    'error',
    {
      words: true,
      nonwords: false
    }
  ],
  'spaced-comment': [
    'error',
    'always',
    {
      line: {
        exceptions: ['-', '+', '*'],
        markers: ['*package', '!', '/', ',', '=']
      },
      block: {
        balanced: true,
        exceptions: ['-', '+', '*'],
        markers: ['*package', '!', '*', ',', ':', '::', 'flow-include']
      }
    }
  ],
  'switch-colon-spacing': ['error', { after: true, before: false }],
  'template-tag-spacing': ['error', 'never'],
  'unicode-bom': ['error', 'never'],
  'wrap-regex': 'off',

  /*
   * --------------------------------------------
   * ECMAScript 6
   * --------------------------------------------
   */

  'arrow-body-style': ['error', 'as-needed'],
  'arrow-parens': ['error', 'always'],
  'arrow-spacing': ['error', { before: true, after: true }],
  'constructor-super': 'error',
  'generator-star-spacing': ['error', 'after'],
  'no-class-assign': 'error',
  'no-confusing-arrow': 'off',
  'no-const-assign': 'error',
  'no-dupe-class-members': 'error',
  'no-duplicate-imports': [
    'error',
    {
      includeExports: true
    }
  ],
  'no-new-symbol': 'error',
  'no-this-before-super': 'error',
  'no-useless-computed-key': 'error',
  'no-useless-constructor': 'error',
  'no-useless-rename': 'error',
  'no-var': 'error',
  'object-shorthand': 'error',
  'prefer-arrow-callback': 'error',
  'prefer-const': [
    'error',
    {
      destructuring: 'all'
    }
  ],
  'prefer-destructuring': ['error', {
    VariableDeclarator: {
      array: false,
      object: true
    },
    AssignmentExpression: {
      array: true,
      object: true
    }
  }, {
    enforceForRenamedProperties: false
  }],
  'prefer-numeric-literals': 'error',
  'prefer-rest-params': 'error',
  'prefer-spread': 'error',
  'prefer-template': 'error',
  'require-yield': 'error',
  'rest-spread-spacing': ['error', 'never'],
  'symbol-description': 'error',
  'template-curly-spacing': ['error', 'never'],
  'yield-star-spacing': ['error', 'after']
};
