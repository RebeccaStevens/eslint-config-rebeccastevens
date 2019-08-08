export const settings = {
  plugins: ['@typescript-eslint'],

  extends: [
    'plugin:@typescript-eslint/recommended'
  ],

  rules: {
    '@typescript-eslint/array-type': ['error', 'generic'],
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true
      }
    ],
    '@typescript-eslint/prefer-interface': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-require-imports': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'after-used',
        argsIgnorePattern: '^_',
        caughtErrors: 'none',
        ignoreRestSiblings: true,
        vars: 'all'
      }
    ],
    '@typescript-eslint/no-use-before-define': [
      'error',
      {
        functions: true,
        classes: true,
        variables: true,
        typedefs: true
      }
    ],
    '@typescript-eslint/indent': ['error', 2]
  },

  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        'indent': 'off',
        'no-unused-vars': 'off',
        'no-use-before-define': 'off'
      }
    }
  ]
};
