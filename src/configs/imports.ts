import { type ESLint } from "eslint";

import { GLOB_DTS, GLOB_MJS, GLOB_MTS, GLOB_TS, GLOB_TSX } from "../globs";
import {
  type FlatConfigItem,
  type OptionsTypeScriptParserOptions,
  type RequiredOptionsStylistic,
} from "../types";
import { loadPackages } from "../utils";

export async function imports(
  options: Readonly<
    Required<RequiredOptionsStylistic & OptionsTypeScriptParserOptions>
  >,
): Promise<FlatConfigItem[]> {
  const { stylistic, parserOptions } = options;

  const [pluginImport] = (await loadPackages([
    "eslint-plugin-import-x",
    "eslint-import-resolver-typescript",
  ])) as [ESLint.Plugin, ESLint.Plugin];

  const stylisticEnforcement = stylistic === false ? "off" : "error";

  return [
    {
      name: "rs:imports",
      plugins: {
        import: pluginImport,
      },
      settings: {
        "import-x/external-module-folders": [
          "node_modules",
          "node_modules/@types",
        ],
        "import-x/internal-regex": "^(?:#|(?:@|~)\\/).*",
        "import-x/extensions": [".ts", ".tsx", ".js", ".jsx"],
        "import-x/parsers": {
          "@typescript-eslint/parser": [".ts", ".tsx", ".cts", ".mts"],
        },
        "import-x/resolver": {
          typescript: {
            alwaysTryTypes: true,
            projectService: parserOptions.projectService,
          },
          node: {
            extensions: [".ts", ".tsx", ".js", ".jsx"],
          },
        },
      },
      rules: {
        "import/consistent-type-specifier-style": ["error", "prefer-inline"],
        "import/default": "error",
        // "import/dynamic-import-chunkname": "off",
        "import/export": "error",
        // "import/exports-last": "off",
        // "import/extensions": "off",
        "import/first": "error",
        // "import/group-exports": "off",
        // "import/max-dependencies": [
        //   "off",
        //   {
        //     max: 10,
        //   },
        // ],
        "import/named": "error",
        "import/namespace": [
          "error",
          {
            allowComputed: true,
          },
        ],
        "import/no-absolute-path": "error",
        "import/no-amd": "error",
        // "import/no-anonymous-default-export": "off",
        // "import/no-commonjs": "off",
        // "import/no-cycle": "off",
        // "import/no-default-export": "off",
        // "import/no-deprecated": "warn",
        "import/no-duplicates": ["error", { "prefer-inline": true }],
        // "import/no-dynamic-require": "off",
        "import/no-empty-named-blocks": "error",
        "import/no-extraneous-dependencies": [
          "error",
          {
            bundledDependencies: true,
            devDependencies: [
              "*.{js,cjs,mjs,ts,cts,mts,jsx,tsx}",
              "**/scripts/**",
              "**/spec/**",
              "**/test/**",
              "**/tests/**",
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
              "**/vite.config.{js,cjs,mjs,ts}",
              "**/vitest.config.{js,cjs,mjs,ts}",
              "**/vue.config.{js,cjs,mjs,ts}",
              "**/webpack.config.{js,cjs,mjs,ts}",
              "**/webpack.config.*.{js,cjs,mjs,ts}",
            ],
            optionalDependencies: true,
            peerDependencies: true,
          },
        ],
        // "import/no-internal-modules": "off",
        "import/no-mutable-exports": "error",
        // "import/no-named-as-default": "off",
        // "import/no-named-as-default-member": "off",
        "import/no-named-default": "error",
        // "import/no-named-export": "off",
        // "import/no-namespace": "off",
        // "import/no-nodejs-modules": "off",
        // "import/no-relative-parent-imports": "off",
        // "import/no-restricted-paths": "off",
        "import/no-self-import": "error",
        "import/no-unassigned-import": "error",
        // "import/no-unused-modules": "off",
        // "import/no-unresolved": "off",
        "import/no-useless-path-segments": [
          "error",
          {
            commonjs: true,
            noUselessIndex: true,
          },
        ],
        "import/no-webpack-loader-syntax": "error",
        // "import/prefer-default-export": "off",
        // "import/unambiguous": "off",

        "import/newline-after-import": [stylisticEnforcement, { count: 1 }],
        "import/order": [
          stylisticEnforcement,
          {
            alphabetize: {
              caseInsensitive: false,
              order: "asc",
            },
            groups: [
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
      },
    },
    {
      files: [GLOB_MJS, GLOB_MTS],
      rules: {
        "import/no-commonjs": "error",
        "import/no-dynamic-require": "error",
      },
    },
    {
      files: [GLOB_TS, GLOB_TSX, GLOB_DTS],
      rules: {
        "import/no-unresolved": "off",
        "import/named": "off",
        "import/default": "off",
        "import/namespace": "off",

        // "ts/no-import-type-side-effects": "off",
        "ts/consistent-type-imports": [
          stylisticEnforcement,
          {
            prefer: "type-imports",
            fixStyle: "inline-type-imports",
            disallowTypeAnnotations: false,
          },
        ],
      },
    },
  ];
}
