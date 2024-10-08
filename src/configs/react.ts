import assert from "node:assert/strict";

import type { ESLint } from "eslint";
import { isPackageExists } from "local-pkg";

import type {
  FlatConfigItem,
  OptionsFiles,
  OptionsHasTypeScript,
  OptionsOverrides,
  OptionsReact,
  OptionsTypeScriptParserOptions,
} from "../types";
import { interopDefault, loadPackages } from "../utils";

const ReactRefreshAllowConstantExportPackages = ["vite"];
const RemixPackages = ["@remix-run/node", "@remix-run/react", "@remix-run/serve", "@remix-run/dev"];
const NextJsPackages = ["next"];

export async function react(
  options: Readonly<
    Required<OptionsReact & OptionsHasTypeScript & OptionsOverrides & OptionsFiles & OptionsTypeScriptParserOptions>
  >,
): Promise<FlatConfigItem[]> {
  const { files, i18n, overrides, typescript, parserOptions } = options;

  const [pluginReact, pluginReactHooks, pluginReactRefresh, pluginJsxA11y] = (await loadPackages([
    "@eslint-react/eslint-plugin",
    "eslint-plugin-react-hooks",
    "eslint-plugin-react-refresh",
    "eslint-plugin-jsx-a11y",
  ])) as [ESLint.Plugin, ESLint.Plugin, ESLint.Plugin, ESLint.Plugin];

  const parserTs = typescript ? await interopDefault(import("@typescript-eslint/parser")) : undefined;

  const isAllowConstantExport = ReactRefreshAllowConstantExportPackages.some((i) => isPackageExists(i));
  const isUsingRemix = RemixPackages.some((i) => isPackageExists(i));
  const isUsingNext = NextJsPackages.some((i) => isPackageExists(i));

  const plugins =
    ((pluginReact.configs?.["all"] as any)?.plugins as Record<string, ESLint.Plugin> | undefined) ??
    assert.fail("Failed to load react plugin's plugins.");

  const core = [
    {
      name: "rs:react:setup",
      plugins: {
        react: plugins["@eslint-react"] ?? assert.fail(`Failed to find "@eslint-react".`),
        "react-dom": plugins["@eslint-react/dom"] ?? assert.fail(`Failed to find "@eslint-react/dom".`),
        "react-hooks": pluginReactHooks,
        "react-hooks-extra":
          plugins["@eslint-react/hooks-extra"] ?? assert.fail(`Failed to find "@eslint-react/hooks-extra".`),
        "react-naming-convention":
          plugins["@eslint-react/naming-convention"] ??
          assert.fail(`Failed to find "@eslint-react/naming-convention".`),
        "react-refresh": pluginReactRefresh,
        "jsx-a11y": pluginJsxA11y,
      },
    },
    {
      name: "rs:react:rules",
      files,
      languageOptions: {
        parser: typescript ? parserTs : undefined,
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          ...(typescript ? parserOptions : undefined),
        },
        sourceType: "module",
      },
      rules: {
        // recommended rules from @eslint-react/dom
        "react-dom/no-children-in-void-dom-elements": "error",
        "react-dom/no-dangerously-set-innerhtml": "error",
        "react-dom/no-dangerously-set-innerhtml-with-children": "error",
        "react-dom/no-find-dom-node": "error",
        "react-dom/no-missing-button-type": "error",
        "react-dom/no-missing-iframe-sandbox": "error",
        "react-dom/no-namespace": "error",
        "react-dom/no-render-return-value": "error",
        "react-dom/no-script-url": "error",
        "react-dom/no-unsafe-iframe-sandbox": "error",
        "react-dom/no-unsafe-target-blank": "error",

        // recommended rules react-hooks
        "react-hooks/exhaustive-deps": "error",
        "react-hooks/rules-of-hooks": "error",

        // react refresh
        "react-refresh/only-export-components": [
          "error",
          {
            allowConstantExport: isAllowConstantExport,
            allowExportNames: [
              ...(isUsingNext
                ? ["config", "generateStaticParams", "metadata", "generateMetadata", "viewport", "generateViewport"]
                : []),
              ...(isUsingRemix ? ["meta", "links", "headers", "loader", "action"] : []),
            ],
          },
        ],

        // recommended rules from @eslint-react
        "react/ensure-forward-ref-using-ref": "error",
        "react/no-access-state-in-setstate": "error",
        "react/no-array-index-key": "error",
        "react/no-children-count": "error",
        "react/no-children-for-each": "error",
        "react/no-children-map": "error",
        "react/no-children-only": "error",
        "react/no-children-prop": "error",
        "react/no-children-to-array": "error",
        "react/no-clone-element": "error",
        "react/no-comment-textnodes": "error",
        "react/no-component-will-mount": "error",
        "react/no-component-will-receive-props": "error",
        "react/no-component-will-update": "error",
        "react/no-create-ref": "error",
        "react/no-direct-mutation-state": "error",
        "react/no-duplicate-key": "error",
        "react/no-implicit-key": "error",
        "react/no-missing-key": "error",
        "react/no-nested-components": "error",
        "react/no-redundant-should-component-update": "error",
        "react/no-set-state-in-component-did-mount": "error",
        "react/no-set-state-in-component-did-update": "error",
        "react/no-set-state-in-component-will-update": "error",
        "react/no-string-refs": "error",
        "react/no-unsafe-component-will-mount": "error",
        "react/no-unsafe-component-will-receive-props": "error",
        "react/no-unsafe-component-will-update": "error",
        "react/no-unstable-context-value": "error",
        "react/no-unstable-default-props": "error",
        "react/no-unused-class-component-members": "error",
        "react/no-unused-state": "error",
        "react/no-useless-fragment": "error",
        "react/prefer-destructuring-assignment": "error",
        "react/prefer-shorthand-boolean": "error",
        "react/prefer-shorthand-fragment": "error",

        "jsx-a11y/alt-text": "error",
        "jsx-a11y/anchor-has-content": "error",
        "jsx-a11y/anchor-is-valid": "error",
        "jsx-a11y/aria-activedescendant-has-tabindex": "error",
        "jsx-a11y/aria-props": "error",
        "jsx-a11y/aria-proptypes": "error",
        "jsx-a11y/aria-role": "error",
        "jsx-a11y/aria-unsupported-elements": "error",
        "jsx-a11y/autocomplete-valid": "error",
        "jsx-a11y/click-events-have-key-events": "error",
        "jsx-a11y/control-has-associated-label": [
          "off",
          {
            ignoreElements: ["audio", "canvas", "embed", "input", "textarea", "tr", "video"],
            ignoreRoles: [
              "grid",
              "listbox",
              "menu",
              "menubar",
              "radiogroup",
              "row",
              "tablist",
              "toolbar",
              "tree",
              "treegrid",
            ],
            includeRoles: ["alert", "dialog"],
          },
        ],
        "jsx-a11y/heading-has-content": "error",
        "jsx-a11y/html-has-lang": "error",
        "jsx-a11y/iframe-has-title": "error",
        "jsx-a11y/img-redundant-alt": "error",
        "jsx-a11y/interactive-supports-focus": [
          "error",
          {
            tabbable: [
              "button",
              "checkbox",
              "link",
              "progressbar",
              "searchbox",
              "slider",
              "spinbutton",
              "switch",
              "textbox",
            ],
          },
        ],
        "jsx-a11y/label-has-for": "off",
        "jsx-a11y/label-has-associated-control": "error",
        "jsx-a11y/media-has-caption": "error",
        "jsx-a11y/mouse-events-have-key-events": "error",
        "jsx-a11y/no-access-key": "error",
        "jsx-a11y/no-autofocus": "error",
        "jsx-a11y/no-distracting-elements": "error",
        "jsx-a11y/no-interactive-element-to-noninteractive-role": "error",
        "jsx-a11y/no-noninteractive-element-interactions": [
          "error",
          {
            body: ["onError", "onLoad"],
            iframe: ["onError", "onLoad"],
            img: ["onError", "onLoad"],
          },
        ],
        "jsx-a11y/no-noninteractive-element-to-interactive-role": "error",
        "jsx-a11y/no-noninteractive-tabindex": "error",
        "jsx-a11y/no-redundant-roles": "error",
        "jsx-a11y/no-static-element-interactions": "error",
        "jsx-a11y/role-has-required-aria-props": "error",
        "jsx-a11y/role-supports-aria-props": "error",
        "jsx-a11y/scope": "error",
        "jsx-a11y/tabindex-no-positive": "error",

        ...(typescript
          ? {
              "react/no-leaked-conditional-rendering": "error",
            }
          : {}),

        ...overrides,
      },
    },
  ] satisfies FlatConfigItem[];

  if (i18n === false) {
    return core;
  }

  const [i18nPlugin] = (await loadPackages(["eslint-plugin-i18next"])) as [ESLint.Plugin];

  const i18nConfigs = [
    {
      name: "rs:react:i18next:setup",
      plugins: {
        i18next: i18nPlugin,
      },
    },
    {
      name: "rs:react:i18next:rules",
      files,
      languageOptions: {
        parser: typescript ? parserTs : undefined,
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          ...(typescript ? parserOptions : undefined),
        },
        sourceType: "module",
      },
      rules: {
        "i18next/no-literal-string": "warn",

        ...i18n.overrides,
      },
    },
  ] satisfies FlatConfigItem[];

  return [...core, ...i18nConfigs];
}
