<div align="center">

# My ESLint Config

An [ESLint Shareable Config](https://eslint.org/docs/developer-guide/shareable-configs.html).

[![npm version](https://img.shields.io/npm/v/@rebeccastevens/eslint-config.svg?logo=npm&style=flat-square)](https://www.npmjs.com/package/@rebeccastevens/eslint-config)
[![BSD 3 Clause license](https://img.shields.io/github/license/RebeccaStevens/eslint-config-rebeccastevens.svg?style=flat-square)](https://opensource.org/licenses/BSD-3-Clause)  
[![Tests Status](https://github.com/RebeccaStevens/eslint-config-rebeccastevens/workflows/CI/badge.svg?style=flat-square)](https://github.com/RebeccaStevens/eslint-config-rebeccastevens/actions)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](https://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)  
[![codecov](https://codecov.io/gh/RebeccaStevens/eslint-config-rebeccastevens/branch/master/graph/badge.svg?style=flat-square)](https://codecov.io/gh/RebeccaStevens/eslint-config-rebeccastevens)
[![dependabot](https://api.dependabot.com/badges/status?host=github&repo=RebeccaStevens/eslint-config-rebeccastevens&style=flat-square)](https://dependabot.com/)
[![dependencies status](https://img.shields.io/david/RebeccaStevens/eslint-config-rebeccastevens.svg?logo=david&style=flat-square)](https://david-dm.org/RebeccaStevens/eslint-config-rebeccastevens)
[![dev dependencies status](https://img.shields.io/david/dev/RebeccaStevens/eslint-config-rebeccastevens.svg?logo=david&style=flat-square)](https://david-dm.org/RebeccaStevens/eslint-config-rebeccastevens?type=dev)

An [ESLint](http://eslint.org) plugin to disable mutation and promote functional programming in JavaScript and TypeScript.

</div>

<br>

## Installation

```sh
yarn add -D  \
  eslint \
  @rebeccastevens/eslint-config \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin \
  eslint-plugin-eslint-comments \
  eslint-plugin-functional \
  eslint-plugin-import \
  eslint-import-resolver-typescript \
  eslint-plugin-jsdoc \
  eslint-plugin-markdown \
  eslint-plugin-node \
  eslint-plugin-optimize-regex \
  eslint-plugin-promise \
  eslint-plugin-simple-import-sort \
  eslint-plugin-sonarjs \
  eslint-plugin-unicorn
```

## Usage

`.eslintrc`

```jsonc
{
  "root": true,
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "extends": ["@rebeccastevens/eslint-config"],
  "rules": {
    // Additional, per-project rules...
  },
  "overrides": [
    // Additional, per-project overrides...
    {
      "files": ["**/*.test.ts"],
      "rules": {
        // ...
      }
    }
  ]
}
```

See [ESLint configuration](http://eslint.org/docs/user-guide/configuring) for more information.
