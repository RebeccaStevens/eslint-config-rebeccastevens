<div align="center">

# My ESLint Config

An [ESLint Shareable Config](https://eslint.org/docs/developer-guide/shareable-configs.html).

[![npm version](https://img.shields.io/npm/v/@rebeccastevens/eslint-config.svg)](https://www.npmjs.com/package/@rebeccastevens/eslint-config)
[![CI](https://github.com/RebeccaStevens/eslint-config-rebeccastevens/actions/workflows/release.yml/badge.svg)](https://github.com/RebeccaStevens/eslint-config-rebeccastevens/actions/workflows/release.yml)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![GitHub Discussions](https://img.shields.io/github/discussions/RebeccaStevens/eslint-config-rebeccastevens?style=flat-square)](https://github.com/RebeccaStevens/eslint-config-rebeccastevens/discussions)
[![BSD 3 Clause license](https://img.shields.io/github/license/RebeccaStevens/eslint-config-rebeccastevens.svg?style=flat-square)](https://opensource.org/licenses/BSD-3-Clause)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](https://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

</div>

## Donate

[Any donations would be much appreciated](./DONATIONS.md). 😄

## Installation

```sh
pnpm add -D  \
  eslint \
  @rebeccastevens/eslint-config
```

```sh
pnpm dlx install-peerdeps @rebeccastevens/eslint-config --dev -o -Y
```

Note: This project doesn't strictly follow semantic versioning so be sure to pin the version you are using.

## Usage

```js
// eslint.config.js
import rsEslint from "@rebeccastevens/eslint-config";

export default rsEslint(
  {
    // general config.
  },
  {
    // project specific config.
  },
  {
    // another project specific config.
  },
);
```

See [ESLint configuration](https://eslint.org/docs/user-guide/configuring) for more information.

## Formatters

The `formatters` option enables formatting via `eslint-plugin-format`. Pass `true`
to enable every category, or an object to configure each file category
independently:

| Category                                             | Accepts                                                                                 |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `js`, `ts`                                           | `true`, `false`, `"prettier"`, `"dprint"`, `"eslint"`, or an options object             |
| `json`, `yaml`, `css`, `html`, `markdown`, `graphql` | `true`, `false`, `"prettier"`, `"dprint"`, or an options object                         |
| `dts`, `tailwind`                                    | `boolean`                                                                               |
| `slidev`                                             | `boolean` or `{ files?, formatter?, prettierOptions?, dprintOptions?, dprintPlugins? }` |

Each category options object supports `formatter`, `prettierOptions`,
`dprintOptions`, and `dprintPlugins`. Categories without an explicit `formatter`
inherit the top-level `formatter` (default `"prettier"`).

### CSS in Vue SFCs

Style blocks inside Vue SFCs are formatted when both Vue support and the
`css` category are active (`vue.sfcBlocks` defaults to enabled). The supported
languages are `css`, `pcss`, `postcss`, `scss`, and `less`; style blocks in
other languages are skipped. The matching globs target the processor's virtual
output; a real on-disk path literally named like `*.vue/style.css` would also
match — pathological and accepted, as formatter rules are harmless there.

### Migrating from the single global formatter

Previously the formatter was chosen once globally, via a discriminated union on
`formatter: "prettier" | "dprint"`:

```js
// Before: one formatter for everything; dprintPlugins was top-level only.
export default rsEslint({
  formatters: {
    formatter: "dprint",
    dprintOptions: { lineWidth: 100 },
    dprintPlugins: ["@dprint/typescript"],
    ts: false,
  },
});
```

```js
// After: per-category selection; dprintPlugins is per-category.
export default rsEslint({
  formatters: {
    formatter: "dprint", // top-level default (unchanged)
    dprintOptions: { lineWidth: 100 }, // top-level default (unchanged)
    js: { dprintPlugins: ["@dprint/typescript"] },
    ts: false,
  },
});
```

Mapping:

- Top-level `formatter: "prettier"` with `prettierOptions` → unchanged.
- Top-level `formatter: "dprint"` with `dprintOptions` → unchanged.
- Top-level `dprintPlugins` → removed. Move it into each category that should
  use dprint (e.g. `js: { dprintPlugins: [...] }`).
- Per-category booleans (`ts: false`, ...) → unchanged.
- New: per-category `prettierOptions`/`dprintOptions` overrides merged over
  the top-level ones.
- New: `"eslint"` backend for `js`/`ts` — see below.

### The `"eslint"` backend for `js` and `ts`

The `js` and `ts` categories can skip external formatters entirely and use
pure `@stylistic/*` rules instead:

```js
export default rsEslint({
  formatters: {
    js: "eslint",
    ts: "eslint",
  },
});
```

This backend **approximates** prettier's style — it does not replicate it:

- **No reflow.** No line-length rule is enabled (`max-len` stays off), so long
  lines stay long instead of being wrapped.
- **Nested ternaries are not force-broken.** `multiline-ternary` is set to
  `"always-multiline"`; no available rule expresses prettier's nested-ternary
  breaking (documented gap).
- Relaxed by design: chain-break forcing (`newline-per-chained-call`) and
  `max-statements-per-line` are disabled, `object-curly-newline` only requires
  consistency, and trailing commas follow `comma-dangle: "only-multiline"`.
- Indentation is enforced for TypeScript code too (`@stylistic/indent` with
  TS-aware offsets), unlike the default stylistic profile where prettier owns it.
- Violations are reported as lint errors rather than silently reformatted.

Tailwind class sorting is unaffected:
`tailwind-better/enforce-consistent-class-order` stays active without any
prettier plugins.

In editors the backend remains active — the in-editor configuration disables no
`@stylistic/*` rules.

### Semantics: selecting the backend implies style defaults

When `js` or `ts` selects `"eslint"`, that category owns JS/TS formatting, and
the standalone `stylistic` option stops applying to those files:

- With `stylistic` enabled (the default), its rules stay active everywhere the
  backend does not reach — Vue SFCs, markdown code blocks, and declaration
  files when `formatters.dts` is unset.
- With `stylistic: false`, the backend alone defines JS/TS style: the formatter
  implies the style defaults, so you get the relaxed profile above with no
  further configuration.

### Deferred to @stylistic v6

Several configured rules (`array-bracket-newline`, `array-bracket-spacing`,
`array-element-newline`, `function-call-argument-newline`,
`function-paren-newline`, `object-curly-newline`, `object-curly-spacing`,
`object-property-newline`) are deprecated in `@stylistic@5` in favor of the
unified [`list-style`](https://eslint.style/rules/list-style) rule, which only
becomes stable in `@stylistic@6`. Migration to `list-style` is deferred until
that release; these rules keep their current configuration in the meantime.
