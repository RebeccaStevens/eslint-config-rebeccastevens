export const GLOB_SRC_EXT = "?([cm])[jt]s?(x)";
export const GLOB_SRC = "**/?(.)*.?([cm])[jt]s?(x)";

export const GLOB_JS = "**/?(.)*.?([cm])js";
export const GLOB_JSX = "**/?(.)*.?([cm])jsx";

export const GLOB_TS = "**/?(.)*.?([cm])ts";
export const GLOB_TSX = "**/?(.)*.?([cm])tsx";
export const GLOB_DTS = "**/?(.)*.d.?([cm])ts";

export const GLOB_ROOT_JS = "./?(.)*.?([cm])js";
export const GLOB_ROOT_JSX = "./?(.)*.?([cm])jsx";

export const GLOB_ROOT_TS = "./?(.)*.?([cm])ts";
export const GLOB_ROOT_TSX = "./?(.)*.?([cm])tsx";
export const GLOB_ROOT_DTS = "./?(.)*.d.?([cm])ts";

export const GLOB_TYPINGS = "typings/**/?(.)*.?([cm])ts";

export const GLOB_MJS = "**/?(.)*.mjs";
export const GLOB_MTS = "**/?(.)*.mts";

export const GLOB_CJS = "**/?(.)*.cjs";
export const GLOB_CTS = "**/?(.)*.cts";

// cspell:disable-next-line
export const GLOB_STYLE = "**/?(.)*.{c,le,sc,pc,postc}ss";
export const GLOB_CSS = "**/?(.)*.css";
export const GLOB_POSTCSS = "**/?(.)*.{p,post}css";
export const GLOB_LESS = "**/?(.)*.less";
export const GLOB_SCSS = "**/?(.)*.scss";

export const GLOB_JSON = "**/?(.)*.json";
export const GLOB_JSON5 = "**/?(.)*.json5";
export const GLOB_JSONC = "**/?(.)*.jsonc";

export const GLOB_MARKDOWN = "**/?(.)*.md";
export const GLOB_MARKDOWN_IN_MARKDOWN = "**/?(.)*.md/?(.)*.md";
export const GLOB_VUE = "**/?(.)*.vue";
export const GLOB_YAML = "**/?(.)*.y?(a)ml";
export const GLOB_TOML = "**/?(.)*.toml";
export const GLOB_HTML = "**/?(.)*.htm?(l)";
export const GLOB_GRAPHQL = "**/?(.)*.{g,graph}ql";

export const GLOB_MARKDOWN_CODE: string = `${GLOB_MARKDOWN}/${GLOB_SRC}`;

export const GLOB_TESTS: string[] = [
  `**/__tests__/**/?(.)*.${GLOB_SRC_EXT}`,
  `**/?(.)*.spec.${GLOB_SRC_EXT}`,
  `**/?(.)*.test.${GLOB_SRC_EXT}`,
  `**/?(.)*.bench.${GLOB_SRC_EXT}`,
  `**/?(.)*.benchmark.${GLOB_SRC_EXT}`,
];

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
