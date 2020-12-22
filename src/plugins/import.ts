import type { Linter } from "eslint";

export const settings: Linter.Config = {
  plugins: ["import"],

  extends: ["plugin:import/errors", "plugin:import/warnings"],

  rules: {
    "import/named": "error",
    "import/default": "error",
    "import/namespace": [
      "error",
      {
        allowComputed: true,
      },
    ],
    "import/no-restricted-paths": "off",
    "import/no-absolute-path": "error",
    "import/no-dynamic-require": "error",
    "import/no-internal-modules": [
      "off",
      {
        allow: [],
      },
    ],
    "import/no-webpack-loader-syntax": "error",
    "import/no-self-import": "error",
    "import/no-cycle": [
      "error",
      {
        ignoreExternal: true,
      },
    ],
    "import/no-useless-path-segments": [
      "error",
      {
        commonjs: true,
        noUselessIndex: true,
      },
    ],
    "import/no-relative-parent-imports": "warn",
    "import/export": "error",
    "import/no-named-as-default": "off",
    "import/no-named-as-default-member": "error",
    "import/no-deprecated": "warn",
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: [
          "test/**",
          "tests/**",
          "spec/**",
          "**/__tests__/**",
          "**/__mocks__/**",
          "test.{js,cjs,mjs,ts,jsx,tsx}",
          "test-*.{js,cjs,mjs,ts,jsx,tsx}",
          "**/*{.,_}{test,spec}.{js,cjs,mjs,ts,jsx,tsx}",
          "**/jest.config.{js,cjs,mjs,ts}",
          "**/jest.setup.{js,cjs,mjs,ts}",
          "**/vue.config.{js,cjs,mjs,ts}",
          "**/webpack.config.{js,cjs,mjs,ts}",
          "**/webpack.config.*.{js,cjs,mjs,ts}",
          "**/rollup.config.{js,cjs,mjs,ts}",
          "**/rollup.config.*.{js,cjs,mjs,ts}",
          "**/gulpfile.{js,cjs,mjs,ts}",
          "**/gulpfile.*.{js,cjs,mjs,ts}",
          "**/Gruntfile{,.{js,cjs,mjs,ts}}",
          "**/protractor.conf.{js,cjs,mjs,ts}",
          "**/protractor.conf.*.{js,cjs,mjs,ts}",
          "**/karma.conf.{js,cjs,mjs,ts}",
          "**/postcss.config.{js,cjs,mjs,ts}",
        ],
        optionalDependencies: false,
      },
    ],
    "import/no-mutable-exports": "error",
    "import/no-unused-modules": [
      "off",
      {
        ignoreExports: [],
        missingExports: true,
        unusedExports: true,
      },
    ],
    "import/unambiguous": "off",
    "import/no-commonjs": "error",
    "import/no-amd": "error",
    "import/no-nodejs-modules": "off",
    "import/first": "error",
    "import/exports-last": "off",
    "import/no-duplicates": "error",
    "import/no-namespace": "off",
    "import/extensions": "off",
    "import/order": [
      "error",
      {
        "groups": [["builtin", "external"], "internal", "parent", "sibling", "index"],
        "pathGroups": [
          {
            pattern: "~/**",
            group: "internal",
          },
          {
            pattern: "@/**",
            group: "internal",
          },
        ],
        "newlines-between": "always",
        "alphabetize": {
          order: "asc",
          caseInsensitive: false,
        },
      },
    ],
    "import/newline-after-import": "error",
    "import/prefer-default-export": "off",
    "import/max-dependencies": [
      "off",
      {
        max: 10,
      },
    ],
    "import/no-unassigned-import": "error",
    "import/no-named-default": "error",
    "import/no-default-export": "off",
    "import/no-named-export": "off",
    "import/no-anonymous-default-export": [
      "off",
      {
        allowArray: false,
        allowArrowFunction: false,
        allowAnonymousClass: false,
        allowAnonymousFunction: false,
        allowLiteral: false,
        allowObject: false,
      },
    ],
    "import/group-exports": "off",
    "import/dynamic-import-chunkname": [
      "off",
      {
        importFunctions: [],
        webpackChunknameFormat: "[0-9a-zA-Z-_/.]+",
      },
    ],
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
