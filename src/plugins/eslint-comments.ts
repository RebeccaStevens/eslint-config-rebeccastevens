export const settings = {
  plugins: ['eslint-comments'],

  extends: [
    'plugin:eslint-comments/recommended'
  ],

  rules: {
    'import/order': [
      'error',
      {
        'groups': ['builtin', 'external', 'parent', 'sibling', 'index'],
        'newlines-between': 'always'
      }
    ]
  }
};
