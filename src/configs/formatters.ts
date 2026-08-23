import type { GlobalConfiguration } from "@dprint/formatter";
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
import type {
  FlatConfigItem,
  FormatterType,
  OptionsFormatterCategoryInputEslint,
  OptionsFormatters,
  StylisticConfig,
} from "../types";
import { loadPackages, parserPlain } from "../utils";

import { eslintFormatterStylisticRules } from "./eslint-formatter";
import { StylisticConfigDefaults } from "./stylistic";

/**
 * Options accepted by `eslint-plugin-format`'s `format/dprint` rule:
 * dprint global options plus the rule's language selector fields.
 */
type DprintFormatOptions = GlobalConfiguration & {
  language: string;
  languageOptions?: Record<string, unknown>;
  plugins?: string[];
};

/**
 * dprint global options as computed by this config (includes the plugin-scoped
 * `semiColons` option which `eslint-plugin-format` merges into the plugin call).
 */
type DprintGlobalOptions = GlobalConfiguration & { semiColons?: "asi" | "always" };

/**
 * Top-level defaults a category resolves against.
 */
type FormatterCategoryDefaults = {
  enabled: boolean;
  formatter: FormatterType | undefined;
  prettierOptions: Record<string, unknown>;
  dprintOptions: DprintGlobalOptions;
};

/**
 * A fully resolved formatter category.
 */
type ResolvedFormatterCategory = {
  enabled: boolean;
  formatter: FormatterType | "eslint";
  prettierOptions: Record<string, unknown>;
  dprintOptions: DprintGlobalOptions;
  dprintPlugins: string[] | undefined;
};

/**
 * Every formatter category, fully resolved against the top-level defaults.
 */
export type ResolvedFormatterCategories = {
  js: ResolvedFormatterCategory;
  ts: ResolvedFormatterCategory;
  json: ResolvedFormatterCategory;
  yaml: ResolvedFormatterCategory;
  css: ResolvedFormatterCategory;
  html: ResolvedFormatterCategory;
  markdown: ResolvedFormatterCategory;
  graphql: ResolvedFormatterCategory;
  slidev: ResolvedFormatterCategory;
};

/**
 * The shared resolution consumed by both `formatters()` and assembly:
 * the resolved categories plus the derived option payloads `formatters()`
 * builds its blocks from.
 */
export type FormatterCategoriesResolution = {
  categories: ResolvedFormatterCategories;

  /** User options merged over the `true` shorthand defaults. */
  options: OptionsFormatters;

  prettierOptions: PrettierOptions;
  dprintOptions: DprintGlobalOptions;
  dprintJsTsLanguageOptions: { quoteStyle: "alwaysSingle" | "alwaysDouble" };
};

/**
 * Resolve a single formatter category against the top-level defaults.
 *
 * Merge precedence: category object > top-level > `"prettier"`.
 * A category is enabled unless explicitly `false`; when its value is
 * `undefined` (or a plain-JS `null`), the supplied default decides.
 *
 * @param key - Category name (used for error messages)
 * @param value - User-supplied category value (boolean / string / object)
 * @param defaults - Resolved top-level defaults for this category
 * @returns The resolved category
 * @throws {Error} When the `"eslint"` backend is selected for a category other than `js`/`ts`
 * @throws {Error} When the resolved formatter is not `"prettier"`, `"dprint"`, or (for `js`/`ts`) `"eslint"`
 */
