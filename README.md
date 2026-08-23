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

| Category                          | Accepts                                                                          |
| --------------------------------- | -------------------------------------------------------------------------------- |
| `js`, `ts`                        | `true`, `false`, `"prettier"`, `"dprint"`, `"eslint"`, or an options object       |
| `json`, `yaml`, `css`, `html`, `markdown`, `graphql` | `true`, `false`, `"prettier"`, `"dprint"`, or an options object |
| `dts`, `tailwind`                 | `boolean`                                                                        |
| `slidev`                          | `boolean` or `{ files?, formatter?, prettierOptions?, dprintOptions?, dprintPlugins? }` |

Each category options object supports `formatter`, `prettierOptions`,
`dprintOptions`, and `dprintPlugins`. Categories without an explicit `formatter`
inherit the top-level `formatter` (default `"prettier"`).

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
- Upcoming: `"eslint"` backend for `js`/`ts` (landing in the next release
  commit — currently falls back to prettier).
