import type { Linter } from "eslint";

import { commonJsFiles, jsExtensions, typescriptFiles } from "~/files";

export const settings: Linter.Config = {
  plugins: ["import"],

  extends: ["plugin:import/recommended"],

  rules: {
    "import/consistent-type-specifier-style": ["error", "prefer-inline"],
    "import/default": "error",
    "import/dynamic-import-chunkname": "off",
    "import/export": "error",
    "import/exports-last": "off",
    "import/extensions": [
      "error",
      "always",
      {
        js: "never",
        ts: "never",
        cts: "never",
        cjs: "never",
        mts: "always",
        mjs: "always",
        json: "always",
      },
    ],
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
    "import/no-anonymous-default-export": "off",
    "import/no-commonjs": "off",
    // Should be safe when bundling.
    "import/no-cycle": "off",
    "import/no-default-export": "off",
    "import/no-deprecated": "warn",
    "import/no-duplicates": ["error", { "prefer-inline": true }],
    "import/no-dynamic-require": "error",
    "import/no-empty-named-blocks": "error",
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
    "import/no-internal-modules": "off",
    "import/no-mutable-exports": "error",
    "import/no-named-as-default": "off",
    // using unicorn/import-style for per package control
    "import/no-named-as-default-member": "off",
    "import/no-named-default": "error",
    "import/no-named-export": "off",
    "import/no-namespace": "off",
    "import/no-nodejs-modules": "off",
    "import/no-relative-parent-imports": "off",
    "import/no-restricted-paths": "off",
    "import/no-self-import": "error",
    "import/no-unassigned-import": "error",
    "import/no-unused-modules": "off",
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
    "import/external-module-folders": ["node_modules"],
    "import/internal-regex": "^(?:#|(?:@|~)\\/).*",
    "import/resolver": {
      node: {
        extensions: jsExtensions,
      },
    },
  },

  overrides: [
    {
      files: commonJsFiles,
      rules: {
        "import/no-commonjs": "off",
        "import/no-dynamic-require": "off",
      },
    },
    {
      files: typescriptFiles,
      rules: {
        "import/no-unresolved": "off",
        "import/named": "off",
        "import/default": "off",
        "import/namespace": "off",
      },
    },
  ],
};
