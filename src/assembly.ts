import * as fs from "node:fs";
import * as path from "node:path";

import type { SharedConfig } from "@typescript-eslint/utils/ts-eslint";
import { isPackageExists } from "local-pkg";

import {
  StylisticConfigDefaults,
  command,
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
  perfectionist,
  pnpm,
  promise,
  react,
  regexp,
  resolveFormatterCategories,
  security,
  sonar,
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
  GLOB_DTS,
  GLOB_JS,
  GLOB_JSON,
  GLOB_JSON5,
  GLOB_JSONC,
  GLOB_JSX,
  GLOB_MARKDOWN,
  GLOB_MARKDOWN_CODE,
  GLOB_ROOT_DTS,
  GLOB_ROOT_JS,
  GLOB_ROOT_JSX,
  GLOB_ROOT_TS,
  GLOB_ROOT_TSX,
  GLOB_SRC,
  GLOB_TESTS,
  GLOB_TOML,
  GLOB_TS,
  GLOB_TSX,
  GLOB_VUE,
  GLOB_YAML,
} from "./globs";
import type { RuleOptions } from "./typegen";
import type {
  Awaitable,
  FlatConfigItem,
  OptionsConfig,
  OptionsTailwindCSS,
  OptionsTypeScriptParserOptions,
  OptionsTypeScriptShorthands,
  OptionsTypescript,
} from "./types";

const VuePackages = ["vue", "nuxt", "vitepress", "@slidev/cli"];

const ReactPackages = ["react", "next", "remix", "react-router"];

/**
 * Resolves `OptionsConfig` values to non-boolean/non-string types (unwraps `boolean | T` to `T`).
 */
export type ResolvedOptions<T> = T extends boolean ? never : T extends string ? never : NonNullable<T>;

/**
 * Extracts sub-options for a feature key from the top-level config.
 *
 * Returns `{}` when the value is a boolean or string (shorthand), or the inner object when an object is passed.
 *
 * @param options - The top-level config options.
 * @param key - The feature key to extract sub-options for.
 * @returns The resolved sub-options object.
 */
export function resolveSubOptions<K extends keyof OptionsConfig>(
  options: Readonly<OptionsConfig>,
  key: K,
): ResolvedOptions<OptionsConfig[K]> {
  return (
    typeof options[key] === "boolean" || typeof options[key] === "string" ? {} : (options[key] ?? {})
  ) as ResolvedOptions<OptionsConfig[K]>;
}

/**
 * Extracts `overrides` from sub-options for a given feature key.
 *
 * Returns `undefined` when the feature is disabled or has no overrides.
 *
 * @param options - The top-level config options.
 * @param key - The feature key to extract overrides for.
 * @returns The user-provided rule overrides, or `undefined`.
 */
export function getOverrides<K extends keyof OptionsConfig>(
  options: Readonly<OptionsConfig>,
  key: K,
): (Partial<Record<string, SharedConfig.RuleEntry>> & RuleOptions) | undefined {
  const sub = resolveSubOptions(options, key);
  return typeof sub === "object" && "overrides" in sub
    ? (sub.overrides as (Partial<Record<string, SharedConfig.RuleEntry>> & RuleOptions) | undefined)
    : undefined;
}

/**
 * Resolve Tailwind options into a flat, concrete config object.
 * Returns `false` when Tailwind is disabled.
 *
 * @param opts - Options for Tailwind CSS
 * @returns An object containing the resolved tailwind configuration, or false if tailwind is disabled
 */
function resolveTailwindConfig(opts: boolean | OptionsTailwindCSS):
  | false
  | {
      tailwindVersion: 3 | 4;
      tailwindConfig: string | undefined;
      tailwindEntryPoint: string | undefined;
    } {
  if (opts === false) {
    return false;
  }

  if (opts === true) {
    return { tailwindVersion: 3, tailwindConfig: "tailwind.config.js", tailwindEntryPoint: undefined };
  }

  // Determine version from explicit setting or infer from which property is present
  const tailwindVersion: 3 | 4 = opts.tailwindVersion ?? ("tailwindEntryPoint" in opts ? 4 : 3);

  if (tailwindVersion === 4) {
    return {
      tailwindVersion: 4,
      tailwindConfig: undefined,
      tailwindEntryPoint: "tailwindEntryPoint" in opts ? opts.tailwindEntryPoint : undefined,
    };
  }

  return {
    tailwindVersion: 3,
    tailwindConfig: "tailwindConfig" in opts ? (opts.tailwindConfig ?? "tailwind.config.js") : "tailwind.config.js",
    tailwindEntryPoint: undefined,
  };
}