function resolveCategory(
  key: string,
  value: OptionsFormatterCategoryInputEslint | undefined,
  defaults: FormatterCategoryDefaults,
): ResolvedFormatterCategory {
  // Plain-JS consumers get no type checking; a runtime `null` must be treated
  // as unset for enablement and degrade to `{}` for object fields.
  // eslint-disable-next-line ts/no-unnecessary-condition -- see above
  const enabled = value === undefined || value === null ? defaults.enabled : value !== false;
  const category =
    typeof value === "object" &&
    // eslint-disable-next-line ts/no-unnecessary-condition -- see above
    value !== null
      ? value
      : {};

  // String shorthand (`"prettier"` | `"dprint"` | `"eslint"`) selects the formatter directly.
  const mut_rawFormatter: unknown =
    category.formatter ?? (typeof value === "string" ? value : undefined) ?? defaults.formatter;

  if (mut_rawFormatter === "eslint" && key !== "js" && key !== "ts") {
    // eslint-disable-next-line functional/no-throw-statements -- misconfiguration must fail loudly, not silently fall through
    throw new Error(
      `\`formatters.${key}\` does not support the \`"eslint"\` formatter backend - only the \`js\` and \`ts\` categories do.`,
    );
  }

  if (
    mut_rawFormatter !== undefined &&
    mut_rawFormatter !== "prettier" &&
    mut_rawFormatter !== "dprint" &&
    mut_rawFormatter !== "eslint"
  ) {
    const expectedFormatters =
      key === "js" || key === "ts" ? '`"prettier"`, `"dprint"`, or `"eslint"`' : '`"prettier"` or `"dprint"`';
    // eslint-disable-next-line functional/no-throw-statements -- misconfiguration must fail loudly, not silently fall through
    throw new Error(
      `\`formatters.${key}\` received an unsupported formatter value: ${JSON.stringify(mut_rawFormatter)} - expected ${expectedFormatters}, or no formatter to inherit the top-level default.`,
    );
  }

  return {
    enabled,
    formatter: mut_rawFormatter ?? "prettier",
    prettierOptions: { ...defaults.prettierOptions, ...category.prettierOptions },
    dprintOptions: { ...defaults.dprintOptions, ...category.dprintOptions },
    dprintPlugins: category.dprintPlugins,
  };
}

/**
 * Create a format rule for the given resolved category context.
 *
 * @param ctx - Resolved per-category formatter context
 * @param prettierOpts - Prettier options (used only when the category's formatter is "prettier")
 * @param dprintLang - dprint language name (used only when the category's formatter is "dprint")
 * @param dprintLangOpts - dprint language-specific options
 * @returns ESLint rule configuration
 */
function createFormatRule(
  ctx: ResolvedFormatterCategory,
  prettierOpts: Record<string, unknown>,
  dprintLang: string,
  dprintLangOpts?: Record<string, unknown>,
): [string, unknown[]] {
  if (ctx.formatter === "dprint") {
    const dprintOptions: DprintFormatOptions = {
      ...ctx.dprintOptions,
      ...(ctx.dprintPlugins === undefined ? {} : { plugins: ctx.dprintPlugins }),
      language: dprintLang,
      ...(dprintLangOpts === undefined ? {} : { languageOptions: dprintLangOpts }),
    };
    return ["format/dprint", [dprintOptions]];
  }
  return ["format/prettier", [prettierOpts]] as [string, unknown[]];
}

/**
 * Resolve every formatter category against the top-level defaults — the single
 * source of truth shared by `formatters()` and assembly (which needs the
 * resolved js/ts backends to decide stylistic-item suppression).
 *
 * @param optionsInput - Formatter toggles, or `true` to enable all
 * @param stylistic - Stylistic config controlling printWidth/quotes/semi
 * @returns The resolved categories and derived option payloads
 */
