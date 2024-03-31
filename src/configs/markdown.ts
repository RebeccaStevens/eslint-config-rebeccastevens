import { type ESLint, type Linter } from "eslint";
import { mergeProcessors, processorPassThrough } from "eslint-merge-processors";

import {
  GLOB_MARKDOWN,
  GLOB_MARKDOWN_CODE,
  GLOB_MARKDOWN_IN_MARKDOWN,
} from "../globs";
import {
  type FlatConfigItem,
  type OptionsComponentExts,
  type OptionsFiles,
  type OptionsOverrides,
} from "../types";
import { interopDefault, loadPackages, parserPlain } from "../utils";

export async function markdown(
  options: OptionsFiles & OptionsComponentExts & OptionsOverrides = {},
): Promise<FlatConfigItem[]> {
  const {
    componentExts = [],
    files = [GLOB_MARKDOWN],
    overrides = {},
  } = options;

  const [pluginMarkdown] = (await loadPackages(["eslint-plugin-markdown"])) as [
    ESLint.Plugin,
  ];

  const [pluginTs, pluginFunctional] = await Promise.all([
    interopDefault(import("@typescript-eslint/eslint-plugin")).catch(
      () => undefined,
    ),
    interopDefault(import("eslint-plugin-functional")).catch(() => undefined),
  ]);

  return [
    {
      name: "rs:markdown:setup",
      plugins: {
        pluginMarkdown,
      },
    },
    {
      name: "rs:markdown:processor",
      files,
      ignores: [GLOB_MARKDOWN_IN_MARKDOWN],
      // `eslint-plugin-markdown` only creates virtual files for code blocks,
      // but not the markdown file itself. We use `eslint-merge-processors` to
      // add a pass-through processor for the markdown file itself.
      processor: mergeProcessors([
        // eslint-disable-next-line ts/no-explicit-any, ts/no-unsafe-member-access
        (pluginMarkdown as any).processors.markdown as Linter.Processor,
        processorPassThrough,
      ]),
    },
    {
      name: "rs:markdown:parser",
      files,
      languageOptions: {
        parser: parserPlain,
      },
    },
    {
      name: "rs:markdown:disables",
      files: [
        GLOB_MARKDOWN_CODE,
        ...componentExts.map((ext) => `${GLOB_MARKDOWN}/**/*.${ext}`),
      ],
      languageOptions: {
        parserOptions: {
          project: null,
          ecmaFeatures: {
            impliedStrict: true,
          },
        },
      },
      rules: {
        ...pluginTs?.configs["disable-type-checked"]?.rules,
        ...pluginFunctional?.configs.off.rules,

        "dot-notation": "off",
        "init-declarations": "off",
        "no-alert": "off",
        "no-console": "off",
        "no-empty-function": "off",
        "no-empty": "off",
        "no-irregular-whitespace": "off",
        "no-invalid-this": "off",
        "no-labels": "off",
        "no-lone-blocks": "off",
        "no-restricted-syntax": "off",
        "no-throw-literal": "off",
        "no-undef": "off",
        "no-unused-expressions": "off",
        "no-unused-labels": "off",
        "no-unused-vars": "off",
        "no-useless-return": "off",
        "prefer-const": "off",
        "unicode-bom": "off",

        "import/extensions": "off",
        "import/newline-after-import": "off",
        "import/no-extraneous-dependencies": "off",
        "import/no-unresolved": "off",

        "jsdoc/require-jsdoc": "off",

        "node/handle-callback-err": "off",
        "node/prefer-global/process": "off",

        "prettier/prettier": "off",

        "sonar/no-extra-arguments": "off",
        "sonar/no-unused-collection": "off",

        "style/comma-dangle": "off",
        "style/eol-last": "off",

        "ts/consistent-generic-constructors": "off",
        "ts/consistent-indexed-object-style": "off",
        "ts/consistent-type-definitions": "off",
        "ts/consistent-type-imports": "off",
        "ts/explicit-member-accessibility": "off",
        "ts/no-empty-function": "off",
        "ts/no-explicit-any": "off",
        "ts/no-namespace": "off",
        "ts/no-redeclare": "off",
        "ts/no-require-imports": "off",
        "ts/no-unused-expressions": "off",
        "ts/no-unused-vars": "off",
        "ts/no-use-before-define": "off",
        "ts/no-var-requires": "off",
        "ts/prefer-for-of": "off",
        "ts/prefer-function-type": "off",

        "unicorn/prefer-optional-catch-binding": "off",
        "unicorn/prefer-top-level-await": "off",
        "unicorn/switch-case-braces": "off",

        ...overrides,
      },
    },
  ];
}