/**
 * Core composition — builds base configs + feature configs from resolved options.
 *
 * @param options - The top-level config options.
 * @returns An array of `Awaitable<FlatConfigItem[]>` consumed by the factory.
 */
export function assembleConfigs(options: OptionsConfig): Array<Awaitable<FlatConfigItem[]>> {
  const { projectRoot } = options;

  const {
    componentExts: componentExtensions = [],
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
    vue: vueOptions = VuePackages.some((index) => isPackageExists(index)),
    react: reactOptions = ReactPackages.some((index) => isPackageExists(index)),
    test: testOptions = isPackageExists("vitest"),
    jsx: jsxOptions = true,
    functional: functionalOptions = true,
    json: jsonOptions = false,
    yaml: yamlOptions = false,
    toml: tomlOptions = false,
    markdown: markdownOptions = false,
    formatters: formattersOptions = true,
    sonar: sonarOptions = true,
    command: commandOptions = true,
    security: securityOptions = true,
    perfectionist: perfectionistOptions = false,
    // eslint-disable-next-line node/no-sync
    pnpm: pnpmOptions = fs.existsSync(path.join(projectRoot, "pnpm-lock.yaml")),
    renamePlugins = true,
    mode,
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

  const securitySeverity =
    typeof securityOptions === "string"
      ? securityOptions
      : typeof securityOptions === "object"
        ? (securityOptions.severity ?? "moderate")
        : securityOptions
          ? "moderate"
          : "none";

  const hasTypeScript = Boolean(typeScriptOptions);

  const { filesTypeAware, parserOptions, useDefaultDefaultProject, ...typeScriptSubOptions } = resolveSubOptions(
    options,
    "typescript",
  ) as OptionsTypescript & OptionsTypeScriptParserOptions & OptionsTypeScriptShorthands;

  const projectServiceUserConfig = {
    defaultProject: "./tsconfig.json",
    ...(typeof parserOptions?.projectService === "object" && parserOptions.projectService),
  };

  const hasMarkdownTypeRequiredRules =
    markdownOptions !== false && markdownOptions !== true && markdownOptions.enableTypeRequiredRules === true;

  const resolvedFilesTypeAware = [
    ...(filesTypeAware ?? defaultFilesTypesAware),
    ...(hasMarkdownTypeRequiredRules ? [GLOB_MARKDOWN_CODE] : []),
  ];

  const typescriptConfigOptions: Required<OptionsTypeScriptParserOptions> = {
    ...typeScriptSubOptions,
    filesTypeAware: resolvedFilesTypeAware,
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

  const baseConfigs: ReadonlyArray<Awaitable<FlatConfigItem[]>> = [
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
    unicorn({ projectRoot }),
    node({ projectRoot, securitySeverity }),
  ];

  if (vueOptions !== false) {
    componentExtensions.push("vue");
  }

  const resolvedTailwind = resolveTailwindConfig(tailwindOptions);

  // Resolve the formatter categories once (item 13): the same resolution is
  // consumed by `formatters()` below and by the stylistic item, which needs
  // the resolved js/ts backends to decide suppression.
  const formatterResolution =
    formattersOptions === false
      ? undefined
      : resolveFormatterCategories(formattersOptions, stylisticOptions === false ? {} : stylisticOptions);
  const featureConfigs: ReadonlyArray<Awaitable<FlatConfigItem[]>> = [
    ...(sonarOptions ? [sonar({ ...functionalConfigOptions, securitySeverity })] : []),
    ...(commandOptions ? [command()] : []),
    ...(securitySeverity === "none"
      ? []
      : [
          security({
            severity: securitySeverity,
            ...resolveSubOptions(options, "security"),
            overrides: getOverrides(options, "security"),
          }),
        ]),
    ...(perfectionistOptions === false ? [] : [perfectionist({ overrides: getOverrides(options, "perfectionist") })]),
    ...(pnpmOptions === false
      ? []
      : [
          pnpm({
            projectRoot,
            ...resolveSubOptions(options, "pnpm"),
            overrides: getOverrides(options, "pnpm"),
          }),
        ]),
    ...(jsxOptions ? [jsx()] : []),
    ...(typeScriptOptions === false
      ? []
      : [
          typescript({
            projectRoot,
            mode,
            renamePlugins,
            files: [GLOB_SRC, ...componentExtensions.map((extension) => `**/*.${extension}`)],
            unsafe: "warn",
            ...typescriptConfigOptions,
            ...functionalConfigOptions,
            componentExts: componentExtensions,
            overrides: getOverrides(options, "typescript"),
          }),
        ]),
    ...(stylisticOptions === false
      ? []
      : [
          (async (): Promise<FlatConfigItem[]> => {
            // When the `"eslint"` formatter backend owns BOTH js and ts, its
            // later-wins blocks already shadow every rule the stylistic item
            // would set on JS/TS files. `stylistic()` emits one merged item
            // (no `files` restriction), so instead of dropping it — which
            // would strand vue SFCs and markdown code blocks that the backend
            // blocks never cover — restrict it to everything except the files
            // the backend owns. Declaration files are kept covered when the
            // backend's ts block skips them (`formatters.dts` unset).
            let mut_suppressionIgnores: string[] | undefined;
            if (formatterResolution !== undefined) {
              const { categories, options: formatterOptions } = formatterResolution;

              if (
                categories.js.enabled &&
                categories.js.formatter === "eslint" &&
                categories.ts.enabled &&
                categories.ts.formatter === "eslint"
              ) {
                mut_suppressionIgnores = [
                  GLOB_JS,
                  GLOB_JSX,
                  GLOB_TS,
                  GLOB_TSX,

                  ...(formatterOptions.dts === true ? [] : [`!${GLOB_DTS}`]),
                ];
              }
            }

            const items = await stylistic({
              stylistic: stylisticOptions,
              typescript: hasTypeScript,
              overrides: getOverrides(options, "stylistic"),
            });

            return items.map((item) =>
              mut_suppressionIgnores === undefined ? item : { ...item, ignores: mut_suppressionIgnores },
            );
          })(),
        ]),
    ...(functionalEnforcement !== "none" || mode === "library"
      ? [
          functional({
            ...typescriptConfigOptions,
            ...functionalConfigOptions,
            overrides: getOverrides(options, "functional"),
            stylistic: stylisticOptions,
            mode,
          }),
        ]
      : []),
    ...(testOptions === false
      ? []
      : [
          test({
            files: GLOB_TESTS,
            overrides: getOverrides(options, "test"),
          }),
        ]),
    ...(vueOptions === false
      ? []
      : [
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
        ]),
    ...(reactOptions === false
      ? []
      : [
          react({
            ...typescriptConfigOptions,
            typescript: hasTypeScript,
            files: [GLOB_SRC],
            i18n: false,
            securitySeverity,
            ...resolveSubOptions(options, "react"),
            overrides: getOverrides(options, "react"),
          }),
        ]),
    ...(resolvedTailwind === false
      ? []
      : [
          tailwind({
            stylistic: stylisticOptions,
            ...resolvedTailwind,
            overrides: getOverrides(options, "tailwind"),
          }),
        ]),
    ...(unoCSSOptions === false
      ? []
      : [
          unocss({
            attributify: true,
            strict: true,
            ...resolveSubOptions(options, "unocss"),
            overrides: getOverrides(options, "unocss"),
          }),
        ]),
    ...(jsonOptions === false
      ? []
      : [
          jsonc({
            files: [GLOB_JSON, GLOB_JSON5, GLOB_JSONC],
            overrides: getOverrides(options, "json"),
            stylistic: stylisticOptions,
            typescript: hasTypeScript,
          }),
        ]),
    ...(yamlOptions === false
      ? []
      : [
          yaml({
            files: [GLOB_YAML],
            overrides: getOverrides(options, "yaml"),
            stylistic: stylisticOptions,
          }),
        ]),
    ...(tomlOptions === false
      ? []
      : [
          toml({
            files: [GLOB_TOML],
            overrides: getOverrides(options, "toml"),
            stylistic: stylisticOptions,
          }),
        ]),
    ...(markdownOptions === false
      ? []
      : [
          markdown({
            enableTypeRequiredRules: !(markdownOptions === true || markdownOptions.enableTypeRequiredRules === false),
            files: [GLOB_MARKDOWN],
            filesTypeAware: typescriptConfigOptions.filesTypeAware,
            componentExts: componentExtensions,
            overrides: getOverrides(options, "markdown"),
          }),
        ]),
    ...(formattersOptions === false || formatterResolution === undefined
      ? []
      : [formatters(formattersOptions, stylisticOptions === false ? {} : stylisticOptions, formatterResolution)]),
    ...(isInEditor ? [inEditor()] : []),
  ];

  return [...baseConfigs, ...featureConfigs, overrides()];
}
