export const settings = {
  plugins: ['import'],

  extends: [
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript'
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
