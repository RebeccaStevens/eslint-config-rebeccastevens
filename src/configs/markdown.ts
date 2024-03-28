import { type ESLint, type Linter } from "eslint";
import { mergeProcessors, processorPassThrough } from "eslint-merge-processors";

import {
  GLOB_MARKDOWN,
  GLOB_MARKDOWN_CODE,
  GLOB_MARKDOWN_IN_MARKDOWN,
} from "..";
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
    interopDefault(import("eslint-plugin-functional/flat")).catch(
      () => undefined,
    ),
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
          ecmaFeatures: {
            impliedStrict: true,
          },
        },
      },
      rules: {
        ...pluginTs?.configs["disable-type-checked"]?.rules,
        ...pluginFunctional?.configs.off.rules,

        "import/newline-after-import": "off",
        "no-alert": "off",
        "no-console": "off",
        "no-labels": "off",
        "no-lone-blocks": "off",
        "no-restricted-syntax": "off",
        "no-undef": "off",
        "no-unused-expressions": "off",
        "no-unused-labels": "off",
        "no-unused-vars": "off",
        "node/prefer-global/process": "off",
        "style/comma-dangle": "off",
        "style/eol-last": "off",
        "ts/consistent-type-imports": "off",
        "ts/no-namespace": "off",
        "ts/no-redeclare": "off",
        "ts/no-require-imports": "off",
        "ts/no-unused-vars": "off",
        "ts/no-use-before-define": "off",
        "ts/no-var-requires": "off",
        "unicode-bom": "off",
        "dot-notation": "off",
        "import/extensions": "off",
        "import/no-unresolved": "off",
        "init-declarations": "off",
        "jsdoc/require-jsdoc": "off",
        "n/handle-callback-err": "off",
        "no-empty-function": "off",
        "no-empty": "off",
        "no-invalid-this": "off",
        "no-throw-literal": "off",
        "no-useless-return": "off",
        "prefer-const": "off",
        "prettier/prettier": "off",
        "sonarjs/no-extra-arguments": "off",
        "sonarjs/no-unused-collection": "off",
        "ts/consistent-generic-constructors": "off",
        "ts/consistent-type-definitions": "off",
        "ts/explicit-member-accessibility": "off",
        "ts/no-empty-function": "off",
        "ts/no-explicit-any": "off",
        "ts/no-unused-expressions": "off",
        "ts/prefer-function-type": "off",
        "unicorn/prefer-optional-catch-binding": "off",
        "unicorn/prefer-top-level-await": "off",
        "unicorn/switch-case-braces": "off",

        ...overrides,
      },
    },
  ];
}
