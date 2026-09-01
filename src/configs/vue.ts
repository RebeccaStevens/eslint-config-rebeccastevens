import type { ESLint, Linter } from "eslint";
import { isPackageExists } from "local-pkg";

import { GLOB_SRC_EXT } from "../globs";
import type {
  FlatConfigItem,
  OptionsFiles,
  OptionsHasTypeScript,
  OptionsOverrides,
  OptionsTypeScriptParserOptions,
  OptionsVue,
  RequiredOptionsStylistic,
} from "../types";
import { interopDefault, loadPackages } from "../utils";

import { StylisticConfigDefaults } from "./stylistic";

type PluginVueImported = typeof import("eslint-plugin-vue");

type PluginVue = ESLint.Plugin &
  Omit<PluginVueImported, "processors"> & {
    processors: Record<keyof PluginVueImported["processors"], Linter.Processor>;
  };

const NuxtPackages = ["nuxt"];

/**
 * Full Vue 3 support via `eslint-plugin-vue`, `vue-eslint-parser`, and
 * `eslint-processor-vue-blocks`.
 *
 * Configures SFC block processing (virtual files for styles when `sfcBlocks`
 * enabled), registers the plugin as `vue`, and applies recommended rules per
 * `vueVersion` (2 or 3). Auto-detects Nuxt to relax import rules and
 * multi-word component names for pages/layouts. Supports Vue i18n via
 * `@intlify/eslint-plugin-vue-i18n` when `i18n` is set. Respects `stylistic`
 * for formatting rules and wires the TypeScript parser when `typescript` is
 * enabled.
 *
 * @param options - Options with files, i18n, overrides, parserOptions, stylistic, typescript, vueVersion, and sfcBlocks
 * @returns Flat config items enabling Vue, Nuxt, and vue-i18n rules
 */
