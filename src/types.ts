import { type StylisticCustomizeOptions } from "@stylistic/eslint-plugin";
import { type ParserOptions } from "@typescript-eslint/parser";
import { type TSESLint } from "@typescript-eslint/utils";
import { type ESLint, type Linter } from "eslint";
import { type Options as VueBlocksOptions } from "eslint-processor-vue-blocks";
import { type Options as PrettierOptions } from "prettier";

import { type SettingsVueI18nLocaleDir } from "../typings/eslint-plugin-vue-i18n";

import { type RuleOptions } from "./typegen";

export type Awaitable<T> = T | Promise<T>;

export type Rules = RuleOptions;

export type FlatConfigItem = Omit<Linter.FlatConfig, "plugins" | "rules"> & {
  /**
   * Custom name of each config item
   */
  name?: string;

  plugins?: Record<
    string,
    Readonly<ESLint.Plugin | TSESLint.FlatConfig.Plugin>
  >;

  /**
   * An object containing a name-value mapping of rules to use.
   */
  rules?: Record<string, Linter.RuleEntry> & Rules;
};

export type OptionsFiles = {
  /**
   * Override the `files` option to provide custom globs.
   */
  files?: string[];
};

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
    | {
        localeDir?: SettingsVueI18nLocaleDir;
        messageSyntaxVersion?: string;
      }
    | false;
} & OptionsOverrides;

export type OptionsTypescript = (
  | (OptionsTypeScriptWithTypes & OptionsOverrides)
  | (OptionsTypeScriptParserOptions & OptionsOverrides)
) &
  OptionsTypeScriptUnsafeSeverity;

export type OptionsFormatters = {
  js?: boolean;
  ts?: boolean;
  json?: boolean;
  yaml?: boolean;
  dts?: boolean;
  css?: boolean;
  html?: boolean;
  markdown?: boolean;
  graphql?: boolean;
  prettierOptions?: PrettierOptions;
  slidev?:
    | boolean
    | {
        files?: string[];
      };
};

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

export type OptionsTypeScriptWithTypes = {
  /**
   * When this options is provided, type aware rules will be enabled.
   *
   * @see https://typescript-eslint.io/linting/typed-linting/
   */
  tsconfig?: true | string | string[];
};

export type OptionsTypeScriptUnsafeSeverity = {
  unsafe?: "off" | "warn" | "error";
};

export type OptionsHasTypeScript = {
  typescript?: boolean;
};

export type OptionsStylistic = {
  stylistic?: boolean | StylisticConfig;
};

export type StylisticConfig = {} & Pick<
  StylisticCustomizeOptions,
  "indent" | "quotes" | "jsx" | "semi"
>;

export type OptionsOverrides = {
  overrides?: FlatConfigItem["rules"];
};

export type OptionsIsInEditor = {
  isInEditor?: boolean;
};

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

export type OptionsFunctional = {
  functionalEnforcement?: "none" | "lite" | "default" | "strict";
  ignoreNamePattern?: string[];
  // ignoreTypePattern?: string[];
};

export type OptionsIgnores =
  | Linter.FlatConfig["ignores"]
  | {
      extend?: boolean;
      files?: Linter.FlatConfig["ignores"];
    };

export type OptionsConfig = {
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
  functional?:
    | boolean
    | OptionsFunctional["functionalEnforcement"]
    | (OptionsOverrides & OptionsFunctional);

  /**
   * Enable Vue support.
   *
   * @default auto-detect based on the dependencies
   */
  vue?: boolean | OptionsVue;

  /**
   * Enable JSONC support.
   */
  jsonc?: boolean | OptionsOverrides;

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
  markdown?: boolean | OptionsOverrides;

  /**
   * Enable stylistic rules.
   */
  stylistic?: boolean | (StylisticConfig & OptionsOverrides);

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
   * Automatically rename plugins in the config.
   */
  autoRenamePlugins?: boolean;

  ignores?: OptionsIgnores;
} & OptionsComponentExts;
