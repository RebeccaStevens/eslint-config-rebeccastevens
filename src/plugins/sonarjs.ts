export const settings = {
  plugins: ['sonarjs'],

  extends: [
    'plugin:sonarjs/recommended'
  ],

  rules: {
    'sonarjs/cognitive-complexity': 'off',
    'sonarjs/no-nested-template-literals': 'off',
    'sonarjs/no-small-switch': 'off',
    'sonarjs/no-useless-cast': 'off'
  }
};
