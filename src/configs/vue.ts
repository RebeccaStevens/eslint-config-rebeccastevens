import { type ESLint, type Linter } from "eslint";
import { mergeProcessors } from "eslint-merge-processors";

import { GLOB_VUE } from "../globs";
import {
  type FlatConfigItem,
  type OptionsFiles,
  type OptionsHasTypeScript,
  type OptionsOverrides,
  type OptionsStylistic,
  type OptionsVue,
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

export async function vue(
  options: Readonly<
    OptionsVue &
      OptionsHasTypeScript &
      OptionsOverrides &
      OptionsStylistic &
      OptionsFiles
  >,
): Promise<FlatConfigItem[]> {
  const {
    files = [GLOB_VUE],
    overrides = {},
    stylistic = true,
    vueVersion = 3,
    typescript = false,
  } = options;

  const sfcBlocks = options.sfcBlocks === true ? {} : options.sfcBlocks ?? {};

  const { indent = 2 } = typeof stylistic === "boolean" ? {} : stylistic;

  const [pluginVue, pluginVueI18n, parserVue, processorVueBlocks] =
    (await loadPackages([
      "eslint-plugin-vue",
      "@intlify/eslint-plugin-vue-i18n",
      "vue-eslint-parser",
      "eslint-processor-vue-blocks",
    ])) as [
      PluginVue,
      ESLint.Plugin,
      typeof import("vue-eslint-parser"),
      (typeof import("eslint-processor-vue-blocks"))["default"],
    ];

  const parserTs = await interopDefault(
    import("@typescript-eslint/parser"),
  ).catch(() => undefined);

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
      plugins: {
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
        // this is deprecated
        // "vue/component-tags-order": "off",
        "vue/custom-event-name-casing": ["error", "camelCase"],
        "vue/define-macros-order": [
          "error",
          {
            order: [
              "defineOptions",
              "defineProps",
              "defineEmits",
              "defineSlots",
            ],
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
        "vue/no-restricted-syntax": [
          "error",
          "DebuggerStatement",
          "LabeledStatement",
          "WithStatement",
        ],
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

        "vue-i18n/no-html-messages": "warn",
        "vue-i18n/no-missing-keys": "warn",
        "vue-i18n/no-raw-text": "warn",
        "vue-i18n/no-v-html": "warn",

        ...(stylistic === false
          ? {}
          : {
              "vue/array-bracket-spacing": ["error", "never"],
              "vue/arrow-spacing": ["error", { after: true, before: true }],
              "vue/block-spacing": ["error", "always"],
              "vue/block-tag-newline": [
                "error",
                {
                  multiline: "always",
                  singleline: "always",
                },
              ],
              "vue/brace-style": [
                "error",
                // cspell:disable-next-line
                "stroustrup",
                { allowSingleLine: true },
              ],
              "vue/comma-dangle": ["error", "always-multiline"],
              "vue/comma-spacing": ["error", { after: true, before: false }],
              "vue/comma-style": ["error", "last"],
              "vue/html-comment-content-spacing": [
                "error",
                "always",
                {
                  exceptions: ["-"],
                },
              ],
              "vue/key-spacing": [
                "error",
                { afterColon: true, beforeColon: false },
              ],
              "vue/keyword-spacing": ["error", { after: true, before: true }],
              // "vue/object-curly-newline": "off",
              "vue/object-curly-spacing": ["error", "always"],
              "vue/object-property-newline": [
                "error",
                { allowMultiplePropertiesPerLine: true },
              ],
              "vue/operator-linebreak": ["error", "before"],
              "vue/padding-line-between-blocks": ["error", "always"],
              "vue/quote-props": ["error", "consistent-as-needed"],
              "vue/space-in-parens": ["error", "never"],
              "vue/template-curly-spacing": "error",
            }),

        ...overrides,
      },
    },
  ];
}
