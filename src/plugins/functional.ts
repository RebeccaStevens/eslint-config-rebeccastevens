export const settings = {
  plugins: ['functional'],

  extends: [
    'plugin:functional/external-recommended',
    'plugin:functional/recommended'
  ],

  rules: {
    'functional/prefer-readonly-type': [
      'error',
      {
        allowMutableReturnType: true
      }
    ],
    'functional/no-conditional-statement': [
      'error',
      {
        allowReturningBranches: true
      }
    ]
  }
};
