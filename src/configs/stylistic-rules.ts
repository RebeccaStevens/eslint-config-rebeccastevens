import type { StylisticCustomizeOptions } from "@stylistic/eslint-plugin";

import type { FlatConfigItem, StylisticConfig } from "../types";
import { loadPackages } from "../utils";

/**
 * Trailing comma behavior for a single comma-dangle context.
 */
type StylisticCommaDanglePerTypeValue = "always" | "always-multiline" | "never" | "only-multiline" | "ignore";

/**
 * The `comma-dangle` option: either a single value applied to every context,
 * or per-context values (including the `@stylistic`-only TypeScript contexts).
 */
export type StylisticCommaDangleOption =
  | Exclude<StylisticCommaDanglePerTypeValue, "ignore">
  | Partial<
      Record<
        | "arrays"
        | "objects"
        | "imports"
        | "exports"
        | "functions"
        | "enums"
        | "generics"
        | "tuples"
        | "dynamicImports"
        | "importAttributes",
        StylisticCommaDanglePerTypeValue
      >
    >;

/**
 * Explicit knobs for each point where two stylistic profiles must diverge.
 *
 * Every knob defaults to the value that reproduces the historical
 * `stylistic()` output exactly; the `"eslint"` formatter backend overrides
 * only the knobs it needs (see `eslint-formatter.ts`).
 */
export type StylisticRulesProfile = {
  /**
   * Enable `@stylistic/indent` for TypeScript code (with TS-aware offsets:
   * function return types, union/intersection `ignoredNodes`, and ternary
   * offsets around calls/awaits/news).
   *
   * Has no effect when `typescript` is `false` (indent is always on there).
   *
   * @default false
   */
  indentTs?: boolean;

  /**
   * Keep `newline-per-chained-call` enforcement (chain breaks by depth).
   *
   * @default true
   */
  forceChainBreaks?: boolean;

  /**
   * Keep forced object newlines (`object-curly-newline` with
   * `minProperties: 3` thresholds). When `false`, only `{ consistent: true }`
   * is required.
   *
   * @default true
   */
  forceObjectNewlines?: boolean;

  /**
   * Keep `max-statements-per-line` enforcement.
   *
   * @default true
   */
  enforceMaxStatementsPerLine?: boolean;

  /**
   * The `multiline-ternary` mode. Note: no rule force-breaks *nested*
   * ternaries; this is a documented gap of the rule ecosystem.
   *
   * @default "always-multiline"
   */
  ternaryMode?: "always" | "always-multiline" | "never";

  /**
   * The `comma-dangle` option. Defaults to the per-context map used by
   * `stylistic()` (with the TypeScript contexts added when `typescript` is
   * enabled).
   */
  commaDangle?: StylisticCommaDangleOption;
};

/**
 * Options for `buildStylisticRules`.
 */
export type StylisticRulesOptions = {
  /** Indent style/width forwarded to `@stylistic` rules. */
  indent?: StylisticConfig["indent"] | undefined;

  /** Whether JSX stylistic rules are included. */
  jsx?: StylisticConfig["jsx"] | undefined;

  /**
   * Print width. Accepted for interface completeness; no rule consumes it
   * because neither profile enforces line length.
   */
  printWidth?: StylisticConfig["printWidth"] | undefined;

  /** Quote style forwarded to `@stylistic/quotes`. */
  quotes?: StylisticConfig["quotes"] | undefined;

  /** Whether semicolons are required. */
  semi?: StylisticConfig["semi"] | undefined;

  /** Whether TypeScript syntax is being linted. */
  typescript?: boolean | undefined;

  /** Profile knobs controlling the divergence points between profiles. */
  profile?: StylisticRulesProfile | undefined;
};

// Local fallbacks mirroring `StylisticConfigDefaults` (duplicated here instead
// of imported to keep this module free of cycles with `stylistic.ts`, which
// consumes this builder).
const DEFAULT_INDENT: NonNullable<StylisticConfig["indent"]> = 2;
const DEFAULT_JSX = true;
const DEFAULT_QUOTES = "double";
const DEFAULT_SEMI = true;

/**
 * Build the shared `@stylistic/*` rule map consumed by both `stylistic()`
 * and the `"eslint"` formatter backend.
 *
 * With default profile values the returned map is rule-for-rule identical to
 * what `stylistic()` emits: it spreads the same `configs.customize(...)` base
 * and then applies the same explicit rule entries on top, so later keys win
 * in exactly the same way. Divergences are expressed exclusively through the
 * `StylisticRulesProfile` knobs.
 *
 * @param options - Stylistic values, TypeScript flag, and profile knobs.
 * @returns The `@stylistic/*` rule map.
 */
