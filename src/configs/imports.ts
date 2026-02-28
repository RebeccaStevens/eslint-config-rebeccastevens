import type { ESLint } from "eslint";

import { GLOB_DTS, GLOB_MJS, GLOB_MTS, GLOB_SRC, GLOB_SRC_EXT, GLOB_TS, GLOB_TSX } from "../globs";
import type {
  FlatConfigItem,
  OptionsHasTypeScript,
  OptionsMode,
  OptionsTypeScriptParserOptions,
  RequiredOptionsStylistic,
} from "../types";
import { loadPackages } from "../utils";

export async function imports(
  options: Readonly<
    Required<RequiredOptionsStylistic & OptionsTypeScriptParserOptions & OptionsHasTypeScript & OptionsMode>
  >,
): Promise<FlatConfigItem[]> {
  const { stylistic, parserOptions, typescript } = options;

  const [pluginImport] = (await loadPackages(
    typescript
      ? [
          "eslint-plugin-import-x",
          "eslint-import-resolver-typescript", // make sure it exists - we only implicitly use it
        ]
      : ["eslint-plugin-import-x"],
  )) as [ESLint.Plugin] | [ESLint.Plugin, unknown];

  return [
    {
      name: "rs:imports",
      plugins: {
        "import-x": pluginImport,
      },
      settings: {
        "import-x/external-module-folders": ["node_modules", "node_modules/@types"],
        "import-x/internal-regex": "^(?:#|(?:@|~)\\/).*",
        "import-x/extensions": [".ts", ".tsx", ".js", ".jsx"],
        "import-x/parsers": {
          ...(typescript
            ? {
                "@typescript-eslint/parser": [".ts", ".tsx", ".cts", ".mts"],
              }
            : undefined),
        },
        "import-x/resolver": {
          node: {
            extensions: [".ts", ".tsx", ".js", ".jsx"],
          },
          ...(typescript
            ? {
                typescript: {
                  alwaysTryTypes: true,
                  projectService: parserOptions.projectService,
                },
              }
            : undefined),
        },
      },
      rules: {
        // "import-x/consistent-type-specifier-style": ["error", "prefer-inline"], -- using ts/consistent-type-imports instead
        "import-x/default": "error",
        // "import-x/dynamic-import-chunkname": "off",
        "import-x/export": "error",
        // "import-x/exports-last": "off",
        // "import-x/extensions": "off",
        "import-x/first": "error",
        // "import-x/group-exports": "off",
        // "import-x/max-dependencies": [
        //   "off",
        //   {
        //     max: 10,
        //   },
        // ],
        "import-x/named": "error",
        "import-x/namespace": [
          "error",
          {
            allowComputed: true,
          },
        ],
        "import-x/no-absolute-path": "error",
        "import-x/no-amd": "error",
        // "import-x/no-anonymous-default-export": "off",
        // "import-x/no-commonjs": "off",
        // "import-x/no-cycle": "off",
        // "import-x/no-default-export": "off",
        // "import-x/no-deprecated": "warn",
        "import-x/no-duplicates": ["error", { "prefer-inline": true }],
        // "import-x/no-dynamic-require": "off",
        "import-x/no-empty-named-blocks": "error",
        // "import-x/no-internal-modules": "off",
        "import-x/no-mutable-exports": "error",
        // "import-x/no-named-as-default": "off",
        // "import-x/no-named-as-default-member": "off",
        "import-x/no-named-default": "error",
        // "import-x/no-named-export": "off",
        // "import-x/no-namespace": "off",
        // "import-x/no-nodejs-modules": "off",
        // "import-x/no-relative-parent-imports": "off",
        // "import-x/no-restricted-paths": "off",
        "import-x/no-self-import": "error",
        "import-x/no-unassigned-import": "error",
        // "import-x/no-unused-modules": "off",
        // "import-x/no-unresolved": "off",
        "import-x/no-useless-path-segments": [
          "error",
          {
            commonjs: true,
            noUselessIndex: true,
          },
        ],
        "import-x/no-webpack-loader-syntax": "error",
        // "import-x/prefer-default-export": "off",
        // "import-x/unambiguous": "off",

        "import-x/newline-after-import": [stylistic === false ? "off" : "error", { count: 1 }],
        "import-x/order": [
          stylistic === false ? "off" : "error",
          {
            alphabetize: {
              caseInsensitive: false,
              order: "asc",
            },
            groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
            "newlines-between": "always",
          },
        ],
      },
    },
    {
      files: [GLOB_MJS, GLOB_MTS],
      rules: {
        "import-x/no-commonjs": "error",
        "import-x/no-dynamic-require": "error",
      },
    },
    ...((typescript
      ? [
          {
            files: [GLOB_TS, GLOB_TSX, GLOB_DTS],
            rules: {
              "import-x/no-unresolved": "off",
              "import-x/named": "off",
              "import-x/default": "off",
              "import-x/namespace": "off",

              "@typescript-eslint/no-import-type-side-effects": "error",
              "@typescript-eslint/consistent-type-imports": [
                stylistic === false ? "off" : "error",
                {
                  prefer: "type-imports",
                  fixStyle: "inline-type-imports",
                  disallowTypeAnnotations: false,
                },
              ],
            },
          },
        ]
      : []) satisfies FlatConfigItem[]),
    ...((options.mode === "library"
      ? [
          {
            files: [GLOB_SRC],
            rules: {
              // Use non-sloppy imports. See: https://jsr.io/docs/publishing-packages#relative-imports
              "import-x/extensions": [
                "error",
                "always",
                {
                  checkTypeImports: true,
                  ignorePackages: true,
                },
              ],
              "import-x/no-useless-path-segments": ["error", { noUselessIndex: false }],

              "import-x/no-extraneous-dependencies": [
                "error",
                {
                  bundledDependencies: true,
                  devDependencies: [
                    `?(.)*.${GLOB_SRC_EXT}`,
                    `?(.)config?(s)/**`,
                    "**/?(.)script?(s)/**",
                    "**/spec/**",
                    "**/test?(s)/**",
                    "**/__mocks__/**",
                    "**/__tests__/**",
                    `**/*{.,_}{test,spec}.${GLOB_SRC_EXT}`,
                    `**/Gruntfile{,.${GLOB_SRC_EXT}`,
                    `**/gulpfile.${GLOB_SRC_EXT}`,
                    `**/gulpfile.*.${GLOB_SRC_EXT}`,
                    `**/jest.config.${GLOB_SRC_EXT}`,
                    `**/jest.setup.${GLOB_SRC_EXT}`,
                    `**/karma.conf.${GLOB_SRC_EXT}`,
                    `**/postcss.config.${GLOB_SRC_EXT}`,
                    `**/protractor.conf.${GLOB_SRC_EXT}`,
                    `**/protractor.conf.*.${GLOB_SRC_EXT}`,
                    `**/rollup.config.${GLOB_SRC_EXT}`,
                    `**/rollup.config.*.${GLOB_SRC_EXT}`,
                    `**/tailwind.config.${GLOB_SRC_EXT}`,
                    `**/tailwind.config.*.${GLOB_SRC_EXT}`,
                    `**/vite.config.${GLOB_SRC_EXT}`,
                    `**/vitest.config.${GLOB_SRC_EXT}`,
                    `**/vue.config.${GLOB_SRC_EXT}`,
                    `**/webpack.config.${GLOB_SRC_EXT}`,
                    `**/webpack.config.*.${GLOB_SRC_EXT}`,
                  ],
                  optionalDependencies: true,
                  peerDependencies: true,
                },
              ],
            },
          },
        ]
      : options.mode === "application"
        ? [
            {
              files: [GLOB_SRC],
              rules: {
                "import-x/no-unassigned-import": [
                  "error",
                  {
                    allow: ["**/*.?(s)css"],
                  },
                ],
              },
            },
          ]
        : []) satisfies FlatConfigItem[]),
  ];
}
