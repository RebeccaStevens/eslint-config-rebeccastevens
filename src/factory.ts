import * as path from "node:path";

import type { SharedConfig } from "@typescript-eslint/utils/ts-eslint";
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
  jsx,
  markdown,
  node,
  overrides,
  promise,
  react,
  regexp,
  sonar,
  sortTsconfig,
  stylistic,
  tailwind,
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
  GLOB_ROOT_DTS,
  GLOB_ROOT_JS,
  GLOB_ROOT_JSX,
  GLOB_ROOT_TS,
  GLOB_ROOT_TSX,
  GLOB_SRC,
  GLOB_TESTS,
  GLOB_TOML,
  GLOB_VUE,
  GLOB_YAML,
} from "./globs";
import type { RuleOptions } from "./typegen";
import type {
  Awaitable,
  FlatConfigItem,
  OptionsConfig,
  OptionsTypeScriptParserOptions,
  OptionsTypeScriptShorthands,
  OptionsTypescript,
} from "./types";
import { loadPackages } from "./utils";

const VuePackages = ["vue", "nuxt", "vitepress", "@slidev/cli"];

const ReactPackages = ["react", "next", "remix"];

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
export async function rsEslint(
  options: OptionsConfig,
  ...userConfigs: ReadonlyArray<Awaitable<FlatConfigItem | FlatConfigItem[]>>
): Promise<FlatConfigItem[]> {
  const [FlatConfigComposer] = await loadPackages(["eslint-flat-config-utils"]).then(
    ([a]) => [(a as typeof import("eslint-flat-config-utils")).FlatConfigComposer] as const,
  );

  const {
    autoRenamePlugins = true,
    componentExts = [],
    isInEditor = !Boolean(process.env["CI"]) &&
      (Boolean(process.env["VSCODE_PID"]) ||
        Boolean(process.env["VSCODE_CWD"]) ||
        Boolean(process.env["JETBRAINS_IDE"]) ||
        Boolean(process.env["VIM"]) ||
        Boolean(process.env["NVIM"])),
    ignores: ignoresOptions,
    ignoresFiles: ignoresFilesOptions = [".gitignore"],
    typescript: typeScriptOptions = isPackageExists("typescript"),
    unocss: unoCSSOptions = isPackageExists("unocss"),
    tailwind: tailwindOptions = isPackageExists("tailwindcss"),
    vue: vueOptions = VuePackages.some((i) => isPackageExists(i)),
    react: reactOptions = ReactPackages.some((i) => isPackageExists(i)),
    test: testOptions = true,
    jsx: jsxOptions = true,
    functional: functionalOptions = true,
    jsonc: jsoncOptions = false,
    yaml: yamlOptions = false,
    toml: tomlOptions = false,
    markdown: markdownOptions = false,
    formatters: formattersOptions = true,
    sonar: sonarOptions = true,
    mode,
    projectRoot,
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
        ? (functionalOptions.functionalEnforcement ?? "recommended")
        : functionalOptions
          ? "recommended"
          : "none";

  const hasTypeScript = Boolean(typeScriptOptions);

  const { filesTypeAware, parserOptions, useDefaultDefaultProject, ...typeScriptSubOptions } = resolveSubOptions(
    options,
    "typescript",
  ) as OptionsTypescript & OptionsTypeScriptParserOptions & OptionsTypeScriptShorthands;

  const projectServiceUserConfig = {
    defaultProject: "./tsconfig.json",
    ...(typeof parserOptions?.projectService === "object" ? parserOptions.projectService : undefined),
  };

  const typescriptConfigOptions: Required<OptionsTypeScriptParserOptions> = {
    ...typeScriptSubOptions,
    filesTypeAware: filesTypeAware ?? defaultFilesTypesAware,
    parserOptions: {
      tsconfigRootDir: projectRoot,
      ...parserOptions,
      projectService:
        parserOptions?.projectService === false
          ? false
          : useDefaultDefaultProject === false
            ? projectServiceUserConfig
            : {
                allowDefaultProject: [
                  path.join(projectRoot, GLOB_ROOT_JS),
                  path.join(projectRoot, GLOB_ROOT_JSX),
                  path.join(projectRoot, GLOB_ROOT_TS),
                  path.join(projectRoot, GLOB_ROOT_TSX),
                  path.join(projectRoot, GLOB_ROOT_DTS),
                ],
                ...projectServiceUserConfig,
              },
    },
  };

  const functionalConfigOptions = {
    functionalEnforcement,
    ignoreNamePattern: ["^[mM]ut_"],
    ...resolveSubOptions(options, "functional"),
  };

  const mut_configs: Array<Awaitable<FlatConfigItem[]>> = [];

  // Base configs
  mut_configs.push(
    ignores({
      projectRoot,
      ignores: ignoresOptions ?? [],
      ignoreFiles: ignoresFilesOptions,
    }),
    javascript({
      ...functionalConfigOptions,
      overrides: getOverrides(options, "javascript"),
    }),
    imports({
      ...typescriptConfigOptions,
      stylistic: stylisticOptions,
      typescript: hasTypeScript,
      mode,
    }),
    jsdoc({
      stylistic: stylisticOptions,
    }),
    promise(),
    regexp(),
    comments(),
    unicorn(),
    node(),
  );

  if (vueOptions !== false) {
    componentExts.push("vue");
  }

  if (sonarOptions) {
    mut_configs.push(sonar(functionalConfigOptions));
  }

  if (jsxOptions) {
    mut_configs.push(jsx());
  }

  if (typeScriptOptions !== false) {
    mut_configs.push(
      typescript({
        projectRoot,
        mode,
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
    mut_configs.push(
      stylistic({
        stylistic: stylisticOptions,
        typescript: hasTypeScript,
        overrides: getOverrides(options, "stylistic"),
      }),
    );
  }

  if (functionalEnforcement !== "none" || mode === "library") {
    mut_configs.push(
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
    mut_configs.push(
      test({
        files: GLOB_TESTS,
        overrides: getOverrides(options, "test"),
      }),
    );
  }

  if (vueOptions !== false) {
    mut_configs.push(
      vue({
        ...typescriptConfigOptions,
        typescript: hasTypeScript,
        files: [GLOB_VUE],
        i18n: false,
        vueVersion: 3,
        sfcBlocks: true,
        ...resolveSubOptions(options, "vue"),
        overrides: getOverrides(options, "vue"),
        stylistic: stylisticOptions,
      }),
    );
  }

  if (reactOptions !== false) {
    mut_configs.push(
      react({
        ...typescriptConfigOptions,
        typescript: hasTypeScript,
        files: [GLOB_SRC],
        i18n: false,
        ...resolveSubOptions(options, "react"),
        overrides: getOverrides(options, "react"),
      }),
    );
  }

  if (tailwindOptions !== false) {
    mut_configs.push(
      tailwind({
        stylistic: stylisticOptions,
        tailwindVersion: (tailwindOptions === true ? undefined : tailwindOptions.tailwindVersion) ?? 4,
        overrides: getOverrides(options, "tailwind"),
      }),
    );
  }

  if (unoCSSOptions !== false) {
    mut_configs.push(
      unocss({
        attributify: true,
        strict: true,
        ...resolveSubOptions(options, "unocss"),
        overrides: getOverrides(options, "unocss"),
      }),
    );
  }

  if (jsoncOptions !== false) {
    mut_configs.push(
      jsonc({
        files: [GLOB_JSON, GLOB_JSON5, GLOB_JSONC],
        overrides: getOverrides(options, "jsonc"),
        stylistic: stylisticOptions,
      }),
      sortTsconfig(),
    );
  }

  if (yamlOptions !== false) {
    mut_configs.push(
      yaml({
        files: [GLOB_YAML],
        overrides: getOverrides(options, "yaml"),
        stylistic: stylisticOptions,
      }),
    );
  }

  if (tomlOptions !== false) {
    mut_configs.push(
      toml({
        files: [GLOB_TOML],
        overrides: getOverrides(options, "toml"),
        stylistic: stylisticOptions,
      }),
    );
  }

  if (markdownOptions !== false) {
    mut_configs.push(
      markdown({
        enableTypeRequiredRules: !(markdownOptions === true || markdownOptions.enableTypeRequiredRules === false),
        files: [GLOB_MARKDOWN],
        componentExts,
        overrides: getOverrides(options, "markdown"),
      }),
    );
  }

  if (formattersOptions !== false) {
    mut_configs.push(formatters(formattersOptions, stylisticOptions === false ? {} : stylisticOptions));
  }

  if (isInEditor) {
    mut_configs.push(inEditor());
  }

  mut_configs.push(overrides());

  let mut_composer = new FlatConfigComposer<FlatConfigItem>().append(...mut_configs, ...userConfigs);

  if (autoRenamePlugins) {
    mut_composer = mut_composer.renamePlugins(defaultPluginRenaming);
  }

  return mut_composer.toConfigs();
}

export type ResolvedOptions<T> = T extends boolean ? never : T extends string ? never : NonNullable<T>;

export function resolveSubOptions<K extends keyof OptionsConfig>(
  options: Readonly<OptionsConfig>,
  key: K,
): ResolvedOptions<OptionsConfig[K]> {
  return (
    typeof options[key] === "boolean" || typeof options[key] === "string" ? {} : (options[key] ?? {})
  ) as ResolvedOptions<OptionsConfig[K]>;
}

export function getOverrides<K extends keyof OptionsConfig>(
  options: Readonly<OptionsConfig>,
  key: K,
): (Partial<Record<string, SharedConfig.RuleEntry>> & RuleOptions) | undefined {
  const sub = resolveSubOptions(options, key);
  return "overrides" in sub ? sub.overrides : {};
}
