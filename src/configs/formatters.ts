import { type ESLint } from "eslint";
import { isPackageExists } from "local-pkg";
import { type Options as PrettierOptions } from "prettier";

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
} from "..";
import {
  type FlatConfigItem,
  type OptionsFormatters,
  type StylisticConfig,
} from "../types";
import { loadPackages, parserPlain } from "../utils";

export async function formatters(
  opts: OptionsFormatters | true = {},
  stylistic: StylisticConfig = {},
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
        }
      : opts;

  if (
    options.slidev !== false &&
    options.slidev !== undefined &&
    options.markdown !== true
  )
    throw new Error(
      "`slidev` option only works when `markdown` is enabled with `prettier`",
    );

  const { indent, quotes, semi } = stylistic;

  const prettierOptions: PrettierOptions = Object.assign(
    {
      endOfLine: "lf",
      semi: semi ?? true,
      singleQuote: quotes === "single",
      tabWidth: typeof indent === "number" ? indent : 2,
      trailingComma: "all",
      useTabs: indent === "tab",
    } satisfies PrettierOptions,

    options.prettierOptions ?? {},
  );

  const [pluginFormat, configPrettier] = (await loadPackages([
    "eslint-plugin-format",
    "eslint-config-prettier",
    "prettier",
    "prettier-plugin-multiline-arrays",
  ])) as [ESLint.Plugin, ESLint.ConfigData];

  const turnOffRulesForPrettier = {
    ...configPrettier.rules,

    "style/block-spacing": "off",
    "style/brace-style": "off",
    "style/comma-dangle": "off",
    "style/comma-spacing": "off",
    "style/func-call-spacing": "off",
    "style/indent": "off",
    "style/indent-binary-ops": "off",
    "style/key-spacing": "off",
    "style/keyword-spacing": "off",
    "style/lines-around-comment": "off",
    "style/member-delimiter-style": "off",
    "style/no-extra-parens": "off",
    "style/no-extra-semi": "off",
    "style/nonblock-statement-body-position": "off",
    "style/object-curly-newline": "off",
    "style/object-curly-spacing": "off",
    "style/operator-linebreak": "off",
    "style/quote-props": "off",
    "style/quotes": "off",
    "style/semi": "off",
    "style/space-before-blocks": "off",
    "style/space-before-function-paren": "off",
    "style/space-infix-ops": "off",
    "style/type-annotation-spacing": "off",

    "yaml/block-sequence-hyphen-indicator-newline": "off",
  } satisfies FlatConfigItem["rules"];

  const configs: FlatConfigItem[] = [
    {
      name: "rs:formatters:setup",
      plugins: {
        format: pluginFormat,
      },
    },
  ];

  if (options.js !== undefined && options.js !== false) {
    configs.push({
      name: "rs:formatter:javascript",
      files: [GLOB_JS, GLOB_JSX],
      rules: {
        ...turnOffRulesForPrettier,
        "format/prettier": [
          "error",
          {
            ...prettierOptions,
            parser: "babel",
          },
        ],
      },
    });
  }

  if (options.ts !== undefined && options.ts !== false) {
    configs.push({
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
          },
        ],
      },
    });
  }

  if (options.yaml !== undefined && options.yaml !== false) {
    configs.push({
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
            plugins: ["prettier-plugin-multiline-arrays"],
          },
        ],
      },
    });
  }

  if (options.json !== undefined && options.json !== false) {
    configs.push(
      {
        name: "rs:formatter:json",
        files: [GLOB_JSON],
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
              plugins: ["prettier-plugin-multiline-arrays"],
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
              plugins: ["prettier-plugin-multiline-arrays"],
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
              plugins: ["prettier-plugin-multiline-arrays"],
              parser: "json5",
            },
          ],
        },
      },
      {
        name: "rs:formatter:json",
        files: ["**/package.json"],
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
              plugins: [
                // "prettier-plugin-packagejson",
                "prettier-plugin-multiline-arrays",
              ],
            },
          ],
        },
      },
    );
  }

  if (options.css !== undefined && options.css !== false) {
    configs.push(
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

  if (options.html !== undefined && options.html !== false) {
    configs.push({
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

  if (options.markdown !== undefined && options.markdown !== false) {
    const GLOB_SLIDEV =
      options.slidev === undefined || options.slidev === false
        ? []
        : options.slidev === true
          ? ["**/slides.md"]
          : options.slidev.files ?? [];

    configs.push({
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
            printWidth: 120,
            ...prettierOptions,
            embeddedLanguageFormatting: "off",
            parser: "markdown",
          },
        ],
      },
    });

    if (options.slidev !== undefined && options.slidev !== false) {
      configs.push({
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
              printWidth: 120,
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

  if (options.graphql !== undefined && options.graphql !== false) {
    configs.push({
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

  return configs;
}
