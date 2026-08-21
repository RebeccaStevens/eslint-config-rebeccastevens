import type { StylisticCustomizeOptions } from "@stylistic/eslint-plugin";
import type { ParserOptions } from "@typescript-eslint/parser";
import type { TSESLint } from "@typescript-eslint/utils";
import type { ESLint, Linter } from "eslint";
import type { Options as VueBlocksOptions } from "eslint-processor-vue-blocks";
import type { Options as PrettierOptions } from "prettier";

import type { SettingsVueI18nLocaleDir } from "../typings/eslint-plugin-vue-i18n";

import type { RuleOptions as Rules } from "./typegen";

/**
 * A value that may be synchronous or a `Promise`.
 */
export type Awaitable<T> = T | Promise<T>;

export type FlatConfigItem = Omit<Linter.Config, "plugins" | "rules"> & {
  /**
   * Custom name of each config item
   */
  name?: string | undefined;

  plugins?: Record<string, Readonly<ESLint.Plugin | TSESLint.FlatConfig.Plugin>> | undefined;

  /**
   * An object containing a name-value mapping of rules to use.
   */
  rules?: (TSESLint.FlatConfig.Config["rules"] & Rules) | undefined;
};

export type OptionsFiles = {
  /**
   * Override the `files` option to provide custom globs.
   */
  files?: string[];
};

/**
 * React-specific options.
 *
 * Supports i18n integration (i18next) and rule overrides.
 */
export type OptionsReact = {
  i18n?:
    | ({
        library: "i18next";
      } & OptionsOverrides)
    | false;
} & OptionsOverrides;

export type OptionsVue = {
  /**
   * Create virtual files for Vue SFC blocks to enable linting.
   *
   * @see https://github.com/antfu/eslint-processor-vue-blocks
   * @default true
   */
  sfcBlocks?: boolean | VueBlocksOptions;

  /**
   * Vue version. Apply different rules set from `eslint-plugin-vue`.
   *
   * @default 3
   */
  vueVersion?: 2 | 3;

  i18n?:
    | false
    | {
        localeDir?: SettingsVueI18nLocaleDir;
        messageSyntaxVersion?: string;
      };
} & OptionsOverrides;

/**
 * TypeScript configuration options.
 *
 * Combines parser options, rule overrides, unsafe severity, and project shorthands.
 */
export type OptionsTypescript = OptionsTypeScriptParserOptions &
  OptionsOverrides &
  OptionsTypeScriptUnsafeSeverity &
  OptionsTypeScriptShorthands;

/**
 * Common formatter options for individual file types.
 */
export type OptionsFormattersBase = {
  js?: boolean;
  ts?: boolean;
  json?: boolean;
  yaml?: boolean;
  dts?: boolean;
  css?: boolean;
  html?: boolean;
  markdown?: boolean;
  graphql?: boolean;
  tailwind?: boolean;
  slidev?:
    | boolean
    | {
        files?: string[];
      };
};

/**
 * Prettier formatting options.
 */
export type OptionsFormattersPrettier = OptionsFormattersBase & {
  /**
   * Formatter to use: `"prettier"` (default).
   */
  formatter?: "prettier";

  /**
   * Options for Prettier.
   */
  prettierOptions?: PrettierOptions;

  dprintOptions?: never;

  dprintPlugins?: never;
};

/**
 * dprint formatting options.
 */
export type OptionsFormattersDprint = OptionsFormattersBase & {
  /**
   * Formatter to use: `"dprint"`.
   */
  formatter: "dprint";

  /**
   * Options for dprint.
   */
  dprintOptions?: Record<string, unknown>;

  /**
   * dprint language plugins to use when `formatter: "dprint"`.
   */
  dprintPlugins?: string[];

  prettierOptions?: never;
};

/**
 * Per-language formatter enable flags.
 *
 * When `true` is passed to the `formatters` option, all flags default to `true`
 * (except `dts`). Supports Prettier and dprint under the hood.
 */
export type OptionsFormatters = OptionsFormattersPrettier | OptionsFormattersDprint;

export type OptionsComponentExts = {
  /**
   * Additional extensions for components.
   *
   * @example ['vue']
   *
   * @default []
   */
  componentExts?: string[];
};

export type OptionsTypeScriptParserOptions = {
  /**
   * Additional parser options for TypeScript.
   */
  parserOptions?: Partial<ParserOptions>;

  /**
   * Glob patterns for files that should be type aware.
   *
   * @default ['**\/*.{ts,tsx}']
   */
  filesTypeAware?: string[];
};

export type OptionsTypeScriptShorthands = {
  /**
   * Any easy way to disable the default project.
   * Has no effect if `parserOptions.projectService` is set.
   *
   * @default true
   */
  useDefaultDefaultProject?: boolean;

  /**
   * Enforce erasable syntax only rules (`eslint-plugin-erasable-syntax-only`).
   *
   * By default, auto-detected based on `compilerOptions.erasableSyntaxOnly` in the project's `tsconfig.json`.
   */
  erasableSyntaxOnly?: boolean;
};

