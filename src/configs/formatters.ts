import type { ESLint, Rule } from "eslint";
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

type FormatterType = "prettier" | "dprint";

/**
 * Create a format rule for the given formatter type.
 *
 * @param formatter - Which formatter to use
 * @param prettierOpts - Prettier options (used only when formatter is "prettier")
 * @param dprintLang - dprint language name (used only when formatter is "dprint")
 * @param dprintGlobalOpts - dprint global options
 * @param dprintLangOpts - dprint language-specific options
 * @returns ESLint rule configuration
 */
function createFormatRule(
  formatter: FormatterType,
  prettierOpts: Record<string, unknown>,
  dprintLang: string,
  dprintGlobalOpts: Record<string, unknown>,
  dprintLangOpts?: Record<string, unknown>,
): [string, unknown[]] {
  if (formatter === "dprint") {
    return [
      "format/dprint",
      [
        {
          ...dprintGlobalOpts,
          language: dprintLang,
          ...(dprintLangOpts === undefined ? {} : { languageOptions: dprintLangOpts }),
        },
      ],
    ] as [string, unknown[]];
  }
  return ["format/prettier", [prettierOpts]] as [string, unknown[]];
}

/**
 * Enable formatting via `eslint-plugin-format` for JS/TS, JSON, YAML,
 * CSS/SCSS/LESS, HTML, Markdown, GraphQL, and Tailwind files.
 *
 * Passing `true` enables all formatters and auto-detects slidev/tailwind
 * packages. Supports both Prettier and dprint as the underlying formatter.
 * Non-JS file types use `parserPlain`; `stylistic` drives
 * printWidth/quotes/semi. Throws if `slidev` is enabled without `markdown`.
 *
 * @param optionsInput - Formatter toggles, or `true` to enable all
 * @param stylistic - Stylistic config controlling printWidth/quotes/semi
 * @returns Flat config items enabling formatting per file type
 */
