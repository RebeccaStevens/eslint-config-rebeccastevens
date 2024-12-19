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
        import: pluginImport,
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
        // "import/consistent-type-specifier-style": ["error", "prefer-inline"], -- using ts/consistent-type-imports instead
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

        "import/newline-after-import": [stylistic === false ? "off" : "error", { count: 1 }],
        "import/order": [
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
        "import/no-commonjs": "error",
        "import/no-dynamic-require": "error",
      },
    },
    ...((typescript
      ? [
          {
            files: [GLOB_TS, GLOB_TSX, GLOB_DTS],
            rules: {
              "import/no-unresolved": "off",
              "import/named": "off",
              "import/default": "off",
              "import/namespace": "off",

              "ts/no-import-type-side-effects": "error",
              "ts/consistent-type-imports": [
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
              "import/extensions": [
                "error",
                "always",
                {
                  checkTypeImports: true,
                  ignorePackages: true,
                },
              ],
              "import/no-useless-path-segments": ["error", { noUselessIndex: false }],

              "import/no-extraneous-dependencies": [
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
                "import/no-unassigned-import": [
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
