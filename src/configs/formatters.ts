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
      tabWidth: typeof indent === "number" ? indent : 2,
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

  const prettierPluginTailwindcssPromise = (
    ((options.js !== undefined && options.js) || (options.ts !== undefined && options.ts)) &&
    options.tailwind !== undefined &&
    options.tailwind
      ? loadPackages(["prettier-plugin-tailwindcss"])
      : [undefined]
  ) as Promise<[typeof import("prettier-plugin-tailwindcss") | undefined]>;

  const [[pluginFormat, configPrettier, sortPackageJson, formattingReporter], [prettierPluginTailwindcss]] =
    await Promise.all([packages, prettierPluginTailwindcssPromise]);

  const turnOffRulesForPrettier = {
    ...Object.fromEntries(Object.entries(configPrettier.rules ?? {}).filter(([, value]) => value === "off")),

    "no-irregular-whitespace": "off",
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

    // From https://github.com/prettier/eslint-config-prettier/pull/272
    "style/array-bracket-newline": "off",
    "style/array-bracket-spacing": "off",
    "style/array-element-newline": "off",
    "style/arrow-parens": "off",
    "style/arrow-spacing": "off",
    "style/block-spacing": "off",
    "style/brace-style": "off",
    "style/comma-dangle": "off",
    "style/comma-spacing": "off",
    "style/comma-style": "off",
    "style/computed-property-spacing": "off",
    "style/dot-location": "off",
    "style/eol-last": "off",
    "style/func-call-spacing": "off",
    "style/function-call-argument-newline": "off",
    "style/function-call-spacing": "off",
    "style/function-paren-newline": "off",
    "style/generator-star-spacing": "off",
    "style/implicit-arrow-linebreak": "off",
    "style/indent-binary-ops": "off",
    "style/indent": "off",
    "style/key-spacing": "off",
    "style/keyword-spacing": "off",
    "style/linebreak-style": "off",
    "style/max-statements-per-line": "off",
    "style/member-delimiter-style": "off",
    "style/multiline-ternary": "off",
    "style/new-parens": "off",
    "style/newline-per-chained-call": "off",
    "style/no-extra-parens": "off",
    "style/no-extra-semi": "off",
    "style/no-floating-decimal": "off",
    "style/no-mixed-spaces-and-tabs": "off",
    "style/no-multi-spaces": "off",
    "style/no-multiple-empty-lines": "off",
    "style/no-trailing-spaces": "off",
    "style/no-whitespace-before-property": "off",
    "style/nonblock-statement-body-position": "off",
    "style/object-curly-newline": "off",
    "style/object-curly-spacing": "off",
    "style/object-property-newline": "off",
    "style/one-var-declaration-per-line": "off",
    "style/operator-linebreak": "off",
    "style/padded-blocks": "off",
    "style/quote-props": "off",
    "style/rest-spread-spacing": "off",
    "style/semi-spacing": "off",
    "style/semi-style": "off",
    "style/semi": "off",
    "style/space-before-blocks": "off",
    "style/space-before-function-paren": "off",
    "style/space-in-parens": "off",
    "style/space-infix-ops": "off",
    "style/space-unary-ops": "off",
    "style/switch-colon-spacing": "off",
    "style/template-curly-spacing": "off",
    "style/template-tag-spacing": "off",
    "style/type-annotation-spacing": "off",
    "style/type-generic-spacing": "off",
    "style/type-named-tuple-spacing": "off",
    "style/wrap-iife": "off",
    "style/wrap-regex": "off",
    "style/yield-star-spacing": "off",

    "style/js/array-bracket-newline": "off",
    "style/js/array-bracket-spacing": "off",
    "style/js/array-element-newline": "off",
    "style/js/arrow-parens": "off",
    "style/js/arrow-spacing": "off",
    "style/js/block-spacing": "off",
    "style/js/brace-style": "off",
    "style/js/comma-dangle": "off",
    "style/js/comma-spacing": "off",
    "style/js/comma-style": "off",
    "style/js/computed-property-spacing": "off",
    "style/js/dot-location": "off",
    "style/js/eol-last": "off",
    "style/js/func-call-spacing": "off",
    "style/js/function-call-argument-newline": "off",
    "style/js/function-call-spacing": "off",
    "style/js/function-paren-newline": "off",
    "style/js/generator-star-spacing": "off",
    "style/js/implicit-arrow-linebreak": "off",
    "style/js/indent": "off",
    "style/js/jsx-quotes": "off",
    "style/js/key-spacing": "off",
    "style/js/keyword-spacing": "off",
    "style/js/linebreak-style": "off",
    "style/js/max-statements-per-line": "off",
    "style/js/multiline-ternary": "off",
    "style/js/new-parens": "off",
    "style/js/newline-per-chained-call": "off",
    "style/js/no-extra-parens": "off",
    "style/js/no-extra-semi": "off",
    "style/js/no-floating-decimal": "off",
    "style/js/no-mixed-spaces-and-tabs": "off",
    "style/js/no-multi-spaces": "off",
    "style/js/no-multiple-empty-lines": "off",
    "style/js/no-trailing-spaces": "off",
    "style/js/no-whitespace-before-property": "off",
    "style/js/nonblock-statement-body-position": "off",
    "style/js/object-curly-newline": "off",
    "style/js/object-curly-spacing": "off",
    "style/js/object-property-newline": "off",
    "style/js/one-var-declaration-per-line": "off",
    "style/js/operator-linebreak": "off",
    "style/js/padded-blocks": "off",
    "style/js/quote-props": "off",
    "style/js/rest-spread-spacing": "off",
    "style/js/semi-spacing": "off",
    "style/js/semi-style": "off",
    "style/js/semi": "off",
    "style/js/space-before-blocks": "off",
    "style/js/space-before-function-paren": "off",
    "style/js/space-in-parens": "off",
    "style/js/space-infix-ops": "off",
    "style/js/space-unary-ops": "off",
    "style/js/switch-colon-spacing": "off",
    "style/js/template-curly-spacing": "off",
    "style/js/template-tag-spacing": "off",
    "style/js/wrap-iife": "off",
    "style/js/wrap-regex": "off",
    "style/js/yield-star-spacing": "off",

    "style/jsx-child-element-spacing": "off",
    "style/jsx-closing-bracket-location": "off",
    "style/jsx-closing-tag-location": "off",
    "style/jsx-curly-newline": "off",
    "style/jsx-curly-spacing": "off",
    "style/jsx-equals-spacing": "off",
    "style/jsx-first-prop-new-line": "off",
    "style/jsx-indent-props": "off",
    "style/jsx-indent": "off",
    "style/jsx-max-props-per-line": "off",
    "style/jsx-newline": "off",
    "style/jsx-one-expression-per-line": "off",
    "style/jsx-props-no-multi-spaces": "off",
    "style/jsx-quotes": "off",
    "style/jsx-tag-spacing": "off",
    "style/jsx-wrap-multilines": "off",
    "style/jsx/jsx-child-element-spacing": "off",
    "style/jsx/jsx-closing-bracket-location": "off",
    "style/jsx/jsx-closing-tag-location": "off",
    "style/jsx/jsx-curly-newline": "off",
    "style/jsx/jsx-curly-spacing": "off",
    "style/jsx/jsx-equals-spacing": "off",
    "style/jsx/jsx-first-prop-new-line": "off",
    "style/jsx/jsx-indent-props": "off",
    "style/jsx/jsx-indent": "off",
    "style/jsx/jsx-max-props-per-line": "off",

    "style/ts/block-spacing": "off",
    "style/ts/brace-style": "off",
    "style/ts/comma-dangle": "off",
    "style/ts/comma-spacing": "off",
    "style/ts/func-call-spacing": "off",
    "style/ts/function-call-spacing": "off",
    "style/ts/indent": "off",
    "style/ts/key-spacing": "off",
    "style/ts/keyword-spacing": "off",
    "style/ts/member-delimiter-style": "off",
    "style/ts/no-extra-parens": "off",
    "style/ts/no-extra-semi": "off",
    "style/ts/object-curly-spacing": "off",
    "style/ts/semi": "off",
    "style/ts/space-before-blocks": "off",
    "style/ts/space-before-function-paren": "off",
    "style/ts/space-infix-ops": "off",
    "style/ts/type-annotation-spacing": "off",

    "ts/block-spacing": "off",
    "ts/brace-style": "off",
    "ts/comma-dangle": "off",
    "ts/comma-spacing": "off",
    "ts/func-call-spacing": "off",
    "ts/indent": "off",
    "ts/key-spacing": "off",
    "ts/keyword-spacing": "off",
    "ts/member-delimiter-style": "off",
    "ts/no-extra-parens": "off",
    "ts/no-extra-semi": "off",
    "ts/object-curly-spacing": "off",
    "ts/semi": "off",
    "ts/space-before-blocks": "off",
    "ts/space-before-function-paren": "off",
    "ts/space-infix-ops": "off",
    "ts/type-annotation-spacing": "off",

    "unicorn/empty-brace-spaces": "off",
    "unicorn/no-nested-ternary": "off",
    "unicorn/number-literal-case": "off",

    "vue/array-bracket-newline": "off",
    "vue/array-bracket-spacing": "off",
    "vue/array-element-newline": "off",
    "vue/arrow-spacing": "off",
    "vue/block-spacing": "off",
    "vue/block-tag-newline": "off",
    "vue/brace-style": "off",
    "vue/comma-dangle": "off",
    "vue/comma-spacing": "off",
    "vue/comma-style": "off",
    "vue/dot-location": "off",
    "vue/func-call-spacing": "off",
    "vue/html-closing-bracket-newline": "off",
    "vue/html-closing-bracket-spacing": "off",
    "vue/html-end-tags": "off",
    "vue/html-indent": "off",
    "vue/html-quotes": "off",
    "vue/key-spacing": "off",
    "vue/keyword-spacing": "off",
    "vue/max-attributes-per-line": "off",
    "vue/multiline-html-element-content-newline": "off",
    "vue/multiline-ternary": "off",
    "vue/mustache-interpolation-spacing": "off",
    "vue/no-extra-parens": "off",
    "vue/no-multi-spaces": "off",
    "vue/no-spaces-around-equal-signs-in-attribute": "off",
    "vue/object-curly-newline": "off",
    "vue/object-curly-spacing": "off",
    "vue/object-property-newline": "off",
    "vue/operator-linebreak": "off",
    "vue/quote-props": "off",
    "vue/script-indent": "off",
    "vue/singleline-html-element-content-newline": "off",
    "vue/space-in-parens": "off",
    "vue/space-infix-ops": "off",
    "vue/space-unary-ops": "off",
    "vue/template-curly-spacing": "off",

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
                  plugins: [
                    ...(prettierOptions.plugins ?? []),
                    ...(prettierPluginTailwindcss === undefined ? [] : ["prettier-plugin-tailwindcss"]),
                  ],
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
                  plugins: [
                    ...(prettierOptions.plugins ?? []),
                    ...(prettierPluginTailwindcss === undefined ? [] : ["prettier-plugin-tailwindcss"]),
                  ],
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
                      const sourceCode = context.sourceCode.text;
                      try {
                        const formatted = sortPackageJson(sourceCode);
                        formattingReporter.reportDifferences(context, sourceCode, formatted);
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
