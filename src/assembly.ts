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

const VuePackages = ["vue", "nuxt", "vitepress", "@slidev/cli"];

const ReactPackages = ["react", "next", "remix"];

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

export function assembleConfigs(options: OptionsConfig): Array<Awaitable<FlatConfigItem[]>> {
  const {
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
    comments(),
    unicorn(),
    node(),
  ];

  if (vueOptions !== false) {
    componentExts.push("vue");
  }

  const features = [
    {
      build: () => (sonarOptions ? [sonar(functionalConfigOptions)] : []),
    },
    {
      build: () => (jsxOptions ? [jsx()] : []),
    },
    {
      build: () =>
        typeScriptOptions === false
          ? []
          : [
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
            ],
    },
    {
      build: () =>
        stylisticOptions === false
          ? []
          : [
              stylistic({
                stylistic: stylisticOptions,
                typescript: hasTypeScript,
                overrides: getOverrides(options, "stylistic"),
              }),
            ],
    },
    {
      build: () =>
        functionalEnforcement !== "none" || mode === "library"
          ? [
              functional({
                ...typescriptConfigOptions,
                ...functionalConfigOptions,
                overrides: getOverrides(options, "functional"),
                stylistic: stylisticOptions,
                mode,
              }),
            ]
          : [],
    },
    {
      build: () =>
        testOptions === false
          ? []
          : [
              test({
                files: GLOB_TESTS,
                overrides: getOverrides(options, "test"),
              }),
            ],
    },
    {
      build: () =>
        vueOptions === false
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
            ],
    },
    {
      build: () =>
        reactOptions === false
          ? []
          : [
              react({
                ...typescriptConfigOptions,
                typescript: hasTypeScript,
                files: [GLOB_SRC],
                i18n: false,
                ...resolveSubOptions(options, "react"),
                overrides: getOverrides(options, "react"),
              }),
            ],
    },
    {
      build: () => {
        if (tailwindOptions === false) {
          return [];
        }
        const tailwindVersion =
          (tailwindOptions === true
            ? undefined
            : (tailwindOptions.tailwindVersion ??
              ("tailwindEntryPoint" in tailwindOptions ? 4 : "tailwindConfig" in tailwindOptions ? 3 : undefined))) ??
          3;

        const tailwindConfig =
          tailwindVersion === 3
            ? ((tailwindOptions === true
                ? undefined
                : "tailwindConfig" in tailwindOptions
                  ? tailwindOptions.tailwindConfig
                  : undefined) ?? "tailwind.config.js")
            : undefined;

        const tailwindEntryPoint =
          tailwindVersion === 4
            ? tailwindOptions === true
              ? undefined
              : "tailwindEntryPoint" in tailwindOptions
                ? tailwindOptions.tailwindEntryPoint
                : undefined
            : undefined;

        return [
          tailwind({
            stylistic: stylisticOptions,
            tailwindVersion,
            tailwindConfig,
            tailwindEntryPoint,
            overrides: getOverrides(options, "tailwind"),
          }),
        ];
      },
    },
    {
      build: () =>
        unoCSSOptions === false
          ? []
          : [
              unocss({
                attributify: true,
                strict: true,
                ...resolveSubOptions(options, "unocss"),
                overrides: getOverrides(options, "unocss"),
              }),
            ],
    },
    {
      build: () =>
        jsoncOptions === false
          ? []
          : [
              jsonc({
                files: [GLOB_JSON, GLOB_JSON5, GLOB_JSONC],
                overrides: getOverrides(options, "jsonc"),
                stylistic: stylisticOptions,
              }),
              sortTsconfig(),
            ],
    },
    {
      build: () =>
        yamlOptions === false
          ? []
          : [
              yaml({
                files: [GLOB_YAML],
                overrides: getOverrides(options, "yaml"),
                stylistic: stylisticOptions,
              }),
            ],
    },
    {
      build: () =>
        tomlOptions === false
          ? []
          : [
              toml({
                files: [GLOB_TOML],
                overrides: getOverrides(options, "toml"),
                stylistic: stylisticOptions,
              }),
            ],
    },
    {
      build: () => {
        if (markdownOptions === false) {
          return [];
        }
        return [
          markdown({
            enableTypeRequiredRules: !(markdownOptions === true || markdownOptions.enableTypeRequiredRules === false),
            files: [GLOB_MARKDOWN],
            componentExts,
            overrides: getOverrides(options, "markdown"),
          }),
        ];
      },
    },
    {
      build: () =>
        formattersOptions === false
          ? []
          : [formatters(formattersOptions, stylisticOptions === false ? {} : stylisticOptions)],
    },
    {
      build: () => (isInEditor ? [inEditor()] : []),
    },
  ] as const satisfies ReadonlyArray<{
    build: () => ReadonlyArray<Awaitable<FlatConfigItem[]>>;
  }>;

  return [...baseConfigs, ...features.flatMap((feature) => feature.build()), overrides()];
}
