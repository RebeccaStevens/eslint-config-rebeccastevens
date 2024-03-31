import { FlatConfigPipeline } from "eslint-flat-config-utils";
import { isPackageExists } from "local-pkg";

import {
  StylisticConfigDefaults,
  comments,
  formatters,
  functional,
  ignores,
  imports,
  javascript,
  jsdoc,
  jsonc,
  markdown,
  node,
  overrides,
  sortTsconfig,
  stylistic,
  test,
  toml,
  typescript,
  unicorn,
  unocss,
  vue,
  yaml,
} from "./configs";
import {
  type Awaitable,
  type FlatConfigItem,
  type OptionsConfig,
} from "./types";

const VuePackages = ["vue", "nuxt", "vitepress", "@slidev/cli"];

export const defaultPluginRenaming = {
  "@stylistic": "style",
  "@typescript-eslint": "ts",
  "import-x": "import",
  n: "node",
  sonarjs: "sonar",
  vitest: "test",
  yml: "yaml",
};

/**
 * Construct an array of ESLint flat config items.
 *
 * @param {OptionsConfig & FlatConfigItem} options - The options for generating the ESLint configurations.
 * @param {Awaitable<FlatConfigItem | FlatConfigItem[]>[]} userConfigs - The user configurations to be merged with the generated configurations.
 * @returns {Promise<FlatConfigItem[]>} The merged ESLint configurations.
 */
export function rsEslint(
  options: OptionsConfig & FlatConfigItem = {},
  ...userConfigs: ReadonlyArray<Awaitable<FlatConfigItem | FlatConfigItem[]>>
): FlatConfigPipeline<FlatConfigItem> {
  const {
    autoRenamePlugins = true,
    componentExts = [],
    isInEditor = !Boolean(process.env["CI"]) &&
      (Boolean(process.env["VSCODE_PID"]) ||
        Boolean(process.env["VSCODE_CWD"]) ||
        Boolean(process.env["JETBRAINS_IDE"]) ||
        Boolean(process.env["VIM"])),
    ignores: ignoresOptions,
    typescript: typeScriptOptions = isPackageExists("typescript"),
    unocss: unoCSSOptions = isPackageExists("unocss"),
    vue: vueOptions = VuePackages.some((i) => isPackageExists(i)),
    test: testOptions = true,
    jsx: jsxOptions = true,
    functional: functionalOptions = true,
    jsonc: jsoncOptions = true,
    yaml: yamlOptions = true,
    toml: tomlOptions = true,
    markdown: markdownOptions = true,
    formatters: formattersOptions = true,
  } = options;

  const stylisticOptions =
    options.stylistic === false
      ? false
      : typeof options.stylistic === "object"
        ? {
            ...StylisticConfigDefaults,
            ...options.stylistic,
          }
        : StylisticConfigDefaults;

  if (stylisticOptions !== false && !("jsx" in stylisticOptions))
    stylisticOptions.jsx = jsxOptions;

  const functionalEnforcement =
    typeof functionalOptions === "string"
      ? functionalOptions
      : typeof functionalOptions === "object"
        ? functionalOptions.functionalEnforcement ?? "default"
        : "default";

  const configs: Array<Awaitable<FlatConfigItem[]>> = [];

  // Base configs
  configs.push(
    ignores(ignoresOptions),
    javascript({
      isInEditor,
      functionalEnforcement,
      overrides: getOverrides(options, "javascript"),
    }),
    imports({
      stylistic: stylisticOptions,
    }),
    jsdoc({
      stylistic: stylisticOptions,
    }),
    comments(),
    unicorn(),
    node(),
  );

  if (vueOptions !== false) componentExts.push("vue");

  if (typeScriptOptions !== false) {
    configs.push(
      typescript({
        ...resolveSubOptions(options, "typescript"),
        componentExts,
        overrides: getOverrides(options, "typescript"),
      }),
    );
  }

  if (stylisticOptions !== false) {
    configs.push(
      stylistic({
        ...stylisticOptions,
        overrides: getOverrides(options, "stylistic"),
      }),
    );
  }

  if (functionalOptions !== false) {
    configs.push(
      functional({
        ...resolveSubOptions(options, "typescript"),
        ...resolveSubOptions(options, "functional"),
        overrides: getOverrides(options, "functional"),
        functionalEnforcement,
        stylistic: stylisticOptions,
      }),
    );
  }

  if (testOptions !== false) {
    configs.push(
      test({
        isInEditor,
        overrides: getOverrides(options, "test"),
      }),
    );
  }

  if (vueOptions !== false) {
    configs.push(
      vue({
        ...resolveSubOptions(options, "vue"),
        overrides: getOverrides(options, "vue"),
        stylistic: stylisticOptions,
        typescript: Boolean(typeScriptOptions),
      }),
    );
  }

  if (unoCSSOptions !== false) {
    configs.push(
      unocss({
        ...resolveSubOptions(options, "unocss"),
        overrides: getOverrides(options, "unocss"),
      }),
    );
  }

  if (jsoncOptions !== false) {
    configs.push(
      jsonc({
        overrides: getOverrides(options, "jsonc"),
        stylistic: stylisticOptions,
      }),
      sortTsconfig(),
    );
  }

  if (yamlOptions !== false) {
    configs.push(
      yaml({
        overrides: getOverrides(options, "yaml"),
        stylistic: stylisticOptions,
      }),
    );
  }

  if (tomlOptions !== false) {
    configs.push(
      toml({
        overrides: getOverrides(options, "toml"),
        stylistic: stylisticOptions,
      }),
    );
  }

  if (markdownOptions !== false) {
    configs.push(
      markdown({
        componentExts,
        overrides: getOverrides(options, "markdown"),
      }),
    );
  }

  if (formattersOptions !== false) {
    configs.push(
      formatters(
        formattersOptions,
        typeof stylisticOptions === "boolean" ? {} : stylisticOptions,
      ),
    );
  }

  configs.push(overrides());

  let m_pipeline = new FlatConfigPipeline<FlatConfigItem>();

  m_pipeline = m_pipeline.append(...configs, ...userConfigs);

  if (autoRenamePlugins) {
    m_pipeline = m_pipeline.renamePlugins(defaultPluginRenaming);
  }

  return m_pipeline;
}

export type ResolvedOptions<T> = T extends boolean
  ? never
  : T extends string
    ? never
    : NonNullable<T>;

export function resolveSubOptions<K extends keyof OptionsConfig>(
  options: Readonly<OptionsConfig>,
  key: K,
): ResolvedOptions<OptionsConfig[K]> {
  return (
    typeof options[key] === "boolean" || typeof options[key] === "string"
      ? {}
      : options[key] ?? {}
  ) as ResolvedOptions<OptionsConfig[K]>;
}

export function getOverrides<K extends keyof OptionsConfig>(
  options: Readonly<OptionsConfig>,
  key: K,
) {
  const sub = resolveSubOptions(options, key);
  return "overrides" in sub ? sub.overrides : {};
}
