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

/* eslint-disable ts/naming-convention */
type PluginVue = ESLint.Plugin & {
  configs: {
    base: Linter.FlatConfig;
    essential: Linter.FlatConfig;
    "strongly-recommended": Linter.FlatConfig;
    recommended: Linter.FlatConfig;
    "vue3-essential": Linter.FlatConfig;
    "vue3-strongly-recommended": Linter.FlatConfig;
    "vue3-recommended": Linter.FlatConfig;
  };
};
/* eslint-enable ts/naming-convention */

const NuxtPackages = ["nuxt"];

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

  const { indent = 2 } = typeof stylistic === "boolean" ? {} : stylistic;

  const isUsingNuxt = NuxtPackages.some((i) => isPackageExists(i));

  const [pluginVue, pluginVueI18n, parserVue, processorVueBlocks, { mergeProcessors }] = (await loadPackages([
    "eslint-plugin-vue",
    "@intlify/eslint-plugin-vue-i18n",
    "vue-eslint-parser",
    "eslint-processor-vue-blocks",
    "eslint-merge-processors",
  ])) as [
    PluginVue,
    ESLint.Plugin,
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
              "vue-i18n": pluginVueI18n,
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
          ...(typescript ? parserOptions : undefined),
          sourceType: "module",
        },
      },
      processor:
        sfcBlocks === false
          ? pluginVue.processors![".vue"]!
          : mergeProcessors([
              pluginVue.processors![".vue"]!,
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
              "vue-i18n": i18n,
            },
      rules: {
        ...pluginVue.configs.base.rules,

        ...(vueVersion === 2
          ? {
              ...pluginVue.configs.essential.rules,
              ...pluginVue.configs["strongly-recommended"].rules,
              ...pluginVue.configs.recommended.rules,
            }
          : {
              ...pluginVue.configs["vue3-essential"].rules,
              ...pluginVue.configs["vue3-strongly-recommended"].rules,
              ...pluginVue.configs["vue3-recommended"].rules,
            }),

        "node/prefer-global/process": "off",
        "vue/block-order": [
          "error",
          {
            order: ["script", "template", "style"],
          },
        ],

        "vue/component-name-in-template-casing": ["error", "PascalCase"],
        "vue/component-options-name-casing": ["error", "PascalCase"],
        "vue/component-tags-order": "off",
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
        "vue/html-indent": ["error", indent],
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

        "vue-i18n/no-html-messages": i18n === false ? "off" : "error",
        "vue-i18n/no-missing-keys": i18n === false ? "off" : "error",
        "vue-i18n/no-raw-text": i18n === false ? "off" : "warn",
        "vue-i18n/no-v-html": i18n === false ? "off" : "error",
        "vue-i18n/no-deprecated-i18n-component": i18n === false ? "off" : "error",
        "vue-i18n/no-deprecated-i18n-place-attr": i18n === false ? "off" : "error",
        "vue-i18n/no-deprecated-i18n-places-prop": i18n === false ? "off" : "error",
        "vue-i18n/no-deprecated-modulo-syntax": i18n === false ? "off" : "error",
        "vue-i18n/no-deprecated-tc": i18n === false ? "off" : "error",
        "vue-i18n/no-deprecated-v-t": i18n === false ? "off" : "error",
        "vue-i18n/no-i18n-t-path-prop": i18n === false ? "off" : "error",
        "vue-i18n/valid-message-syntax": i18n === false ? "off" : "error",
        "vue-i18n/prefer-linked-key-with-paren": i18n === false ? "off" : "error",
        "vue-i18n/key-format-style": i18n === false ? "off" : ["error", "kebab-case"],
        "vue-i18n/no-dynamic-keys": i18n === false ? "off" : "error",
        "vue-i18n/no-unknown-locale": i18n === false ? "off" : "error",
        // "vue-i18n/no-missing-keys-in-other-locales": i18n === false ? "off" : "error",
        // "@intlify/vue-i18n/no-unused-keys": i18n === false ? "off" : "error",

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
        "vue/comma-dangle": [stylisticEnforcement, "always-multiline"],
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
        "vue/object-property-newline": [stylisticEnforcement, { allowMultiplePropertiesPerLine: true }],
        "vue/operator-linebreak": [stylisticEnforcement, "before"],
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
              "import/default": "off",
              "import/named": "off",
              "import/namespace": "off",
              "import/no-unresolved": "off",
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
