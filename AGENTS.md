# Agent Guide for @rebeccastevens/eslint-config

This document provides context for AI agents working on this codebase.

## Project Overview

An ESLint shareable config package (`@rebeccastevens/eslint-config`) that provides a comprehensive, opinionated ESLint configuration for TypeScript and JavaScript projects. Designed as a factory function that composes multiple config modules based on user options.

**Primary audience**: Local dev work — agents helping maintain this config package itself.

## Architecture

### Core Files

- **`src/factory.ts`** — Public API (`rsEslint()` function). Handles plugin renaming, option merging, and delegates to `assembleConfigs()`.
- **`src/assembly.ts`** — Core composition logic. Composes base configs and feature configs based on options.
- **`src/types.ts`** — TypeScript types for all options (`OptionsConfig`, `OptionsTypescript`, `OptionsTailwindCSS`, etc.).
- **`src/utils.ts`** — Shared utilities (plugin loading, version detection, type helpers).
- **`src/globs.ts`** — File pattern constants (`GLOB_TS`, `GLOB_SRC`, `GLOB_TESTS`, etc.) used for file targeting.
- **`src/configs/`** — Individual config modules (30+ files), each exporting a function that returns `FlatConfigItem[]`.

### Config Composition Flow

```text
rsEslint(options) → assembleConfigs(options) → [...baseConfigs, ...featureConfigs, overrides()]
```

1. **Base configs** (always applied): ignores, javascript (includes comments rules), imports, jsdoc, promise, regexp, unicorn, node
2. **Feature configs** (conditional): sonar, typescript, stylistic, functional, vue, react, test, json, yaml, toml, markdown, formatters, etc.
3. **Overrides**: User-provided rule overrides applied last

### Plugin Renaming System

The config renames plugins for shorter rule prefixes:

- `@typescript-eslint` → `ts`
- `import-x` → `import`
- `@stylistic` → `style`
- `sonarjs` → `sonar`
- `n` → `node`
- `vitest` → `test`

**Rule name usage depends on context:**

- **In source code (`src/configs/*.ts`)**: Use original plugin names (e.g., `"sonarjs/no-unused-vars"`, `"@typescript-eslint/no-explicit-any"`)
- **In `eslint.config.js`**: Use renamed names (e.g., `"sonar/no-unused-vars"`, `"ts/no-explicit-any"`) — you're a consumer of your own config
- **User overrides**: Must use renamed prefixes

**⚠️ Common trap**: Copying rule names from plugin docs into `eslint.config.js` with original prefixes results in silent no-ops:

```js
// ❌ Silent no-op — rule not found
{ sonarjs: { "sonarjs/no-unused-vars": "off" } }

// ✅ Correct — use renamed prefix
{ sonar: { "sonar/no-unused-vars": "off" } }
```

## Code Conventions

### `mut_` Prefix Convention

All mutable variables must be prefixed with `mut_` (or `Mut_` if naming convention requires uppercase first letter). This prefix exempts variables from functional programming enforcement rules.

**Example**:

```ts
let mut_counter = 0; // ✅ Allowed - intentional mutation
mut_counter += 1; // No lint error

let count = 0; // ❌ Would trigger functional/no-let
```

Implementation details (which rules enforce this) are in `src/configs/typescript.ts`.

### Functional Enforcement Levels

- `"none"` — No functional rules enforced
- `"lite"` — Basic rules (no-param-reassign without prop checking)
- `"recommended"` — Moderate rules (prefer-immutable-types as warning)
- `"strict"` — Full enforcement (prefer-immutable-types as error)

### Mode: `application` vs `library`

The `mode` option controls strictness levels across multiple configs. It affects imports, TypeScript, and functional rules.

**`library` mode** — Stricter, for packages published to npm:

- Requires file extensions in all relative imports to optimize imports for jsr (`import-x/extensions: "always"`)
- Disallows unassigned imports or side effects
- Enforces `no-return-void` (error) — functions must not return void (as that would imply the function performs a side effect)
- Enforces `prefer-immutable-types` (warn) — encourages readonly parameter types to allow for readonly types as inputs to those functions
- Stricter immutability rules for type declarations

**`application` mode** — More lenient, for apps not published:

- No extension requirements on imports (assumes code will be bundled)
- Allows unassigned imports (side effects, CSS)
- Disables stricter functional rules (`no-return-void`, `prefer-immutable-types`)

**`none` mode** — Default. No mode-specific rules applied.

**Where mode is used:**

- `src/configs/imports.ts` — extension rules, unassigned import rules
- `src/configs/typescript.ts` — empty object type allowance
- `src/configs/functional.ts` — void return, immutability enforcement
- `src/assembly.ts` — forces functional config in library mode

### Stylistic Option Propagation

The `stylistic` option controls formatting/style rules across many configs. It's passed to: `imports`, `stylistic`, `vue`, `react`, `tailwind`, `unocss`, `json`, `yaml`, `toml`, `markdown`, `formatters`.

When `stylistic: false`, formatting rules are disabled across all these configs. When adding a new config that has formatting rules, accept and respect this option.

## Development Commands

```bash
pnpm build          # Build dist/ with Rollup
pnpm typecheck      # Run TypeScript type checking
pnpm lint           # Run full lint suite (build + eslint + md + spelling + knip + package + attw + packages)
pnpm lint:fix       # Auto-fix lint issues
```

## Testing

**No automated unit tests exist.** Validation is done via:

1. **`pnpm lint`** — Primary validation. Verifies the config works on this codebase.
2. **Manual smoke test** — Apply changes to consuming codebases and confirm no regressions.

When making changes, run `pnpm lint` after every significant modification.

## Rule Overlap Management

When adding or updating plugins, evaluate overlaps using this priority:

