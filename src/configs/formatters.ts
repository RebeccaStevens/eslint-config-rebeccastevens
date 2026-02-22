import type { ESLint } from "eslint";
import { isPackageExists } from "local-pkg";
import type { Options as PrettierOptions } from "prettier";

import {
  GLOB_CSS,
  GLOB_DTS,
  GLOB_GRAPHQL,
  GLOB_JS,
  GLOB_JSON,
  GLOB_JSON5,
  GLOB_JSONC,
  GLOB_JSX,
  GLOB_LESS,
  GLOB_MARKDOWN,
  GLOB_POSTCSS,
  GLOB_SCSS,
  GLOB_TS,
  GLOB_TSX,
  GLOB_YAML,
} from "../globs";
import type { FlatConfigItem, OptionsFormatters, StylisticConfig } from "../types";
import { loadPackages, parserPlain } from "../utils";

import { StylisticConfigDefaults } from "./stylistic";

export async function formatters(
  opts: Readonly<OptionsFormatters | true>,
  stylistic: Readonly<StylisticConfig>,
): Promise<FlatConfigItem[]> {
  const options =
    opts === true
      ? {
          js: true,
          ts: true,
          dts: false,
          json: true,
          yaml: true,
          css: true,
          graphql: true,
          html: true,
          markdown: true,
          slidev: isPackageExists("@slidev/cli"),
          tailwind: isPackageExists("tailwindcss"),
        }
      : opts;

  if (options.slidev !== false && options.slidev !== undefined && options.markdown !== true) {
    throw new Error("`slidev` option only works when `markdown` is enabled with `prettier`");
  }

  const { indent, printWidth, quotes, semi } = stylistic;

  const prettierOptions: PrettierOptions = Object.assign(
    {
      endOfLine: "lf",
      printWidth: printWidth ?? 120,
      semi: semi ?? true,
      singleQuote: quotes === "single",
      tabWidth:
        typeof indent === "number"
          ? indent
          : typeof StylisticConfigDefaults.indent === "number"
            ? StylisticConfigDefaults.indent
            : 2,
      trailingComma: "all",
      useTabs: indent === "tab",
    } satisfies PrettierOptions,

    options.prettierOptions ?? {},
  );

  const packages = loadPackages([
    "eslint-plugin-format",
    "eslint-config-prettier",
    "sort-package-json",
    "eslint-formatting-reporter",
    "prettier",
  ]) as Promise<
    [
      ESLint.Plugin,
      ESLint.ConfigData,
      (typeof import("sort-package-json"))["default"],
      typeof import("eslint-formatting-reporter"),
      unknown,
    ]
  >;

  const [pluginFormat, configPrettier, sortPackageJson, formattingReporter] = await packages;

  const turnOffRulesForPrettier = {
    ...Object.fromEntries(Object.entries(configPrettier.rules ?? {}).filter(([, value]) => value === "off")),

    // curly: "off",
    "no-unexpected-multiline": "off",
    // "style/lines-around-comment": "off",
    "style/max-len": "off",
    "style/no-confusing-arrow": "off",
    "style/no-mixed-operators": "off",
    "style/no-tabs": "off",
    "style/quotes": "off",
    // "style/js/lines-around-comment": "off",
    // "style/js/max-len": "off",
    "style/js/no-confusing-arrow": "off",
    "style/js/no-mixed-operators": "off",
    "style/js/no-tabs": "off",
    "style/js/quotes": "off",
    // "style/ts/lines-around-comment": "off",
    "style/ts/quotes": "off",
    "ts/lines-around-comment": "off",
    "ts/quotes": "off",
    // "babel/quotes": "off",
    // "unicorn/template-indent": "off",
    "vue/html-self-closing": "off",
    "vue/max-len": "off",

    // other
    "no-irregular-whitespace": "off",
    "yaml/block-sequence-hyphen-indicator-newline": "off",
  } satisfies FlatConfigItem["rules"];

  const mut_configs: FlatConfigItem[] = [
    {
      name: "rs:formatters:setup",
      plugins: {
        format: pluginFormat,
      },
    },
  ];

  if (options.js !== undefined && options.js) {
    mut_configs.push({
      name: "rs:formatter:javascript",
      files: [GLOB_JS, GLOB_JSX],
      rules: {
        ...turnOffRulesForPrettier,
        "format/prettier": [
          "error",
          {
            ...prettierOptions,
            parser: "babel",

            ...(options.tailwind !== undefined && options.tailwind
              ? {
                  plugins: prettierOptions.plugins ?? [],
                }
              : {}),
          },
        ],
      },
    });
  }

  if (options.ts !== undefined && options.ts) {
    mut_configs.push({
      name: "rs:formatter:typescript",
      files: [GLOB_TS, GLOB_TSX],
      ignores: options.dts === true ? [] : [GLOB_DTS],
      rules: {
        ...turnOffRulesForPrettier,
        "format/prettier": [
          "error",
          {
            ...prettierOptions,
            parser: "typescript",

            ...(options.tailwind !== undefined && options.tailwind
              ? {
                  plugins: prettierOptions.plugins ?? [],
                }
              : {}),
          },
        ],
      },
    });
  }

  if (options.yaml !== undefined && options.yaml) {
    mut_configs.push({
      name: "rs:formatter:yaml",
      files: [GLOB_YAML],
      languageOptions: {
        parser: parserPlain,
      },
      rules: {
        ...turnOffRulesForPrettier,
        "format/prettier": [
          "error",
          {
            ...prettierOptions,
            parser: "yaml",
          },
        ],
      },
    });
  }

  if (options.json !== undefined && options.json) {
    mut_configs.push(
      {
        name: "rs:formatter:json",
        files: [GLOB_JSON],
        ignores: ["**/package.json"],
        languageOptions: {
          parser: parserPlain,
        },
        rules: {
          ...turnOffRulesForPrettier,
          "format/prettier": [
            "error",
            {
              ...prettierOptions,
              parser: "json",
            },
          ],
        },
      },
      {
        name: "rs:formatter:jsonc",
        files: [GLOB_JSONC],
        languageOptions: {
          parser: parserPlain,
        },
        rules: {
          ...turnOffRulesForPrettier,
          "format/prettier": [
            "error",
            {
              ...prettierOptions,
              parser: "jsonc",
            },
          ],
        },
      },
      {
        name: "rs:formatter:json5",
        files: [GLOB_JSON5],
        languageOptions: {
          parser: parserPlain,
        },
        rules: {
          ...turnOffRulesForPrettier,
          "format/prettier": [
            "error",
            {
              ...prettierOptions,
              parser: "json5",
            },
          ],
        },
      },
      {
        name: "rs:formatter:packagejson",
        files: ["**/package.json"],
        languageOptions: {
          parser: parserPlain,
        },
        plugins: {
          "package-json": {
            meta: {
              name: "rs:formatter:packagejson",
            },
            rules: {
              sort: {
                meta: {
                  type: "layout",
                  fixable: "whitespace",
                  messages: formattingReporter.messages,
                  schema: [
                    {
                      type: "object",
                      properties: {
                        parser: {
                          type: "string",
                          required: true,
                        },
                      },
                      additionalProperties: true,
                    },
                  ],
                },
                create(context) {
                  return {
                    Program() {
                      if (!("text" in context.sourceCode)) {
                        return;
                      }
                      const sourceCode = context.sourceCode.text;
                      try {
                        const formatted = sortPackageJson(sourceCode);
                        formattingReporter.reportDifferences(context as any, sourceCode, formatted);
                      } catch (error) {
                        console.error(error);
                        context.report({
                          loc: {
                            start: { line: 1, column: 0 },
                            end: { line: 1, column: 0 },
                          },
                          message: "Failed to format package.json",
                        });
                      }
                    },
                  };
                },
              },
            },
          } satisfies ESLint.Plugin,
        },
        rules: {
          "package-json/sort": "error",
        },
      },
    );
  }

  if (options.css !== undefined && options.css) {
    mut_configs.push(
      {
        name: "rs:formatter:css",
        files: [GLOB_CSS, GLOB_POSTCSS],
        languageOptions: {
          parser: parserPlain,
        },
        rules: {
          ...turnOffRulesForPrettier,
          "format/prettier": [
            "error",
            {
              ...prettierOptions,
              parser: "css",
            },
          ],
        },
      },
      {
        name: "rs:formatter:scss",
        files: [GLOB_SCSS],
        languageOptions: {
          parser: parserPlain,
        },
        rules: {
          ...turnOffRulesForPrettier,
          "format/prettier": [
            "error",
            {
              ...prettierOptions,
              parser: "scss",
            },
          ],
        },
      },
      {
        name: "rs:formatter:less",
        files: [GLOB_LESS],
        languageOptions: {
          parser: parserPlain,
        },
        rules: {
          ...turnOffRulesForPrettier,
          "format/prettier": [
            "error",
            {
              ...prettierOptions,
              parser: "less",
            },
          ],
        },
      },
    );
  }

  if (options.html !== undefined && options.html) {
    mut_configs.push({
      name: "rs:formatter:html",
      files: ["**/*.html"],
      languageOptions: {
        parser: parserPlain,
      },
      rules: {
        ...turnOffRulesForPrettier,
        "format/prettier": [
          "error",
          {
            ...prettierOptions,
            parser: "html",
          },
        ],
      },
    });
  }

  if (options.markdown !== undefined && options.markdown) {
    const GLOB_SLIDEV =
      options.slidev === undefined || options.slidev === false
        ? []
        : options.slidev === true
          ? ["**/slides.md"]
          : (options.slidev.files ?? []);

    mut_configs.push({
      name: "rs:formatter:markdown",
      files: [GLOB_MARKDOWN],
      ignores: GLOB_SLIDEV,
      languageOptions: {
        parser: parserPlain,
      },
      rules: {
        ...turnOffRulesForPrettier,
        "format/prettier": [
          "error",
          {
            ...prettierOptions,
            embeddedLanguageFormatting: "off",
            parser: "markdown",
          },
        ],
      },
    });

    if (options.slidev !== undefined && options.slidev !== false) {
      mut_configs.push({
        name: "rs:formatter:slidev",
        files: GLOB_SLIDEV,
        languageOptions: {
          parser: parserPlain,
        },
        rules: {
          ...turnOffRulesForPrettier,
          "format/prettier": [
            "error",
            {
              ...prettierOptions,
              embeddedLanguageFormatting: "off",
              parser: "slidev",
              plugins: ["prettier-plugin-slidev"],
            },
          ],
        },
      });
    }
  }

  if (options.graphql !== undefined && options.graphql) {
    mut_configs.push({
      files: [GLOB_GRAPHQL],
      languageOptions: {
        parser: parserPlain,
      },
      name: "rs:formatter:graphql",
      rules: {
        ...turnOffRulesForPrettier,
        "format/prettier": [
          "error",
          {
            ...prettierOptions,
            parser: "graphql",
          },
        ],
      },
    });
  }

  return mut_configs;
}