export async function vue(
  options: Readonly<
    Required<
      OptionsVue &
        OptionsFiles &
        OptionsHasTypeScript &
        OptionsOverrides &
        OptionsTypeScriptParserOptions &
        RequiredOptionsStylistic
    >
  >,
): Promise<FlatConfigItem[]> {
  const { files, i18n, overrides, parserOptions, stylistic, typescript, vueVersion } = options;

  const sfcBlocks = options.sfcBlocks === true ? {} : options.sfcBlocks;

  const { indent = StylisticConfigDefaults.indent } = typeof stylistic === "boolean" ? {} : stylistic;

  const isUsingNuxt = NuxtPackages.some((index) => isPackageExists(index));

  const [pluginVue, pluginVueI18n, parserVue, processorVueBlocks, { mergeProcessors }] = (await loadPackages([
    "eslint-plugin-vue",
    "@intlify/eslint-plugin-vue-i18n",
    "vue-eslint-parser",
    "eslint-processor-vue-blocks",
    "eslint-merge-processors",
  ])) as [
    PluginVue,
    ESLint.Plugin & typeof import("@intlify/eslint-plugin-vue-i18n"),
    typeof import("vue-eslint-parser"),
    (typeof import("eslint-processor-vue-blocks"))["default"],
    typeof import("eslint-merge-processors"),
  ];

  const parserTs = typescript ? await interopDefault(import("@typescript-eslint/parser")) : undefined;

  const stylisticEnforcement = stylistic === false ? "off" : "error";

  return [
    {
      name: "rs:vue:setup",
      languageOptions: {
        globals: {
          computed: "readonly",
          defineEmits: "readonly",
          defineExpose: "readonly",
          defineProps: "readonly",
          onMounted: "readonly",
          onUnmounted: "readonly",
          reactive: "readonly",
          ref: "readonly",
          shallowReactive: "readonly",
          shallowRef: "readonly",
          toRef: "readonly",
          toRefs: "readonly",
          watch: "readonly",
          watchEffect: "readonly",
        },
      },
      plugins:
        i18n === false
          ? {
              vue: pluginVue,
            }
          : {
              vue: pluginVue,
              "@intlify/vue-i18n": pluginVueI18n,
            },
    },

    {
      name: "rs:vue:rules",
      files,
      languageOptions: {
        parser: parserVue,
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          extraFileExtensions: [".vue"],
          parser: typescript ? parserTs : null,
          ...(typescript && parserOptions),
          sourceType: "module",
        },
      },
      processor:
        sfcBlocks === false
          ? pluginVue.processors[".vue"]
          : mergeProcessors([
              pluginVue.processors[".vue"],
              processorVueBlocks({
                ...sfcBlocks,
                blocks: {
                  styles: true,
                  ...sfcBlocks.blocks,
                },
              }),
            ]),

      settings:
        i18n === false
          ? {}
          : {
              "@intlify/vue-i18n": i18n,
            },
      rules: {
        ...pluginVue.configs.base.rules,

        ...pluginVue.configs[vueVersion === 2 ? "flat/vue2-recommended" : "flat/recommended"]
          .map((config) => config.rules ?? {})
          .reduce((accumulator, rules) => Object.assign(accumulator, rules), {}),

        "n/prefer-global/process": "off",
        "vue/block-order": [
          "error",
          {
            order: ["script", "template", "style"],
          },
        ],

        "vue/component-name-in-template-casing": ["error", "PascalCase"],
        "vue/component-options-name-casing": ["error", "PascalCase"],
        "vue/custom-event-name-casing": ["error", "camelCase"],
        "vue/define-macros-order": [
          "error",
          {
            order: ["defineOptions", "defineProps", "defineEmits", "defineSlots"],
          },
        ],
        "vue/dot-location": ["error", "property"],
        "vue/dot-notation": ["error", { allowKeywords: true }],
        "vue/eqeqeq": ["error", "smart"],
        "vue/html-indent": ["error", indent, { baseIndent: 1 }],
        "vue/html-quotes": ["error", "double"],
        // "vue/max-attributes-per-line": "off",
        "vue/multi-word-component-names": "error",
        // "vue/no-dupe-keys": "off",
        "vue/no-empty-pattern": "error",
        "vue/no-irregular-whitespace": "error",
        "vue/no-loss-of-precision": "error",
        "vue/no-restricted-syntax": ["error", "DebuggerStatement", "LabeledStatement", "WithStatement"],
        "vue/no-restricted-v-bind": ["error", "/^v-/"],
        // "vue/no-setup-props-reactivity-loss": "off",
        "vue/no-sparse-arrays": "error",
        "vue/no-unused-refs": "error",
        "vue/no-useless-v-bind": "error",
        // "vue/no-v-html": "off",
        "vue/object-shorthand": [
          "error",
          "always",
          {
            avoidQuotes: true,
            ignoreConstructors: false,
          },
        ],
        "vue/prefer-separate-static-class": "error",
        "vue/prefer-template": "error",
        "vue/prop-name-casing": ["error", "camelCase"],
        // "vue/require-default-prop": "off",
        // "vue/require-prop-types": "off",
        "vue/space-infix-ops": "error",
        "vue/space-unary-ops": ["error", { nonwords: false, words: true }],

        ...(i18n === false
          ? {}
          : {
              "@intlify/vue-i18n/no-html-messages": "error",
              "@intlify/vue-i18n/no-missing-keys": "error",
              "@intlify/vue-i18n/no-raw-text": "warn",
              "@intlify/vue-i18n/no-v-html": "error",
              "@intlify/vue-i18n/no-deprecated-i18n-component": "error",
              "@intlify/vue-i18n/no-deprecated-i18n-place-attr": "error",
              "@intlify/vue-i18n/no-deprecated-i18n-places-prop": "error",
              "@intlify/vue-i18n/no-deprecated-modulo-syntax": "error",
              "@intlify/vue-i18n/no-deprecated-tc": "error",
              "@intlify/vue-i18n/no-deprecated-v-t": "error",
              "@intlify/vue-i18n/no-i18n-t-path-prop": "error",
              "@intlify/vue-i18n/valid-message-syntax": "error",
              "@intlify/vue-i18n/prefer-linked-key-with-paren": "error",
              "@intlify/vue-i18n/key-format-style": ["error", "kebab-case"],
              "@intlify/vue-i18n/no-dynamic-keys": "error",
              "@intlify/vue-i18n/no-unknown-locale": "error",
              // "@intlify/vue-i18n/no-missing-keys-in-other-locales": "error",
              // "@intlify/vue-i18n/no-unused-keys": "error",
              // "@intlify/vue-i18n/prefer-sfc-lang-attr": "error",
              // "@intlify/vue-i18n/no-duplicate-keys-in-locale": "error",
              // "@intlify/vue-i18n/sfc-locale-attr": "error",
            }),

        "vue/array-bracket-spacing": [stylisticEnforcement, "never"],
        "vue/arrow-spacing": [stylisticEnforcement, { after: true, before: true }],
        "vue/block-spacing": [stylisticEnforcement, "always"],
        "vue/block-tag-newline": [
          stylisticEnforcement,
          {
            multiline: "always",
            singleline: "always",
          },
        ],
        "vue/brace-style": [
          stylisticEnforcement,
          // cspell:disable-next-line
          "stroustrup",
          { allowSingleLine: true },
        ],
        "vue/comma-dangle": [
          stylisticEnforcement,
          {
            arrays: "only-multiline",
            exports: "only-multiline",
            functions: "ignore",
            imports: "only-multiline",
            objects: "only-multiline",

            ...(typescript && {
              enums: "only-multiline",
              generics: "only-multiline",
              tuples: "only-multiline",
            }),
          },
        ],
        "vue/comma-spacing": [stylisticEnforcement, { after: true, before: false }],
        "vue/comma-style": [stylisticEnforcement, "last"],
        "vue/html-comment-content-spacing": [
          stylisticEnforcement,
          "always",
          {
            exceptions: ["-"],
          },
        ],
        "vue/key-spacing": [stylisticEnforcement, { afterColon: true, beforeColon: false }],
        "vue/keyword-spacing": [stylisticEnforcement, { after: true, before: true }],
        // "vue/object-curly-newline": "off",
        "vue/object-curly-spacing": [stylisticEnforcement, "always"],
        "vue/object-property-newline": [stylisticEnforcement, { allowAllPropertiesOnSameLine: true }],
        "vue/operator-linebreak": [
          stylisticEnforcement,
          "after",
          {
            overrides: {
              "==": "none",
              "===": "none",
              "?": "before",
              ":": "before",
              "|": "before",
            },
          },
        ],
        "vue/padding-line-between-blocks": [stylisticEnforcement, "always"],
        "vue/quote-props": [stylisticEnforcement, "consistent-as-needed"],
        "vue/space-in-parens": [stylisticEnforcement, "never"],
        "vue/template-curly-spacing": stylisticEnforcement,

        ...overrides,
      },
    },

    ...((isUsingNuxt
      ? [
          {
            name: "rs:nuxt:rules:off",
            files,
            rules: {
              "import-x/default": "off",
              "import-x/named": "off",
              "import-x/namespace": "off",
              "import-x/no-unresolved": "off",
            },
          },
          {
            name: "rs:nuxt:rules",
            files: [
              // These pages are not used directly by users so they can have one-word names.
              `**/pages/**/*.{${GLOB_SRC_EXT},vue}`,
              `**/layouts/**/*.{${GLOB_SRC_EXT},vue}`,
              `**/app.{${GLOB_SRC_EXT},vue}`,
              `**/error.{${GLOB_SRC_EXT},vue}`,

              // These files shouldn't have multiple words in their names as they are within subdirectories.
              `**/components/*/**/*.{${GLOB_SRC_EXT},vue}`,
            ],
            rules: {
              "vue/multi-word-component-names": "off",
            },
          },
          {
            // Pages and layouts are required to have a single root element if transitions are enabled.
            files: [`**/pages/**/*.{${GLOB_SRC_EXT},vue}`, `**/layouts/**/*.{${GLOB_SRC_EXT},vue}`],
            rules: {
              "vue/no-multiple-template-root": "error",
            },
          },
        ]
      : []) satisfies FlatConfigItem[]),
  ];
}