1. **Does TypeScript compiler already catch it?** → Disable the ESLint rule
2. **Does another enabled plugin already cover it?** → Prefer the rule with richer detection (type-aware, more patterns caught)
3. **Is the check unique to this plugin?** → Keep it

**Known overlap groups to check:**

- `sonarjs` ↔ `@typescript-eslint` (TS-specific rules)
- `sonarjs` ↔ core ESLint (basic code quality)
- `sonarjs` ↔ `regexp` (regex rules)
- `sonarjs` ↔ `react` (JSX rules)
- `functional` ↔ `@typescript-eslint` (readonly/type rules)
- `security` ↔ `regexp` (regex safety)

**Currently disabled sonarjs rules (in `sonar.ts`) due to overlap:**

- `sonarjs/argument-type` → covered by TypeScript compiler (`tsc`)
- `sonarjs/assertions-in-tests` → covered by `vitest/expect-expect`
- `sonarjs/no-default-utility-imports` → unnecessary restriction on default imports
- `sonarjs/no-unused-vars` → covered by `@typescript-eslint/no-unused-vars`
- `sonarjs/no-fallthrough` → covered by core `no-fallthrough`
- `sonarjs/no-labels` → covered by core `no-labels`
- `sonarjs/code-eval` → covered by core `no-eval`
- `sonarjs/no-parameter-reassignment` → covered by core `no-param-reassign`

**Currently disabled security rules (in `security.ts`) due to overlap:**

- `security/detect-unsafe-regex` → covered by `regexp/no-super-linear-backtracking` (richer AST-based analysis)

## Dependency Update Workflow

When updating sonarjs, typescript-eslint, or other plugins:

1. Review changelog for new rules
2. Check each new rule against the overlap priority list above
3. Disable rules that duplicate existing coverage
4. Run `pnpm lint` to verify no regressions
5. Test against consuming codebases

## Commit Conventions

This project uses [Commitizen](https://commitizen.github.io/cz-cli/) with conventional commits. Run `pnpm cz` to create commits interactively, or follow the format:

```text
<type>: <description>
```

Common types: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`.

## Versioning

**This project does not strictly follow semantic versioning.** Pin the version you are using. Publishing is handled by [semantic-release](https://github.com/semantic-release/semantic-release) — no manual publish needed.

## Key Design Decisions

1. **SonarJS integration**: Uses sonarjs recommended config but disables rules that duplicate core ESLint or typescript-eslint rules.
2. **Type-aware rules**: Split into separate config blocks (type-aware vs non-type-aware) for performance.
3. **In-editor mode**: Automatically detected from env vars (`VSCODE_PID`, `JETBRAINS_IDE`, etc.). Disables slow/stylistic rules while keeping bug-detection rules.
4. **Tailwind CSS support**: Auto-detects version from config files (v3 vs v4) and applies appropriate rules.
5. **Node version detection**: Reads `.nvmrc`/`.node-version`/`package.json` engines to enable version-specific unicorn/node rules.
6. **Auto-detection**: Several options auto-detect from project state:
   - `pnpm`: detects `pnpm-lock.yaml` presence
   - `test`: detects `vitest` in dependencies
   - `react`: detects `react`, `next`, `remix`, `react-router`
   - `vue`: detects `vue`, `nuxt`, `vitepress`, `@slidev/cli`
   - `typescript`, `tailwind`, `unocss`: detect their respective packages
   - All auto-detected options can be overridden by passing an explicit value
7. **Config consolidation**: Small always-on configs are merged into related configs to reduce file count:
   - `sort.ts` → `jsonc.ts`: tsconfig sorting (`jsonc/sort-keys`) requires jsonc parser, always runs when jsonc enabled. Gated on `typescript && stylistic !== false`.
   - `comments.ts` → `javascript.ts`: eslint-comments plugin is always-on with zero user options, core JS concern.

## Common Patterns

### Adding a New Config Module

1. Create `src/configs/<name>.ts` exporting an async function returning `FlatConfigItem[]`
2. Use `loadPlugins()` or `loadPackages()` from `src/utils.ts` to load the plugin
3. Accept `OptionsOverrides` for user rule overrides
4. Export from `src/configs/index.ts`
5. Import and wire into `src/assembly.ts` in the `featureConfigs` array
6. Add options type to `src/types.ts` if needed
7. Add option extraction in `assembleConfigs()`

### `getOverrides` / `resolveSubOptions`

Two helpers in `assembly.ts` extract nested plugin options:

```ts
// Extracts sub-options (e.g., { vue: { ... } } → the inner object)
const vueOpts = resolveSubOptions(options, "vue");

// Extracts just the overrides from sub-options
const overrides = getOverrides(options, "typescript");
```

### Conditional Config Spreads

```ts
const featureConfigs = [
  ...(sonarOptions ? [sonar(functionalConfigOptions)] : []),
  ...(typeScriptOptions === false ? [] : [typescript({...})]),
  // ...
];
```

### Type-Aware Parser Setup

```ts
// Type-aware files (TS/TSX/DTS)
makeParser(true, filesTypeAware);

// Non-type-aware files (JS/JSX)
makeParser(false, files, filesTypeAware);
```

### Override Pattern

```ts
const { overrides = {} } = options;
return {
  ...baseRules,
  ...overrides, // User overrides applied last
};
```

## Troubleshooting

### Build Fails

- Run `pnpm typegen` first (generates type definitions)
- Ensure `rollup.config.ts` is valid

### Lint Errors

- Check if rule is disabled in `in-editor.ts` (may be intentionally slow/stylistic)
- Verify rule name uses renamed prefix in `eslint.config.js` (e.g., `ts/` not `@typescript-eslint/`)

### Type Errors

- Ensure `projectService` is configured correctly in parser options
- Check if rule requires type information (`💭 Requires type information`)