export function resolveFormatterCategories(
  optionsInput: Readonly<OptionsFormatters | true>,
  stylistic: Readonly<StylisticConfig>,
): FormatterCategoriesResolution {
  const formatterDefaults = {
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
  };

  const options: OptionsFormatters =
    optionsInput === true ? { ...formatterDefaults } : { ...formatterDefaults, ...optionsInput };

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

  // `semiColons` is plugin-scoped in dprint, but eslint-plugin-format merges global and
  // language options before handing them to the plugin; passing it globally avoids the
  // trailing-separator behavior inside single-line type literals.
  const dprintOptions: DprintGlobalOptions = {
    indentWidth:
      typeof indent === "number"
        ? indent
        : typeof StylisticConfigDefaults.indent === "number"
          ? StylisticConfigDefaults.indent
          : 2,
    lineWidth: printWidth ?? 120,
    newLineKind: "lf",
    semiColons: semi === false ? "asi" : "always",
    useTabs: indent === "tab",
    ...options.dprintOptions,
  };

  const dprintJsTsLanguageOptions: { quoteStyle: "alwaysSingle" | "alwaysDouble" } = {
    quoteStyle: quotes === "single" ? "alwaysSingle" : "alwaysDouble",
  };

  const topLevelDefaults = {
    formatter: options.formatter,
    prettierOptions,
    dprintOptions,
  };

  const mut_resolved: ResolvedFormatterCategories = {
    js: resolveCategory("js", options.js, { ...topLevelDefaults, enabled: formatterDefaults.js }),
    ts: resolveCategory("ts", options.ts, { ...topLevelDefaults, enabled: formatterDefaults.ts }),
    json: resolveCategory("json", options.json, { ...topLevelDefaults, enabled: formatterDefaults.json }),
    yaml: resolveCategory("yaml", options.yaml, { ...topLevelDefaults, enabled: formatterDefaults.yaml }),
    css: resolveCategory("css", options.css, { ...topLevelDefaults, enabled: formatterDefaults.css }),
    html: resolveCategory("html", options.html, { ...topLevelDefaults, enabled: formatterDefaults.html }),
    markdown: resolveCategory("markdown", options.markdown, {
      ...topLevelDefaults,
      enabled: formatterDefaults.markdown,
    }),
    graphql: resolveCategory("graphql", options.graphql, {
      ...topLevelDefaults,
      enabled: formatterDefaults.graphql,
    }),
    slidev: resolveCategory("slidev", options.slidev, { ...topLevelDefaults, enabled: formatterDefaults.slidev }),
  };

  return {
    categories: mut_resolved,
    options,
    prettierOptions,
    dprintOptions,
    dprintJsTsLanguageOptions,
  };
}

/**
 * Enable formatting via `eslint-plugin-format` for JS/TS, JSON, YAML,
 * CSS/SCSS/LESS, HTML, Markdown, GraphQL, and Tailwind files.
 *
 * Passing `true` enables all formatters and auto-detects slidev/tailwind
 * packages. Each file category independently selects its underlying formatter
 * (`"prettier"` or `"dprint"`; `"eslint"` is additionally accepted for
 * `js`/`ts`), falling back to the top-level `formatter` (default
 * `"prettier"`). When a js/ts category selects `"eslint"`, that block skips
 * the external formatter entirely and instead registers `@stylistic` with a
 * relaxed rule map approximating prettier style (no reflow, no line-length
 * enforcement). Non-JS file types use `parserPlain`; `stylistic` drives
 * printWidth/quotes/semi. Throws if `slidev` is enabled without `markdown`.
 *
 * When an object is passed, any unspecified per-language flag inherits the
 * same defaults as passing `true` (all enabled except `dts`), so partial
 * objects behave symmetrically with the `true` shorthand.
 *
 * @param optionsInput - Formatter toggles, or `true` to enable all
 * @param stylistic - Stylistic config controlling printWidth/quotes/semi
 * @param resolution - Pre-computed category resolution from
 * `resolveFormatterCategories`; computed here when omitted so assembly and
 * this function can share a single resolution.
 * @param cssInVue - Also emit formatter blocks for the virtual `<file>.vue/style.<lang>`
 * files the vue SFC block processor creates; requires `vue.sfcBlocks` (default-on)
 * and an enabled `css` category. Defaults to `false`.
 * @returns Flat config items enabling formatting per file type
 */
