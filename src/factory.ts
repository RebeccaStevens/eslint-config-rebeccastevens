import { FlatConfigComposer } from "eslint-flat-config-utils";
import { isPackageExists } from "local-pkg";

import {
  StylisticConfigDefaults,
  comments,
  defaultFilesTypesAware,
  formatters,
  functional,
  ignores,
  imports,
  inEditor,
  javascript,
  jsdoc,
  jsonc,
  markdown,
  node,
  overrides,
  promise,
  regexp,
  sonar,
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
  GLOB_JSON,
  GLOB_JSON5,
  GLOB_JSONC,
  GLOB_MARKDOWN,
  GLOB_SRC,
  GLOB_TESTS,
  GLOB_TOML,
  GLOB_VUE,
  GLOB_YAML,
} from "./globs";
import {
  type Awaitable,
  type FlatConfigItem,
  type OptionsConfig,
  type OptionsTypeScriptParserOptions,
} from "./types";

const VuePackages = ["vue", "nuxt", "vitepress", "@slidev/cli"];

export const defaultPluginRenaming = {
  "@intlify/vue-i18n": "vue-i18n",
  "@stylistic": "style",
  "@typescript-eslint": "ts",
  "import-x": "import",
  n: "node",
  "optimize-regex": "regexp",
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
  options: OptionsConfig,
  ...userConfigs: ReadonlyArray<Awaitable<FlatConfigItem | FlatConfigItem[]>>
): FlatConfigComposer<FlatConfigItem> {
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
    jsonc: jsoncOptions = false,
    yaml: yamlOptions = false,
    toml: tomlOptions = false,
    markdown: markdownOptions = false,
    formatters: formattersOptions = true,
    mode = "none",
  } = options;

  const stylisticOptions =
    options.stylistic === false
      ? false
      : typeof options.stylistic === "object"
        ? {
            ...StylisticConfigDefaults,
            jsx: jsxOptions,
            ...options.stylistic,
          }
        : StylisticConfigDefaults;

  const functionalEnforcement =
    typeof functionalOptions === "string"
      ? functionalOptions
      : typeof functionalOptions === "object"
        ? functionalOptions.functionalEnforcement ?? "recommended"
        : "recommended";

  const hasTypeScript = Boolean(typeScriptOptions);

  const typeScriptSubOptions = resolveSubOptions(options, "typescript");
  const typescriptConfigOptions: Required<OptionsTypeScriptParserOptions> = {
    filesTypeAware:
      "filesTypeAware" in typeScriptSubOptions
        ? typeScriptSubOptions.filesTypeAware
        : defaultFilesTypesAware,
    parserOptions: {
      project:
        "tsconfig" in typeScriptSubOptions
          ? typeScriptSubOptions.tsconfig
          : null,
      ...("parserOptions" in typeScriptSubOptions
        ? typeScriptSubOptions.parserOptions
        : {}),
    },
  };

  const functionalConfigOptions = {
    functionalEnforcement,
    ignoreNamePattern: ["^mutable", "^[mM]_"],
    ...resolveSubOptions(options, "functional"),
  };

  const configs: Array<Awaitable<FlatConfigItem[]>> = [];

  // Base configs
  configs.push(
    ignores({
      ignores: ignoresOptions ?? [],
    }),
    javascript({
      ...functionalConfigOptions,
      overrides: getOverrides(options, "javascript"),
    }),
    imports({
      ...typescriptConfigOptions,
      stylistic: stylisticOptions,
    }),
    jsdoc({
      stylistic: stylisticOptions,
    }),
    promise(),
    regexp(),
    sonar(functionalConfigOptions),
    comments(),
    unicorn(),
    node(),
  );

  if (vueOptions !== false) {
    componentExts.push("vue");
  }

  if (typeScriptOptions !== false) {
    configs.push(
      typescript({
        files: [GLOB_SRC, ...componentExts.map((ext) => `**/*.${ext}`)],
        unsafe: "warn",
        ...typescriptConfigOptions,
        ...functionalConfigOptions,
        componentExts,
        overrides: getOverrides(options, "typescript"),
      }),
    );
  }

  if (stylisticOptions !== false) {
    configs.push(
      stylistic({
        stylistic: stylisticOptions,
        typescript: hasTypeScript,
        overrides: getOverrides(options, "stylistic"),
      }),
    );
  }

  if (functionalOptions !== false) {
    configs.push(
      functional({
        ...typescriptConfigOptions,
        ...functionalConfigOptions,
        overrides: getOverrides(options, "functional"),
        stylistic: stylisticOptions,
        mode,
      }),
    );
  }

  if (testOptions !== false) {
    configs.push(
      test({
        files: GLOB_TESTS,
        overrides: getOverrides(options, "test"),
      }),
    );
  }

  if (vueOptions !== false) {
    configs.push(
      vue({
        files: [GLOB_VUE],
        i18n: false,
        vueVersion: 3,
        sfcBlocks: true,
        ...resolveSubOptions(options, "vue"),
        overrides: getOverrides(options, "vue"),
        stylistic: stylisticOptions,
        typescript: hasTypeScript,
      }),
    );
  }

  if (unoCSSOptions !== false) {
    configs.push(
      unocss({
        attributify: true,
        strict: true,
        ...resolveSubOptions(options, "unocss"),
        overrides: getOverrides(options, "unocss"),
      }),
    );
  }

  if (jsoncOptions !== false) {
    configs.push(
      jsonc({
        files: [GLOB_JSON, GLOB_JSON5, GLOB_JSONC],
        overrides: getOverrides(options, "jsonc"),
        stylistic: stylisticOptions,
      }),
      sortTsconfig(),
    );
  }

  if (yamlOptions !== false) {
    configs.push(
      yaml({
        files: [GLOB_YAML],
        overrides: getOverrides(options, "yaml"),
        stylistic: stylisticOptions,
      }),
    );
  }

  if (tomlOptions !== false) {
    configs.push(
      toml({
        files: [GLOB_TOML],
        overrides: getOverrides(options, "toml"),
        stylistic: stylisticOptions,
      }),
    );
  }

  if (markdownOptions !== false) {
    configs.push(
      markdown({
        files: [GLOB_MARKDOWN],
        componentExts,
        overrides: getOverrides(options, "markdown"),
      }),
    );
  }

  if (formattersOptions !== false) {
    configs.push(
      formatters(
        formattersOptions,
        stylisticOptions === false ? {} : stylisticOptions,
      ),
    );
  }

  if (isInEditor) {
    configs.push(inEditor());
  }

  configs.push(overrides());

  let m_composer = new FlatConfigComposer<FlatConfigItem>().append(
    ...configs,
    ...userConfigs,
  );

  if (autoRenamePlugins) {
    m_composer = m_composer.renamePlugins(defaultPluginRenaming);
  }

  return m_composer;
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