/**
 * Controls severity of `@typescript-eslint/no-unsafe-*` rules.
 */
export type OptionsTypeScriptUnsafeSeverity = {
  unsafe?: "off" | "warn" | "error";
};

/**
 * Simple boolean flag indicating TypeScript support.
 */
export type OptionsHasTypeScript = {
  typescript?: boolean;
};

/**
 * Flag to enable rules that require TypeScript type information.
 */
export type OptionsTypeRequiredRules = {
  enableTypeRequiredRules?: boolean;
};

/**
 * Stylistic configuration enable flag.
 */
export type OptionsStylistic = {
  stylistic?: StylisticConfig | false;
};

/**
 * Required stylistic configuration — all fields filled or `false` to disable.
 */
export type RequiredOptionsStylistic = {
  stylistic: Required<StylisticConfig> | false;
};

/**
 * Stylistic formatting options forwarded to `@stylistic/eslint-plugin`.
 *
 * Controls indent style, quote style, semicolons, JSX, and print width.
 */
export type StylisticConfig = {
  printWidth?: number;
  indent?: "tab" | number;
} & Pick<StylisticCustomizeOptions, "quotes" | "jsx" | "semi">;

/**
 * User-provided rule overrides applied on top of built-in rules.
 */
export type OptionsOverrides = {
  overrides?: FlatConfigItem["rules"];
};

/**
 * Flag indicating the config is running inside an editor (disables slow/stylistic rules).
 */
export type OptionsIsInEditor = {
  isInEditor?: boolean;
};

/**
 * Options controlling plugin renaming.
 */
export type OptionsRenamePlugins = {
  /**
   * Rename plugins in the config.
   *
   * - When `true` (the default), default plugin renames are applied (see `defaultPluginRenaming`).
   * - When `false`, plugins are not renamed.
   * - When a record map is provided, custom renames are applied on top of / replacing default renames.
   *
   * @default true
   */
  renamePlugins?: boolean | Record<string, string>;
};

/**
 * Tailwind CSS configuration — discriminated union by version.
 *
 * - v4: requires `tailwindEntryPoint` (CSS entry file path)
 * - v3: uses `tailwindConfig` (config file path, defaults to `tailwind.config.js`)
 */
export type OptionsTailwindCSS = (
  | {
      tailwindVersion?: 4;

      /**
       * The path to the entry file of the css based tailwind config (eg: `src/global.css`)
       */
      tailwindEntryPoint: string;
    }
  | {
      tailwindVersion?: 3;

      /**
       * The path to the tailwind config file.
       *
       * @default "tailwind.config.js"
       */
      tailwindConfig?: string;
    }
) &
  OptionsOverrides;

/**
 * Resolved Tailwind options with all fields required.
 *
 * TODO: Generate this type from `OptionsTailwindCSS`.
 * Can't use `Required<>` directly because `OptionsTailwindCSS` is a discriminated union.
 */
export type RequiredOptionsTailwindCSS = {
  tailwindVersion: 3 | 4;
  tailwindEntryPoint: string | undefined;
  tailwindConfig: string | undefined;
} & Required<OptionsOverrides>;

export type OptionsUnoCSS = {
  /**
   * Enable attributify support.
   */
  attributify?: boolean;

  /**
   * Enable strict mode by throwing errors about blocklisted classes.
   */
  strict?: boolean;
} & OptionsOverrides;

/**
 * Options for pnpm workspace support.
 */
export type OptionsPnpm = {
  /**
   * Enable catalog enforcement rules (`json-enforce-catalog`, `json-valid-catalog`, `json-prefer-workspace-settings`).
   *
   * These rules enforce using pnpm catalogs for dependency versions in `package.json`.
   * Disable if your project doesn't use pnpm catalogs.
   *
   * @default false
   */
  catalog?: boolean;
} & OptionsOverrides;

/**
 * Security rule enforcement options.
 *
 * - `none`: no security rules
 * - `lite`: basic rules set to "warn" (detect-object-injection and detect-non-literal-fs-filename off)
 * - `moderate`: standard rules set to "error" (detect-object-injection and detect-non-literal-fs-filename off)
 * - `recommended`: alias for `moderate`
 * - `strict`: all security rules set to "error" (including detect-object-injection and detect-non-literal-fs-filename)
 */
export type OptionsSecurity = {
  severity?: "none" | "lite" | "moderate" | "recommended" | "strict";
} & OptionsOverrides;

/**
 * Functional programming enforcement options.
 *
 * - `none`: no functional rules
 * - `lite`: basic rules (no-param-reassign)
 * - `recommended`: moderate (prefer-immutable-types as warning)
 * - `strict`: full enforcement (all rules as errors)
 */