export async function formatters(
  optionsInput: Readonly<OptionsFormatters | true>,
  stylistic: Readonly<StylisticConfig>,
  resolution?: Readonly<FormatterCategoriesResolution>,
  cssInVue = false,
): Promise<FlatConfigItem[]> {
  const {
    categories: mut_resolved,
    options,
    dprintJsTsLanguageOptions,
  } = resolution ?? resolveFormatterCategories(optionsInput, stylistic);

  if (mut_resolved.slidev.enabled && !mut_resolved.markdown.enabled) {
    throw new Error("`slidev` option only works when `markdown` is enabled");
  }

  const formattingCategories = Object.values(mut_resolved);

  if (formattingCategories.every((category) => !category.enabled)) {
    return [];
  }

  const needsPrettier = formattingCategories.some((category) => category.enabled && category.formatter === "prettier");
  const needsDprint = formattingCategories.some((category) => category.enabled && category.formatter === "dprint");
  const needsStylisticPlugin = formattingCategories.some(
    (category) => category.enabled && category.formatter === "eslint",
  );

  const neededPackageIds = [
    "eslint-plugin-format",
    ...(needsPrettier || needsDprint ? ["eslint-config-prettier"] : []),
    ...(needsStylisticPlugin ? ["@stylistic/eslint-plugin"] : []),
    "sort-package-json",
    "eslint-formatting-reporter",
    ...(needsPrettier ? ["prettier"] : []),
  ];

  const loadedPackages = await loadPackages(neededPackageIds);
  const packagesById = new Map<string, unknown>(neededPackageIds.map((id, index) => [id, loadedPackages[index]]));

  const [mut_pluginFormat, mut_configPrettier, sortPackageJson, formattingReporter] = [
    packagesById.get("eslint-plugin-format") as ESLint.Plugin,
    // Absent when no enabled category uses prettier/dprint (e.g. js/ts-only `"eslint"`).
    packagesById.get("eslint-config-prettier") as ESLint.ConfigData | undefined,
    packagesById.get("sort-package-json") as (typeof import("sort-package-json"))["default"],
    packagesById.get("eslint-formatting-reporter") as typeof import("eslint-formatting-reporter"),
  ];

  // Defined when a js/ts category selects the `"eslint"` backend; the same
  // memoized module instance `stylistic()` uses (ESM cache + loadPackages
  // memoization), so dual registration is safe.
  const pluginStylistic = packagesById.get("@stylistic/eslint-plugin") as
    (typeof import("@stylistic/eslint-plugin"))["default"] | undefined;

  // Backend-independent rule offs, applied to every formatter block no matter
  // which formatter backs it.
  const backendIndependentOffs = {
    "no-irregular-whitespace": "off",
    "yml/block-sequence-hyphen-indicator-newline": "off",
  } satisfies FlatConfigItem["rules"];

  // Rule offs derived from `eslint-config-prettier` plus rules whose concerns
  // are owned by prettier/dprint. Applied only to prettier/dprint-backed blocks.
  const prettierDerivedOffs = {
    ...Object.fromEntries(Object.entries(mut_configPrettier?.rules ?? {}).filter(([, value]) => value === "off")),

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
  } satisfies FlatConfigItem["rules"];

  /**
   * Compute the rule offs for a block backed by the given resolved category.
   *
   * @param ctx - Resolved per-category formatter context
   * @returns ESLint rule configuration
   */
  function turnOffRules(ctx: ResolvedFormatterCategory): FlatConfigItem["rules"] {
    return {
      ...(ctx.formatter === "prettier" || ctx.formatter === "dprint" ? prettierDerivedOffs : {}),

      ...backendIndependentOffs,

      // dprint controls operator line-break positioning and ternary layout.
      ...(ctx.formatter === "dprint" && {
        "@stylistic/operator-linebreak": "off",
        "unicorn/no-nested-ternary": "off",
        // dprint controls import member and declaration ordering.
        "import-x/order": "off",
        "sort-imports": "off",
      }),
    };
  }

  // Shorthand: create format rule with the category's resolved formatter.
  function fmtRule(
    ctx: ResolvedFormatterCategory,
    prettierOpts: Record<string, unknown>,
    dprintLang: string,
    dprintLangOpts?: Record<string, unknown>,
  ): FlatConfigItem["rules"] {
    const [ruleName, ruleArgs] = createFormatRule(ctx, prettierOpts, dprintLang, dprintLangOpts);
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

  if (mut_resolved.js.enabled) {
    const jsEslintBackend = mut_resolved.js.formatter === "eslint";
    mut_configs.push({
      name: "rs:formatter:javascript",
      files: [GLOB_JS, GLOB_JSX],
      ...(jsEslintBackend && {
        plugins: {
          "@stylistic": pluginStylistic as ESLint.Plugin,
        },
      }),
      rules: jsEslintBackend
        ? {
            // D6: backend-independent offs apply everywhere, backend included.
            ...backendIndependentOffs,
            ...(await eslintFormatterStylisticRules({ stylistic, typescript: false })),
          }
        : {
            ...turnOffRules(mut_resolved.js),
            ...fmtRule(
              mut_resolved.js,
              {
                ...mut_resolved.js.prettierOptions,
                parser: "babel",
                ...(options.tailwind === true && {
                  plugins: mut_resolved.js.prettierOptions["plugins"] ?? [],
                }),
              },
              "typescript",
              dprintJsTsLanguageOptions,
            ),
          },
    });
  }

  if (mut_resolved.ts.enabled) {
    const tsEslintBackend = mut_resolved.ts.formatter === "eslint";
    mut_configs.push({
      name: "rs:formatter:typescript",
      files: [GLOB_TS, GLOB_TSX],
      ignores: options.dts === true ? [] : [GLOB_DTS],
      ...(tsEslintBackend && {
        plugins: {
          "@stylistic": pluginStylistic as ESLint.Plugin,
        },
      }),
      rules: tsEslintBackend
        ? {
            // D6: backend-independent offs apply everywhere, backend included.
            ...backendIndependentOffs,
            ...(await eslintFormatterStylisticRules({ stylistic, typescript: true })),
          }
        : {
            ...turnOffRules(mut_resolved.ts),
            ...fmtRule(
              mut_resolved.ts,
              {
                ...mut_resolved.ts.prettierOptions,
                parser: "typescript",
                ...(options.tailwind === true && {
                  plugins: mut_resolved.ts.prettierOptions["plugins"] ?? [],
                }),
              },
              "typescript",
              dprintJsTsLanguageOptions,
            ),
          },
    });
  }

  if (mut_resolved.yaml.enabled) {
    mut_configs.push({
      name: "rs:formatter:yaml",
      files: [GLOB_YAML],
      languageOptions: {
        parser: parserPlain,
      },
      rules: {
        ...turnOffRules(mut_resolved.yaml),
        ...fmtRule(mut_resolved.yaml, { ...mut_resolved.yaml.prettierOptions, parser: "yaml" }, "yaml"),
      },
    });
  }

  if (mut_resolved.json.enabled) {
    mut_configs.push(
      {
        name: "rs:formatter:json",
        files: [GLOB_JSON],
        ignores: ["**/package.json"],
        languageOptions: {
          parser: parserPlain,
        },
        rules: {
          ...turnOffRules(mut_resolved.json),
          ...fmtRule(mut_resolved.json, { ...mut_resolved.json.prettierOptions, parser: "json" }, "json"),
        },
      },
      {
        name: "rs:formatter:jsonc",
        files: [GLOB_JSONC],
        languageOptions: {
          parser: parserPlain,
        },
        rules: {
          ...turnOffRules(mut_resolved.json),
          ...fmtRule(mut_resolved.json, { ...mut_resolved.json.prettierOptions, parser: "jsonc" }, "json"),
        },
      },
      {
        name: "rs:formatter:json5",
        files: [GLOB_JSON5],
        languageOptions: {
          parser: parserPlain,
        },
        rules: {
          ...turnOffRules(mut_resolved.json),
          ...fmtRule(mut_resolved.json, { ...mut_resolved.json.prettierOptions, parser: "json5" }, "json"),
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

  if (mut_resolved.css.enabled) {
    mut_configs.push(
      {
        name: "rs:formatter:css",
        files: [GLOB_CSS, GLOB_POSTCSS],
        languageOptions: {
          parser: parserPlain,
        },
        rules: {
          ...turnOffRules(mut_resolved.css),
          ...fmtRule(mut_resolved.css, { ...mut_resolved.css.prettierOptions, parser: "css" }, "css"),
        },
      },
      {
        name: "rs:formatter:scss",
        files: [GLOB_SCSS],
        languageOptions: {
          parser: parserPlain,
        },
        rules: {
          ...turnOffRules(mut_resolved.css),
          ...fmtRule(mut_resolved.css, { ...mut_resolved.css.prettierOptions, parser: "scss" }, "css"),
        },
      },
      {
        name: "rs:formatter:less",
        files: [GLOB_LESS],
        languageOptions: {
          parser: parserPlain,
        },
        rules: {
          ...turnOffRules(mut_resolved.css),
          ...fmtRule(mut_resolved.css, { ...mut_resolved.css.prettierOptions, parser: "less" }, "css"),
        },
      },
    );
  }

  /**
   * Format `<style>` blocks inside Vue SFCs via the virtual files
   * `eslint-processor-vue-blocks` emits (`<file>.vue/style.<lang>`, wired by
   * the vue config when `vue.sfcBlocks` is enabled — its default). Requires
   * both Vue support and an enabled `formatters.css` category; style blocks in
   * languages without a parser mapping here (e.g. stylus, plain `sass`) are
   * silently uncovered.
   *
   * Edge case: these globs match the processor's virtual output; a real
   * on-disk path literally shaped like `*.vue/style.css` would also match.
   * That is pathological and accepted — formatter rules are harmless there.
   */
  if (cssInVue && mut_resolved.css.enabled) {
    mut_configs.push(
      {
        name: "rs:formatter:vue-style-css",
        files: ["**/*.vue/style.css", "**/*.vue/style.pcss", "**/*.vue/style.postcss"],
        languageOptions: {
          parser: parserPlain,
        },
        rules: {
          ...turnOffRules(mut_resolved.css),
          ...fmtRule(mut_resolved.css, { ...mut_resolved.css.prettierOptions, parser: "css" }, "css"),
        },
      },
      {
        name: "rs:formatter:vue-style-scss",
        files: ["**/*.vue/style.scss"],
        languageOptions: {
          parser: parserPlain,
        },
        rules: {
          ...turnOffRules(mut_resolved.css),
          ...fmtRule(mut_resolved.css, { ...mut_resolved.css.prettierOptions, parser: "scss" }, "css"),
        },
      },
      {
        name: "rs:formatter:vue-style-less",
        files: ["**/*.vue/style.less"],
        languageOptions: {
          parser: parserPlain,
        },
        rules: {
          ...turnOffRules(mut_resolved.css),
          ...fmtRule(mut_resolved.css, { ...mut_resolved.css.prettierOptions, parser: "less" }, "css"),
        },
      },
    );
  }

  if (mut_resolved.html.enabled) {
    mut_configs.push({
      name: "rs:formatter:html",
      files: ["**/*.html"],
      languageOptions: {
        parser: parserPlain,
      },
      rules: {
        ...turnOffRules(mut_resolved.html),
        ...fmtRule(mut_resolved.html, { ...mut_resolved.html.prettierOptions, parser: "html" }, "html"),
      },
    });
  }

  if (mut_resolved.markdown.enabled) {
    // Plain-JS consumers get no type checking; a runtime `null` must not crash.
    const GLOB_SLIDEV = mut_resolved.slidev.enabled
      ? typeof options.slidev === "object" &&
        // eslint-disable-next-line ts/no-unnecessary-condition -- see above
        options.slidev !== null
        ? (options.slidev.files ?? [])
        : ["**/slides.md"]
      : [];

    mut_configs.push({
      name: "rs:formatter:markdown",
      files: [GLOB_MARKDOWN],
      ignores: GLOB_SLIDEV,
      languageOptions: {
        parser: parserPlain,
      },
      rules: {
        ...turnOffRules(mut_resolved.markdown),
        ...fmtRule(
          mut_resolved.markdown,
          {
            ...mut_resolved.markdown.prettierOptions,
            embeddedLanguageFormatting: "off",
            parser: "markdown",
          },
          "markdown",
        ),
      },
    });

    if (mut_resolved.slidev.enabled) {
      mut_configs.push({
        name: "rs:formatter:slidev",
        files: GLOB_SLIDEV,
        languageOptions: {
          parser: parserPlain,
        },
        rules: {
          ...turnOffRules(mut_resolved.slidev),
          ...fmtRule(
            mut_resolved.slidev,
            {
              ...mut_resolved.slidev.prettierOptions,
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

  if (mut_resolved.graphql.enabled) {
    mut_configs.push({
      files: [GLOB_GRAPHQL],
      languageOptions: {
        parser: parserPlain,
      },
      name: "rs:formatter:graphql",
      rules: {
        ...turnOffRules(mut_resolved.graphql),
        ...fmtRule(mut_resolved.graphql, { ...mut_resolved.graphql.prettierOptions, parser: "graphql" }, "graphql"),
      },
    });
  }

  return mut_configs;
}
