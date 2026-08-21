import assert from "node:assert/strict";

import type { ESLint } from "eslint";
import { isPackageExists } from "local-pkg";

import type {
  FlatConfigItem,
  OptionsFiles,
  OptionsHasTypeScript,
  OptionsOverrides,
  OptionsReact,
  OptionsSecurity,
  OptionsTypeScriptParserOptions,
} from "../types";
import { interopDefault, loadPlugins } from "../utils";

const ReactRefreshAllowConstantExportPackages = ["vite"];
const RemixPackages = ["@remix-run/node", "@remix-run/react", "@remix-run/serve", "@remix-run/dev"];
const NextJsPackages = ["next"];
const ReactRouterPackages = ["react-router"];

/**
 * Enable comprehensive React linting.
 *
 * Loads `@eslint-react/eslint-plugin`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`,
 * and `eslint-plugin-jsx-a11y`. Auto-detects Remix, Next.js, and React Router to allow their
 * framework-specific exports, and enables react-refresh rules when Vite is present. Uses the
 * plugin naming convention (`@eslint-react` → `react`, `react-hooks` → `react-hooks`, etc.).
 * When `typescript` is enabled, the TypeScript parser is configured for JSX. Security rules
 * respect `securitySeverity`.
 *
 * @param options - Options with `files`, `i18n`, `overrides`, `typescript`, `parserOptions`, and optional `securitySeverity`
 * @returns Flat config items enabling React, JSX-a11y, and optional i18next rules
 */
export async function react(
  options: Readonly<
    Required<OptionsReact & OptionsHasTypeScript & OptionsOverrides & OptionsFiles & OptionsTypeScriptParserOptions>
  > & { securitySeverity?: OptionsSecurity["severity"] },
): Promise<FlatConfigItem[]> {
  const { files, i18n, overrides, typescript, parserOptions, securitySeverity = "moderate" } = options;

  const [pluginReact, pluginReactHooks, pluginReactRefresh, pluginJsxA11y] = await loadPlugins([
    "@eslint-react/eslint-plugin",
    "eslint-plugin-react-hooks",
    "eslint-plugin-react-refresh",
    "eslint-plugin-jsx-a11y",
  ]);

  const parserTs = typescript ? await interopDefault(import("@typescript-eslint/parser")) : undefined;

  const isAllowConstantExport = ReactRefreshAllowConstantExportPackages.some((index) => isPackageExists(index));
  const isUsingRemix = RemixPackages.some((index) => isPackageExists(index));
  const isUsingNext = NextJsPackages.some((index) => isPackageExists(index));
  const isUsingReactRouter = ReactRouterPackages.some((index) => isPackageExists(index));

  const plugins =
    (pluginReact as { configs?: { all?: { plugins?: Record<string, ESLint.Plugin> } } }).configs?.all?.plugins ??
    assert.fail("Failed to load react plugin's plugins.");

  const securityRuleLevel = securitySeverity === "none" ? "off" : securitySeverity === "lite" ? "warn" : "error";

  const core = [
    {
      name: "rs:react:setup",
      plugins: {
        react: plugins["@eslint-react"] ?? assert.fail(`Failed to find "@eslint-react".`),

        "react-hooks": pluginReactHooks,

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
          ...(typescript && parserOptions),
        },
        sourceType: "module",
      },
      rules: {
        // recommended rules from @eslint-react/dom
        "react/dom-no-void-elements-with-children": "error",
        "react/dom-no-dangerously-set-innerhtml": securityRuleLevel,
        "react/dom-no-dangerously-set-innerhtml-with-children": securityRuleLevel,
        "react/dom-no-find-dom-node": "error",
        "react/dom-no-missing-button-type": "error",
        "react/dom-no-missing-iframe-sandbox": securityRuleLevel,
        "react/dom-no-render-return-value": "error",
        "react/dom-no-script-url": securityRuleLevel,
        "react/dom-no-unsafe-iframe-sandbox": securityRuleLevel,
        "react/dom-no-unsafe-target-blank": securityRuleLevel,

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
              ...(isUsingReactRouter
                ? [
                    "action",
                    "clientAction",
                    "clientLoader",
                    "ErrorBoundary",
                    "handle",
                    "headers",
                    "HydrateFallback",
                    "links",
                    "loader",
                    "meta",
                    "shouldRevalidate",
                  ]
                : []),
            ],
          },
        ],

        // recommended rules from @eslint-react
        "react/no-access-state-in-setstate": "error",
        "react/no-array-index-key": "error",
        "react/no-children-count": "error",
        "react/no-children-for-each": "error",
        "react/no-children-map": "error",
        "react/no-children-only": "error",
        "react/no-children-to-array": "error",
        "react/no-clone-element": "error",
        "react/jsx-no-comment-textnodes": "error",
        "react/no-component-will-mount": "error",
        "react/no-component-will-receive-props": "error",
        "react/no-component-will-update": "error",
        "react/no-create-ref": "error",
        "react/no-direct-mutation-state": "error",
        "react/no-duplicate-key": "error",
        "react/no-implicit-key": "error",
        "react/no-missing-key": "error",
        "react/no-nested-component-definitions": "error",
        "react/no-set-state-in-component-did-mount": "error",
        "react/no-set-state-in-component-did-update": "error",
        "react/no-set-state-in-component-will-update": "error",
        "react/no-unsafe-component-will-mount": "error",
        "react/no-unsafe-component-will-receive-props": "error",
        "react/no-unsafe-component-will-update": "error",
        "react/no-unstable-context-value": "error",
        "react/no-unstable-default-props": "error",
        "react/no-unused-class-component-members": "error",
        "react/no-unused-state": "error",
        "react/no-context-provider": "error",
        "react/no-forward-ref": "error",
        "react/no-nested-lazy-component-declarations": "error",
        "react/no-unnecessary-use-prefix": "error",
        "react/no-use-context": "error",

        "react/dom-no-flush-sync": "error",
        "react/dom-no-hydrate": "error",
        "react/dom-no-render": "error",
        "react/dom-no-use-form-state": "error",

        "react/web-api-no-leaked-event-listener": "error",
        "react/web-api-no-leaked-interval": "error",
        "react/web-api-no-leaked-resize-observer": "error",
        "react/web-api-no-leaked-timeout": "error",

        "react/rsc-function-definition": "error",

        "react/naming-convention-context-name": "error",
        "react/naming-convention-id-name": "error",
        "react/naming-convention-ref-name": "error",

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

        ...(typescript && {
          "react/no-leaked-conditional-rendering": "error",
        }),

        ...overrides,
      },
    },
  ] satisfies FlatConfigItem[];

  if (i18n === false) {
    return core;
  }

  const [i18nPlugin] = await loadPlugins(["eslint-plugin-i18next"]);

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
          ...(typescript && parserOptions),
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