export async function formatters(
  optionsInput: Readonly<OptionsFormatters | true>,
  stylistic: Readonly<StylisticConfig>,
): Promise<FlatConfigItem[]> {
  const options =
    optionsInput === true
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
          formatter: "prettier" as const,
        }
      : { formatter: "prettier" as const, ...optionsInput };

  if (options.slidev !== false && options.slidev !== undefined && options.markdown !== true) {
    throw new Error("`slidev` option only works when `markdown` is enabled");
  }

  const mut_formatter: FormatterType = options.formatter;
  const useDprint = mut_formatter === "dprint";

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

  const dprintOptions: Record<string, unknown> = {
    indentWidth:
      typeof indent === "number"
        ? indent
        : typeof StylisticConfigDefaults.indent === "number"
          ? StylisticConfigDefaults.indent
          : 2,
    lineWidth: printWidth ?? 120,
    newLineKind: "lf",
    useTabs: indent === "tab",
    ...options.dprintOptions,
  };

  const dprintJsTsLanguageOptions = {
    quoteStyle: quotes === "single" ? "alwaysSingle" : "alwaysDouble",
    semiColons: semi === false ? "asi" : "always",
  };

  const packages = (await loadPackages([
    "eslint-plugin-format",
    "eslint-config-prettier",
    "sort-package-json",
    "eslint-formatting-reporter",
    ...(useDprint ? [] : ["prettier"]),
  ])) as [
    ESLint.Plugin,
    ESLint.ConfigData,
    (typeof import("sort-package-json"))["default"],
    typeof import("eslint-formatting-reporter"),
    unknown?,
  ];

  const [mut_pluginFormat, mut_configPrettier, sortPackageJson, formattingReporter] = packages;

  const turnOffRules = {
    ...Object.fromEntries(Object.entries(mut_configPrettier.rules ?? {}).filter(([, value]) => value === "off")),

    // curly: "off",
    "no-unexpected-multiline": "off",
    // "@stylistic/lines-around-comment": "off",
    "@stylistic/max-len": "off",
    "@stylistic/no-confusing-arrow": "off",
    "@stylistic/no-mixed-operators": "off",
    "@stylistic/no-tabs": "off",
    "@stylistic/quotes": "off",
    // "@stylistic/js/lines-around-comment": "off",
    // "@stylistic/js/max-len": "off",
    "@stylistic/js/no-confusing-arrow": "off",
    "@stylistic/js/no-mixed-operators": "off",
    "@stylistic/js/no-tabs": "off",
    "@stylistic/js/quotes": "off",
    // "@stylistic/ts/lines-around-comment": "off",
    "@stylistic/ts/quotes": "off",
    "@typescript-eslint/lines-around-comment": "off",
    "@typescript-eslint/quotes": "off",
    // "babel/quotes": "off",
    // "unicorn/template-indent": "off",
    "vue/html-self-closing": "off",
    "vue/max-len": "off",

    // other
    "no-irregular-whitespace": "off",
    "yml/block-sequence-hyphen-indicator-newline": "off",
  } satisfies FlatConfigItem["rules"];

  // Shorthand: create format rule with current formatter.
  function fmtRule(
    prettierOpts: Record<string, unknown>,
    dprintLang: string,
    dprintLangOpts?: Record<string, unknown>,
  ): FlatConfigItem["rules"] {
    const [ruleName, ruleArgs] = createFormatRule(
      mut_formatter,
      prettierOpts,
      dprintLang,
      dprintOptions,
      dprintLangOpts,
    );
    return { [ruleName]: ["error", ...ruleArgs] };
  }

  const mut_configs: FlatConfigItem[] = [
    {
      name: "rs:formatters:setup",
      plugins: {
        format: mut_pluginFormat,
      },
    },
  ];

  if (options.js !== undefined && options.js) {
    mut_configs.push({
      name: "rs:formatter:javascript",
      files: [GLOB_JS, GLOB_JSX],
      rules: {
        ...turnOffRules,
        ...fmtRule(
          {
            ...prettierOptions,
            parser: "babel",
            ...(options.tailwind !== undefined &&
              options.tailwind && {
                plugins: prettierOptions.plugins ?? [],
              }),
          },
          "typescript",
          dprintJsTsLanguageOptions,
        ),
      },
    });
  }

  if (options.ts !== undefined && options.ts) {
    mut_configs.push({
      name: "rs:formatter:typescript",
      files: [GLOB_TS, GLOB_TSX],
      ignores: options.dts === true ? [] : [GLOB_DTS],
      rules: {
        ...turnOffRules,
        ...fmtRule(
          {
            ...prettierOptions,
            parser: "typescript",
            ...(options.tailwind !== undefined &&
              options.tailwind && {
                plugins: prettierOptions.plugins ?? [],
              }),
          },
          "typescript",
          dprintJsTsLanguageOptions,
        ),
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
        ...turnOffRules,
        ...fmtRule({ ...prettierOptions, parser: "yaml" }, "yaml"),
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
          ...turnOffRules,
          ...fmtRule({ ...prettierOptions, parser: "json" }, "json"),
        },
      },
      {
        name: "rs:formatter:jsonc",
        files: [GLOB_JSONC],
        languageOptions: {
          parser: parserPlain,
        },
        rules: {
          ...turnOffRules,
          ...fmtRule({ ...prettierOptions, parser: "jsonc" }, "json"),
        },
      },
      {
        name: "rs:formatter:json5",
        files: [GLOB_JSON5],
        languageOptions: {
          parser: parserPlain,
        },
        rules: {
          ...turnOffRules,
          ...fmtRule({ ...prettierOptions, parser: "json5" }, "json"),
        },
      },
      {
        name: "rs:formatter:packagejson",
        files: ["**/package.json"],
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
                        formattingReporter.reportDifferences(
                          context as unknown as Rule.RuleContext,
                          sourceCode,
                          formatted,
                        );
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
          ...turnOffRules,
          ...fmtRule({ ...prettierOptions, parser: "css" }, "css"),
        },
      },
      {
        name: "rs:formatter:scss",
        files: [GLOB_SCSS],
        languageOptions: {
          parser: parserPlain,
        },
        rules: {
          ...turnOffRules,
          ...fmtRule({ ...prettierOptions, parser: "scss" }, "css"),
        },
      },
      {
        name: "rs:formatter:less",
        files: [GLOB_LESS],
        languageOptions: {
          parser: parserPlain,
        },
        rules: {
          ...turnOffRules,
          ...fmtRule({ ...prettierOptions, parser: "less" }, "css"),
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
        ...turnOffRules,
        ...fmtRule({ ...prettierOptions, parser: "html" }, "html"),
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
        ...turnOffRules,
        ...fmtRule({ ...prettierOptions, embeddedLanguageFormatting: "off", parser: "markdown" }, "markdown"),
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
          ...turnOffRules,
          ...fmtRule(
            {
              ...prettierOptions,
              embeddedLanguageFormatting: "off",
              parser: "slidev",
              plugins: ["prettier-plugin-slidev"],
            },
            "markdown",
          ),
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
        ...turnOffRules,
        ...fmtRule({ ...prettierOptions, parser: "graphql" }, "graphql"),
      },
    });
  }

  return mut_configs;
}
