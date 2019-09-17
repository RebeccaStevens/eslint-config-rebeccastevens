<h1 align="center">My ESLint Config</h1>

<p align="center">An ESLint <a href="https://eslint.org/docs/developer-guide/shareable-configs.html">Shareable Config.</a></p>

<p align="center">
  <a href="https://www.npmjs.com/package/@rebeccastevens/eslint-config"><img alt="npm version" src="https://img.shields.io/npm/v/@rebeccastevens/eslint-config.svg?logo=npm&style=flat-square" /></a>
  <a href="https://opensource.org/licenses/BSD-3-Clause"><img alt="BSD 3 Clause license" src="https://img.shields.io/github/license/RebeccaStevens/eslint-config-rebeccastevens.svg?style=flat-square" /></a>
  <br>
  <a href="https://github.com/RebeccaStevens/eslint-config-rebeccastevens/actions"><img alt="Tests Status" src="https://github.com/RebeccaStevens/eslint-config-rebeccastevens/workflows/Validate%20&%20Release/badge.svg?style=flat-square" /></a>
  <a href="https://commitizen.github.io/cz-cli/"><img alt="Commitizen friendly" src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square" /></a>
  <a href="https://github.com/semantic-release/semantic-release"><img alt="semantic-release" src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square" /></a>
  <br>
  <a href="https://codecov.io/gh/RebeccaStevens/eslint-config-rebeccastevens"><img alt="codecov" src="https://codecov.io/gh/RebeccaStevens/eslint-config-rebeccastevens/branch/master/graph/badge.svg?style=flat-square" /></a>
  <a href="https://dependabot.com/"><img alt="dependabot" src="https://api.dependabot.com/badges/status?host=github&repo=RebeccaStevens/eslint-config-rebeccastevens&style=flat-square" /></a>
  <a href="https://david-dm.org/RebeccaStevens/eslint-config-rebeccastevens"><img alt="dependencies status" src="https://img.shields.io/david/RebeccaStevens/eslint-config-rebeccastevens.svg?logo=david&style=flat-square" /></a>
  <a href="https://david-dm.org/RebeccaStevens/eslint-config-rebeccastevens?type=dev"><img alt="dev dependencies status" src="https://img.shields.io/david/dev/RebeccaStevens/eslint-config-rebeccastevens.svg?logo=david&style=flat-square" /></a>
</p>

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

See [ESLint configuration](http://eslint.org/docs/user-guide/configuring) for
mor information.
