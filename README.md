<div align="center">

# My ESLint Config

An [ESLint Shareable Config](https://eslint.org/docs/developer-guide/shareable-configs.html).

[![npm version](https://img.shields.io/npm/v/@rebeccastevens/eslint-config.svg)](https://www.npmjs.com/package/@rebeccastevens/eslint-config)
[![CI](https://github.com/RebeccaStevens/eslint-config-rebeccastevens/actions/workflows/release.yml/badge.svg)](https://github.com/RebeccaStevens/eslint-config-rebeccastevens/actions/workflows/release.yml)
[![Coverage Status](https://codecov.io/gh/RebeccaStevens/eslint-config-rebeccastevens/branch/main/graph/badge.svg?token=MVpR1oAbIT)](https://codecov.io/gh/RebeccaStevens/eslint-config-rebeccastevens)\
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

See [ESLint configuration](http://eslint.org/docs/user-guide/configuring) for more information.
