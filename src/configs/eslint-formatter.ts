import type { FlatConfigItem, StylisticConfig } from "../types";

import { buildStylisticRules } from "./stylistic-rules";

/**
 * Build the `@stylistic/*` rule map backing the `"eslint"` formatter backend
 * for the `js`/`ts` formatter categories: a relaxed profile over the shared
 * stylistic rule builder that approximates prettier style without reflowing
 * code. It enables `@stylistic/indent` for TypeScript code (with TS-aware
 * offsets, including ternary offsets around calls/awaits/news), disables
 * chain-break forcing and `max-statements-per-line`, only requires consistent
 * object curly newlines, keeps `multiline-ternary: "always-multiline"`
 * (nested ternaries are not force-broken — a documented gap), uses
 * `comma-dangle: "only-multiline"`, and enforces no line length. Violations
 * are reported as errors so they break lint rather than being silently
 * reformatted.
 *
 * @param options - The stylistic values and whether TypeScript syntax is linted.
 * @returns The relaxed `@stylistic/*` rule map.
 */
export async function eslintFormatterStylisticRules(
  options: Readonly<{ stylistic: Readonly<StylisticConfig>; typescript?: boolean }>,
): Promise<FlatConfigItem["rules"]> {
  const { stylistic, typescript } = options;

  return buildStylisticRules({
    indent: stylistic.indent,
    jsx: stylistic.jsx,
    printWidth: stylistic.printWidth,
    quotes: stylistic.quotes,
    semi: stylistic.semi,
    typescript,
    profile: {
      commaDangle: "only-multiline",
      enforceMaxStatementsPerLine: false,
      forceChainBreaks: false,
      forceObjectNewlines: false,
      indentTs: true,
      ternaryMode: "always-multiline",
    },
  });
}