export type OptionsFunctional = {
  functionalEnforcement?: "none" | "lite" | "recommended" | "strict";
  ignoreNamePattern?: string[];
  // ignoreTypePattern?: string[]; // Deferred: eslint-plugin-functional only exposes this on some rules,
  //   so applying it uniformly would cause inconsistent behavior.
};

/**
 * Project mode controlling strictness levels.
 *
 * - `library`: strict — enforces extensions, disallows void returns, requires immutable types
 * - `application`: lenient — no extension requirements, allows side effects
 * - `none`: default — no mode-specific rules
 */
export type OptionsMode = {
  mode: "library" | "application" | "none";
};

/**
 * Root directory of the project (used for Node version detection, etc.).
 */
export type OptionsProjectRoot = {
  projectRoot: string;
};

export type OptionsIgnoreFiles = {
  /**
   * Files that contain ignore patterns.
   *
   * @default [".gitignore"]
   */
  ignoreFiles: string[];
};

/**
 * Ignore patterns configuration.
 *
 * Accepts either a plain array of glob patterns, or an object with `extend` (boolean)
 * and `files` (patterns) to conditionally extend the default ignores.
 */
export type OptionsIgnores =
  | NonNullable<Linter.Config["ignores"]>
  | {
      extend: boolean;
      files: NonNullable<Linter.Config["ignores"]>;
    };

export type OptionsConfig = {
  /**
   * The root directory of the project.
   */
  projectRoot: OptionsProjectRoot["projectRoot"];

  /**
   * What are we linting?
   */
  mode: OptionsMode["mode"];

  /**
   * Core rules. Can't be disabled.
   */
  javascript?: OptionsOverrides;

  /**
   * Enable TypeScript support.
   *
   * Passing an object to enable TypeScript Language Server support.
   *
   * @default auto-detect based on the dependencies
   */
  typescript?: boolean | OptionsTypescript;

  /**
   * Enable JSX related rules.
   */
  jsx?: boolean;

  /**
   * Enable test support.
   */
  test?: boolean | OptionsOverrides;

  /**
   * Enforce functional programming.
   */
  functional?: boolean | OptionsFunctional["functionalEnforcement"] | (OptionsOverrides & OptionsFunctional);

  /**
   * Enable React support.
   *
   * @default auto-detect based on the dependencies
   */
  react?: boolean | OptionsReact;

  /**
   * Enable Vue support.
   *
   * @default auto-detect based on the dependencies
   */
  vue?: boolean | OptionsVue;

  /**
   * Enable JSON, JSONC, and JSON5 linting.
   *
   * When enabled with `stylistic` and `typescript`, also enforces tsconfig.json key ordering.
   */
  json?: boolean | OptionsOverrides;

  /**
   * Enable YAML support.
   */
  yaml?: boolean | OptionsOverrides;

  /**
   * Enable TOML support.
   */
  toml?: boolean | OptionsOverrides;

  /**
   * Enable linting for **code snippets** in Markdown.
   *
   * For formatting Markdown content, enable also `formatters.markdown`.
   */
  markdown?: boolean | (OptionsOverrides & OptionsTypeRequiredRules);

  /**
   * Enable stylistic rules.
   */
  stylistic?: boolean | (StylisticConfig & OptionsOverrides);

  /**
   * Enable tailwind rules.
   */
  tailwind?: boolean | OptionsTailwindCSS;

  /**
   * Enable unocss rules.
   */
  unocss?: boolean | OptionsUnoCSS;

  /**
   * Use external formatters to format files.
   *
   * When set to `true`, it will enable all formatters.
   */
  formatters?: boolean | OptionsFormatters;

  /**
   * Control to disable some rules in editors.
   */
  isInEditor?: boolean;

  /**
   * Rename plugins in the config.
   *
   * - When `true` (the default), default plugin renames are applied (see `defaultPluginRenaming`).
   * - When `false`, plugins are not renamed.
   * - When a record map is provided, custom renames are applied on top of / replacing default renames.
   *
   * @default true
   */
  renamePlugins?: OptionsRenamePlugins["renamePlugins"];

  /**
   * Enable SonarJS rules.
   */
  sonar?: boolean;

  /**
   * Enable command support (e.g. keep-sorted, etc).
   */
  command?: boolean;

  /**
   * Enable security support (eslint-plugin-security).
   */
  security?: boolean | OptionsSecurity["severity"] | (OptionsOverrides & OptionsSecurity);

  /**
   * Enable perfectionist support.
   */
  perfectionist?: boolean | OptionsOverrides;

  /**
   * Enable pnpm workspace support (eslint-plugin-pnpm).
   */
  pnpm?: boolean | OptionsPnpm;

  ignores?: OptionsIgnores;

  /**
   * Files that contain ignore patterns.
   *
   * @default [".gitignore"]
   */
  ignoresFiles?: OptionsIgnoreFiles["ignoreFiles"];
} & OptionsComponentExts;

export { type RuleOptions as Rules } from "./typegen";
