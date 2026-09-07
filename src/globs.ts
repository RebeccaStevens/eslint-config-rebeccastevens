/**
 * Source file extension pattern (e.g. `.js`, `.ts`, `.mjs`).
 */
export const GLOB_SRC_EXT = "?([cm])[jt]s?(x)";

/**
 * Source file pattern — matches all JS/TS files including dotfiles.
 */
export const GLOB_SRC = "**/?(.)*.?([cm])[jt]s?(x)";

/**
 * JavaScript files (`.js`, `.mjs`, `.cjs`).
 */
export const GLOB_JS = "**/?(.)*.?([cm])js";

/**
 * JSX files (`.jsx`, `.mjsx`, `.cjsx`).
 */
export const GLOB_JSX = "**/?(.)*.?([cm])jsx";

/**
 * TypeScript files (`.ts`, `.mts`, `.cts`).
 */
export const GLOB_TS = "**/?(.)*.?([cm])ts";

/**
 * TSX files (`.tsx`, `.mtsx`, `.ctsx`).
 */
export const GLOB_TSX = "**/?(.)*.?([cm])tsx";

/**
 * TypeScript declaration files (`.d.ts`, `.d.mts`, `.d.cts`).
 */
export const GLOB_DTS = "**/?(.)*.d.?([cm])ts";

/**
 * Root-level JavaScript files (non-recursive).
 */
export const GLOB_ROOT_JS = "./?(.)*.?([cm])js";

/**
 * Root-level JSX files (non-recursive).
 */
export const GLOB_ROOT_JSX = "./?(.)*.?([cm])jsx";

/**
 * Root-level TypeScript files (non-recursive).
 */
export const GLOB_ROOT_TS = "./?(.)*.?([cm])ts";

/**
 * Root-level TSX files (non-recursive).
 */
export const GLOB_ROOT_TSX = "./?(.)*.?([cm])tsx";

/**
 * Root-level TypeScript declaration files (non-recursive).
 */
export const GLOB_ROOT_DTS = "./?(.)*.d.?([cm])ts";

/**
 * TypeScript typings directory files (typings/).
 */
export const GLOB_TYPINGS = "typings/**/?(.)*.?([cm])ts";

/**
 * ESM-only JavaScript files (`.mjs`).
 */
export const GLOB_MJS = "**/?(.)*.mjs";

/**
 * ESM-only TypeScript files (`.mts`).
 */
export const GLOB_MTS = "**/?(.)*.mts";

/**
 * CommonJS-only JavaScript files (`.cjs`).
 */
export const GLOB_CJS = "**/?(.)*.cjs";

/**
 * CommonJS-only TypeScript files (`.cts`).
 */
export const GLOB_CTS = "**/?(.)*.cts";

/**
 * All stylesheet files (CSS, Less, SCSS, PostCSS).
 */
// cspell:disable-next-line
export const GLOB_STYLE = "**/?(.)*.{c,le,sc,pc,postc}ss";

/**
 * Indented Sass files (`.sass`).
 *
 * Kept as an explicit exclusion for style formatting: neither prettier nor
 * dprint can parse the indented sass syntax, so these files must stay out of
 * formatter blocks by design rather than by pattern accident.
 */
// cspell:disable-next-line
export const GLOB_SASS = "**/?(.)*.sass";

/**
 * CSS files.
 */
export const GLOB_CSS = "**/?(.)*.css";

/**
 * PostCSS files (`.pcss`, `.postcss`).
 */
export const GLOB_POSTCSS = "**/?(.)*.{p,post}css";

/**
 * Less files.
 */
export const GLOB_LESS = "**/?(.)*.less";

/**
 * SCSS files.
 */
export const GLOB_SCSS = "**/?(.)*.scss";

/**
 * JSON files.
 */
export const GLOB_JSON = "**/?(.)*.json";

/**
 * JSON5 files.
 */
export const GLOB_JSON5 = "**/?(.)*.json5";

/**
 * JSONC files (JSON with comments).
 */
export const GLOB_JSONC = "**/?(.)*.jsonc";

/**
 * Markdown files.
 */
export const GLOB_MARKDOWN = "**/?(.)*.md";

/**
 * Markdown files nested inside other Markdown files.
 */
export const GLOB_MARKDOWN_IN_MARKDOWN = "**/?(.)*.md/?(.)*.md";

/**
 * Vue single-file components.
 */
export const GLOB_VUE = "**/?(.)*.vue";

/**
 * YAML files.
 */
export const GLOB_YAML = "**/?(.)*.y?(a)ml";

/**
 * TOML files.
 */
export const GLOB_TOML = "**/?(.)*.toml";

/**
 * HTML files (`.htm`, `.html`).
 */
export const GLOB_HTML = "**/?(.)*.htm?(l)";

/**
 * GraphQL files (`.gql`, `.graphql`).
 */
export const GLOB_GRAPHQL = "**/?(.)*.{g,graph}ql";

/**
 * Code blocks embedded in Markdown files.
 */
export const GLOB_MARKDOWN_CODE: string = `${GLOB_MARKDOWN}/${GLOB_SRC}`;

/**
 * Test file patterns (__tests__, *.spec.*, *.test.*, *.bench.*, *.benchmark.*).
 */
export const GLOB_TESTS: string[] = [
  `**/__tests__/**/?(.)*.${GLOB_SRC_EXT}`,
  `**/?(.)*.spec.${GLOB_SRC_EXT}`,
  `**/?(.)*.test.${GLOB_SRC_EXT}`,
  `**/?(.)*.bench.${GLOB_SRC_EXT}`,
  `**/?(.)*.benchmark.${GLOB_SRC_EXT}`,
];

/**
 * All source file patterns (JS/TS + styles + JSON + Markdown + Vue + YAML + HTML + TOML + GraphQL).
 */
export const GLOB_ALL_SRC: string[] = [
  GLOB_SRC,
  GLOB_STYLE,
  GLOB_JSON,
  GLOB_JSON5,
  GLOB_JSONC,
  GLOB_MARKDOWN,
  GLOB_VUE,
  GLOB_YAML,
  GLOB_HTML,
  GLOB_TOML,
  GLOB_GRAPHQL,
];

/**
 * Default ignore patterns — lockfiles, build output, caches, auto-generated files.
 */
export const GLOB_EXCLUDE: string[] = [
  "**/node_modules",
  "**/dist",
  "**/lib",
  "**/package-lock.json",
  "**/yarn.lock",
  "**/pnpm-lock.yaml",
  "**/bun.lockb",

  "**/output",
  "**/coverage",
  "**/temp",
  "**/.temp",
  "**/tmp",
  "**/.tmp",
  "**/.history",
  "**/.vitepress/cache",
  "**/.nuxt",
  "**/.next",
  "**/.vercel",
  "**/.changeset",
  "**/.idea",
  "**/.cache",
  "**/.output",
  "**/.vite-inspect",
  "**/.yarn",

  "**/CHANGELOG*.md",
  "**/?(.)*.min.*",
  "**/LICENSE*",
  "**/__snapshots__",
  "**/auto-import.ts",
  "**/auto-import.d.ts",
  "**/auto-imports.ts",
  "**/auto-imports.d.ts",
  "**/components.ts",
  "**/components.d.ts",
  "**/typegen.ts",
  "**/typegen.d.ts",
];
