import type { Linter } from "eslint";

export const settings: Linter.Config = {
  plugins: ["import"],

  extends: ["plugin:import/errors", "plugin:import/warnings"],

  rules: {
    "import/default": "error",
    "import/dynamic-import-chunkname": [
      "off",
      {
        importFunctions: [],
        webpackChunknameFormat: "[0-9a-zA-Z-_/.]+",
      },
    ],
    "import/export": "error",
    "import/exports-last": "off",
    "import/extensions": "off",
    "import/first": "error",
    "import/group-exports": "off",
    "import/max-dependencies": [
      "off",
      {
        max: 10,
      },
    ],
    "import/named": "error",
    "import/namespace": [
      "error",
      {
        allowComputed: true,
      },
    ],
    "import/newline-after-import": "error",
    "import/no-absolute-path": "error",
    "import/no-amd": "error",
    "import/no-anonymous-default-export": [
      "off",
      {
        allowAnonymousClass: false,
        allowAnonymousFunction: false,
        allowArray: false,
        allowArrowFunction: false,
        allowLiteral: false,
        allowObject: false,
      },
    ],
    "import/no-commonjs": "off",
    "import/no-cycle": [
      "error",
      {
        ignoreExternal: true,
      },
    ],
    "import/no-default-export": "off",
    "import/no-deprecated": "warn",
    "import/no-duplicates": "error",
    "import/no-dynamic-require": "error",
    "import/no-extraneous-dependencies": [
      "error",
      {
        bundledDependencies: true,
        devDependencies: [
          "*.{js,cjs,mjs,ts,cts,mts,jsx,tsx}",
          "scripts/**",
          "spec/**",
          "test/**",
          "tests/**",
          "**/__mocks__/**",
          "**/__tests__/**",
          "**/*{.,_}{test,spec}.{js,cjs,mjs,ts,cts,mts,jsx,tsx}",
          "**/Gruntfile{,.{js,cjs,mjs,ts}}",
          "**/gulpfile.{js,cjs,mjs,ts}",
          "**/gulpfile.*.{js,cjs,mjs,ts}",
          "**/jest.config.{js,cjs,mjs,ts}",
          "**/jest.setup.{js,cjs,mjs,ts}",
          "**/karma.conf.{js,cjs,mjs,ts}",
          "**/postcss.config.{js,cjs,mjs,ts}",
          "**/protractor.conf.{js,cjs,mjs,ts}",
          "**/protractor.conf.*.{js,cjs,mjs,ts}",
          "**/rollup.config.{js,cjs,mjs,ts}",
          "**/rollup.config.*.{js,cjs,mjs,ts}",
          "**/vue.config.{js,cjs,mjs,ts}",
          "**/webpack.config.{js,cjs,mjs,ts}",
          "**/webpack.config.*.{js,cjs,mjs,ts}",
        ],
        optionalDependencies: true,
        peerDependencies: true,
      },
    ],
    "import/no-internal-modules": [
      "off",
      {
        allow: [],
      },
    ],
    "import/no-mutable-exports": "error",
    "import/no-named-as-default": "off",
    "import/no-named-as-default-member": "error",
    "import/no-named-default": "error",
    "import/no-named-export": "off",
    "import/no-namespace": "off",
    "import/no-nodejs-modules": "off",
    "import/no-relative-parent-imports": "warn",
    "import/no-restricted-paths": "off",
    "import/no-self-import": "error",
    "import/no-unassigned-import": "error",
    "import/no-unused-modules": [
      "off",
      {
        ignoreExports: [],
        missingExports: true,
        unusedExports: true,
      },
    ],
    "import/no-useless-path-segments": [
      "error",
      {
        commonjs: true,
        noUselessIndex: true,
      },
    ],
    "import/no-webpack-loader-syntax": "error",
    "import/order": [
      "error",
      {
        "alphabetize": {
          caseInsensitive: false,
          order: "asc",
        },
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
        ],
        "newlines-between": "always",
      },
    ],
    "import/prefer-default-export": "off",
    "import/unambiguous": "off",
  },

  settings: {
    "import/internal-regex": "^(?:@|~)\\/.+",
  },

  overrides: [
    {
      files: ["**/*.cjs"],
      rules: {
        "import/no-commonjs": "off",
      },
    },
  ],
};
