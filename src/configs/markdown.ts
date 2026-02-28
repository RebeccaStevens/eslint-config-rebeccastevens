import type { ESLint, Linter } from "eslint";

import { GLOB_MARKDOWN, GLOB_MARKDOWN_CODE, GLOB_MARKDOWN_IN_MARKDOWN } from "../globs";
import type {
  FlatConfigItem,
  OptionsComponentExts,
  OptionsFiles,
  OptionsOverrides,
  OptionsTypeRequiredRules,
} from "../types";
import { interopDefault, loadPackages, parserPlain } from "../utils";

export async function markdown(
  options: Readonly<Required<OptionsFiles & OptionsComponentExts & OptionsTypeRequiredRules & OptionsOverrides>>,
): Promise<FlatConfigItem[]> {
  const { componentExts, files, overrides, enableTypeRequiredRules } = options;

  const [pluginMarkdown, { mergeProcessors, processorPassThrough }] = (await loadPackages([
    "@eslint/markdown",
    "eslint-merge-processors",
  ])) as [ESLint.Plugin, typeof import("eslint-merge-processors")];

  const [pluginTs, pluginFunctional] = await Promise.all([
    interopDefault(import("@typescript-eslint/eslint-plugin")).catch(() => undefined),
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
      // `@eslint/markdown` only creates virtual files for code blocks,
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
      name: "rs:markdown:code",
      files: [GLOB_MARKDOWN_CODE, ...componentExts.map((ext) => `${GLOB_MARKDOWN}/*.${ext}`)],
      languageOptions: {
        parserOptions: {
          ...(enableTypeRequiredRules ? undefined : { project: false, projectService: false, program: null }),
          ecmaFeatures: {
            impliedStrict: true,
          },
        },
      },
      rules: {
        ...(enableTypeRequiredRules
          ? undefined
          : {
              ...pluginTs?.configs["disable-type-checked"]?.rules,
              ...pluginFunctional?.configs.off.rules,
            }),

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

        "import-x/extensions": "off",
        "import-x/newline-after-import": "off",
        "import-x/no-extraneous-dependencies": "off",
        "import-x/no-unresolved": "off",
        "import-x/order": "off",

        "jsdoc/require-jsdoc": "off",

        "n/handle-callback-err": "off",
        "n/prefer-global/process": "off",

        "prettier/prettier": "off",

        "sonarjs/no-extra-arguments": "off",
        "sonarjs/no-unused-collection": "off",

        "@stylistic/comma-dangle": "off",
        "@stylistic/eol-last": "off",

        "@typescript-eslint/consistent-generic-constructors": "off",
        "@typescript-eslint/consistent-indexed-object-style": "off",
        "@typescript-eslint/consistent-type-definitions": "off",
        "@typescript-eslint/consistent-type-imports": "off",
        "@typescript-eslint/explicit-member-accessibility": "off",
        "@typescript-eslint/naming-convention": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-namespace": "off",
        "@typescript-eslint/no-redeclare": "off",
        "@typescript-eslint/no-require-imports": "off",
        "@typescript-eslint/no-unused-expressions": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/prefer-for-of": "off",
        "@typescript-eslint/prefer-function-type": "off",

        "unicorn/prefer-optional-catch-binding": "off",
        "unicorn/prefer-top-level-await": "off",
        "unicorn/switch-case-braces": "off",

        ...overrides,
      },
    },
  ];
}