export async function buildStylisticRules(options: Readonly<StylisticRulesOptions>): Promise<FlatConfigItem["rules"]> {
  const {
    indent = DEFAULT_INDENT,
    jsx = DEFAULT_JSX,
    quotes = DEFAULT_QUOTES,
    semi = DEFAULT_SEMI,
    typescript,
    profile = {},
  } = options;

  const [pluginStylistic] = (await loadPackages(["@stylistic/eslint-plugin"])) as [
    typeof import("@stylistic/eslint-plugin").default,
  ];

  const config = pluginStylistic.configs.customize({
    flat: true,
    indent,
    jsx,
    pluginName: "@stylistic",
    quotes,
    semi,
  } as StylisticCustomizeOptions);

  const enableIndentTs = typescript === true && profile.indentTs === true;

  return {
    ...config.rules,

    "@stylistic/array-bracket-spacing": ["error", "never"],
    "@stylistic/arrow-parens": ["error", "always"],
    "@stylistic/arrow-spacing": ["error", { before: true, after: true }],
    "@stylistic/block-spacing": ["error", "always"],
    "@stylistic/brace-style": "error",
    "@stylistic/comma-dangle": [
      "error",
      profile.commaDangle ?? {
        arrays: "only-multiline",
        exports: "only-multiline",
        functions: "ignore",
        imports: "only-multiline",
        objects: "only-multiline",

        ...(typescript === true
          ? {
              enums: "only-multiline",
              generics: "only-multiline",
              tuples: "only-multiline",
            }
          : {}),
      },
    ],
    "@stylistic/comma-spacing": ["error", { before: false, after: true }],
    "@stylistic/comma-style": ["error", "last"],
    "@stylistic/computed-property-spacing": "error",
    "@stylistic/curly-newline": [
      "error",
      {
        consistent: true,
      },
    ],
    "@stylistic/dot-location": ["error", "property"],
    "@stylistic/eol-last": "error",
    "@stylistic/function-call-spacing": ["error", "never"],
    "@stylistic/generator-star-spacing": ["error", "after"],
    "@stylistic/indent":
      typescript !== true || enableIndentTs
        ? [
            "error",
            indent,
            enableIndentTs
              ? {
                  SwitchCase: 1,
                  VariableDeclarator: 1,
                  outerIIFEBody: 1,
                  MemberExpression: 1,
                  FunctionDeclaration: { parameters: 1, body: 1, returnType: 1 },
                  FunctionExpression: { parameters: 1, body: 1, returnType: 1 },
                  CallExpression: { arguments: 1 },
                  ArrayExpression: 1,
                  ObjectExpression: 1,
                  ImportDeclaration: 1,
                  flatTernaryExpressions: false,
                  ignoreComments: false,
                  ignoredNodes: ["TSUnionType", "TSIntersectionType"],
                  offsetTernaryExpressions: {
                    CallExpression: true,
                    AwaitExpression: true,
                    NewExpression: true,
                  },
                }
              : {
                  SwitchCase: 1,
                  VariableDeclarator: 1,
                  outerIIFEBody: 1,
                  MemberExpression: 1,
                  FunctionDeclaration: { parameters: 1, body: 1 },
                  FunctionExpression: { parameters: 1, body: 1 },
                  CallExpression: { arguments: 1 },
                  ArrayExpression: 1,
                  ObjectExpression: 1,
                  ImportDeclaration: 1,
                  flatTernaryExpressions: false,
                  ignoreComments: false,
                },
          ]
        : "off",
    "@stylistic/indent-binary-ops": "error",
    "@stylistic/key-spacing": ["error", { beforeColon: false, afterColon: true }],
    "@stylistic/keyword-spacing": ["error", { before: true, after: true }],
    "@stylistic/linebreak-style": ["error", "unix"],
    "@stylistic/lines-around-comment": [
      "warn",
      {
        beforeBlockComment: true,
        beforeLineComment: false,
        afterBlockComment: false,
        afterLineComment: false,
        afterHashbangComment: true,
        allowBlockStart: true,
        allowBlockEnd: true,
        allowObjectStart: true,
        allowObjectEnd: true,
        allowArrayStart: true,
        allowArrayEnd: true,
        allowClassStart: true,
        allowClassEnd: true,

        ...(typescript === true
          ? {
              allowEnumEnd: true,
              allowEnumStart: true,
              allowInterfaceEnd: true,
              allowInterfaceStart: true,
              allowModuleEnd: true,
              allowModuleStart: true,
              allowTypeEnd: true,
              allowTypeStart: true,
            }
          : {}),
      },
    ],
    "@stylistic/lines-between-class-members": [
      "error",
      "always",
      {
        exceptAfterSingleLine: true,
        ...(typescript === true
          ? {
              exceptAfterOverload: true,
            }
          : {}),
      },
    ],
    "@stylistic/max-statements-per-line": profile.enforceMaxStatementsPerLine === false ? "off" : ["error", { max: 1 }],
    "@stylistic/multiline-ternary": ["error", profile.ternaryMode ?? "always-multiline"],
    "@stylistic/new-parens": "error",
    "@stylistic/newline-per-chained-call":
      profile.forceChainBreaks === false ? "off" : ["error", { ignoreChainWithDepth: 2 }],
    "@stylistic/no-extra-parens": ["error", "all", { nestedBinaryExpressions: false }],
    "@stylistic/no-extra-semi": "error",
    "@stylistic/no-floating-decimal": "error",
    "@stylistic/no-mixed-operators": [
      "error",
      {
        groups: [
          ["+", "-", "*", "/", "%", "**"],
          ["&", "|", "^", "~", "<<", ">>", ">>>"],
          ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
          ["&&", "||"],
          ["in", "instanceof"],
        ],
        allowSamePrecedence: true,
      },
    ],
    "@stylistic/no-mixed-spaces-and-tabs": "error",
    "@stylistic/no-multi-spaces": ["error", { ignoreEOLComments: true }],
    "@stylistic/no-multiple-empty-lines": ["error", { max: 1, maxEOF: 1 }],
    "@stylistic/no-tabs": "error",
    "@stylistic/no-trailing-spaces": "error",
    "@stylistic/no-whitespace-before-property": "error",
    "@stylistic/nonblock-statement-body-position": ["error", "beside", { overrides: {} }],
    "@stylistic/object-curly-newline":
      profile.forceObjectNewlines === false
        ? ["error", { consistent: true }]
        : [
            "error",
            {
              ObjectExpression: {
                minProperties: 3,
                multiline: true,
                consistent: true,
              },
              ObjectPattern: {
                minProperties: 3,
                multiline: true,
                consistent: true,
              },
            },
          ],
    "@stylistic/object-curly-spacing": ["error", "always"],
    "@stylistic/object-property-newline": ["error", { allowAllPropertiesOnSameLine: true }],
    "@stylistic/one-var-declaration-per-line": ["error", "always"],
    "@stylistic/operator-linebreak": [
      "error",
      "after",
      {
        overrides: {
          // "=": "none",
          "==": "none",
          "===": "none",
          "?": "before",
          ":": "before",
          "|": "before",
        },
      },
    ],
    "@stylistic/padded-blocks": [
      "error",
      {
        blocks: "never",
        switches: "never",
        classes: "never",
      },
    ],
    "@stylistic/quote-props": ["error", "consistent-as-needed"],
    "@stylistic/quotes": ["error", quotes, { avoidEscape: true, allowTemplateLiterals: "never" }],
    "@stylistic/rest-spread-spacing": ["error", "never"],
    "@stylistic/semi-spacing": ["error", { before: false, after: true }],
    "@stylistic/semi-style": ["error", "last"],
    "@stylistic/semi": ["error", semi ? "always" : "never"],
    "@stylistic/space-before-blocks": ["error", "always"],
    "@stylistic/space-before-function-paren": [
      "error",
      {
        asyncArrow: "always",
        anonymous: "never",
        named: "never",
      },
    ],
    "@stylistic/space-in-parens": ["error", "never"],
    "@stylistic/space-infix-ops": "error",
    "@stylistic/space-unary-ops": ["error", { words: true, nonwords: false }],
    "@stylistic/spaced-comment": [
      "error",
      "always",
      {
        line: {
          exceptions: ["-", "+", "*"],
          markers: ["*package", "!", "/", ",", "="],
        },
        block: {
          balanced: true,
          exceptions: ["-", "+", "*"],
          markers: ["*package", "!", "*", ",", ":", "::", "flow-include"],
        },
      },
    ],
    "@stylistic/switch-colon-spacing": ["error", { after: true, before: false }],
    "@stylistic/template-curly-spacing": ["error", "never"],
    "@stylistic/template-tag-spacing": ["error", "never"],
    "@stylistic/wrap-iife": ["error", "inside", { functionPrototypeMethods: true }],
    "@stylistic/yield-star-spacing": ["error", "after"],

    ...(typescript === true
      ? {
          "@stylistic/member-delimiter-style": "error",
          "@stylistic/type-annotation-spacing": "error",
          "@stylistic/type-generic-spacing": "error",
          "@stylistic/type-named-tuple-spacing": "error",
        }
      : {}),
  };
}
