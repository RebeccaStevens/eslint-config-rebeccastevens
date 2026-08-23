import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";

import type { ESLint, Linter } from "eslint";
import type { Awaitable } from "eslint-flat-config-utils";
import { isPackageExists } from "local-pkg";

import type { FlatConfigItem, StylisticConfig } from "./types";

/**
 * Combine array and non-array configs into a single array.
 *
 * @param configs - The configs to combine
 * @returns A single array of flat configs
 * @internal
 */
export async function combine(
  ...configs: ReadonlyArray<Awaitable<FlatConfigItem | FlatConfigItem[]>>
): Promise<FlatConfigItem[]> {
  // eslint-disable-next-line ts/await-thenable -- https://github.com/typescript-eslint/typescript-eslint/issues/11694
  const resolved = await Promise.all(configs);
  return resolved.flat();
}

export async function interopDefault<T>(value: Awaitable<T>): Promise<T extends { default: infer U } ? U : T> {
  const resolved = await value;
  // eslint-disable-next-line ts/no-unsafe-return, ts/no-explicit-any, ts/no-unsafe-member-access
  return (resolved as any).default ?? resolved;
}

export const parserPlain: Linter.Parser = {
  meta: {
    name: "parser-plain",
  },
  parseForESLint: (code: string) => ({
    ast: {
      body: [],
      comments: [],
      loc: { end: code.length, start: 0 },
      range: [0, code.length],
      tokens: [],
      type: "Program",
    },
    scopeManager: null,
    services: { isPlain: true },
    visitorKeys: {
      Program: [],
    },
  }),
};

/**
 * Memoized package load promises, keyed by package id.
 *
 * Guarantees a single module instance per specifier, even when `loadPackages`
 * is called concurrently with overlapping package lists.
 */
const mut_packageLoadPromises = new Map<string, Promise<unknown>>();

/**
 * Load and interop-default a list of packages, prompting to install any that are missing.
 *
 * @param packageIds - The packages to load
 * @returns An array of loaded packages
 * @internal
 */
export async function loadPackages<T extends ReadonlyArray<string>>(
  packageIds: T,
): Promise<{
  [K in keyof T]: unknown;
}> {
  const missing = packageIds.filter((id) => !isPackageExists(id));

  if (missing.length > 0) {
    await installPackages(missing);
  }

  const mut_promises = packageIds.map((id) => {
    let mut_promise = mut_packageLoadPromises.get(id);
    if (mut_promise === undefined) {
      mut_promise = interopDefault(import(id));
      mut_packageLoadPromises.set(id, mut_promise);
      // Evict rejected loads so a later call can retry the import.
      mut_promise.catch(() => {
        mut_packageLoadPromises.delete(id);
      });
    }
    return mut_promise;
  });

  // eslint-disable-next-line ts/no-explicit-any, ts/no-unsafe-return
  return Promise.all(mut_promises) as any;
}

/**
 * Load a list of packages as ESLint plugins.
 *
 * @param packageIds - The plugins to load
 * @returns An array of loaded plugins
 * @internal
 */
export async function loadPlugins<const T extends ReadonlyArray<string>>(
  packageIds: T,
): Promise<{
  [K in keyof T]: ESLint.Plugin;
}> {
  const packages = await loadPackages(packageIds);
  return packages as { [K in keyof T]: ESLint.Plugin };
}

const mut_installPackagesToLoad = new Set<string>();
let mut_installPackagesAction: Promise<void> | null = null;
let mut_installPackagesActionResolver: ((value: string[] | PromiseLike<string[]>) => void) | null = null;
let mut_installPackagesTimeout: NodeJS.Timeout | null = null;

/* eslint-disable functional/no-loop-statements */
async function installPackages(packages: ReadonlyArray<string>) {
  for (const p of packages) {
    mut_installPackagesToLoad.add(p);
  }

  if (mut_installPackagesTimeout !== null) {
    clearTimeout(mut_installPackagesTimeout);
  }

  mut_installPackagesTimeout = setTimeout(() => {
    const allPackages = [...mut_installPackagesToLoad];
    mut_installPackagesTimeout = null;
    mut_installPackagesToLoad.clear();
    mut_installPackagesAction = null;
    assert.ok(mut_installPackagesActionResolver !== null);
    mut_installPackagesActionResolver(allPackages);
    mut_installPackagesActionResolver = null;
  }, 100);

  mut_installPackagesAction ??= new Promise<string[]>((resolve) => {
    mut_installPackagesActionResolver = resolve;
  }).then(async (allPackages: string[]) => {
    const allPackagesString = allPackages.join(", ");

    if (Boolean(process.env["CI"]) || !process.stdout.isTTY) {
      throw new Error(`Missing packages: ${allPackagesString}`);
    }

    const prompt = await import("@clack/prompts");
    const result = await prompt.confirm({
      message:
        allPackages.length === 1
          ? `${allPackages[0]} is required for this config. Do you want to install it?`
          : `Packages are required for this config: ${allPackagesString}.\nDo you want to install them?`,
    });

    if (result !== false) {
      await import("@antfu/install-pkg").then(({ installPackage }) => installPackage(allPackages, { dev: true }));
    }
  });

  return mut_installPackagesAction;
}
/* eslint-enable functional/no-loop-statements */

/**
 * Read the Node.js major version from `.nvmrc` or `.node-version`.
 *
 * @param projectRoot - Root directory of the project
 * @returns The major version number, or `0` if undetectable
 */
export async function detectNodeMajor(projectRoot: string): Promise<number> {
  const mut_versionStr = await detectNodeVersion(projectRoot);
  if (mut_versionStr.length > 0) {
    const match = /\d+/u.exec(mut_versionStr);
    if (match?.[0] !== undefined) {
      return Number(match[0]);
    }
  }

  return 0;
}

/**
 * Read the Node.js major version from `package.json` engines field.
 *
 * @param projectRoot - Root directory of the project
 * @returns The major version number, or `0` if undetectable
 */
export async function detectEngineNodeMajor(projectRoot: string): Promise<number> {
  try {
    const pkgJsonPath = path.join(projectRoot, "package.json");
    const pkgContent = await fs.readFile(pkgJsonPath, "utf8");
    const pkg = JSON.parse(pkgContent) as { engines?: { node?: string } };
    const nodeEngine = pkg.engines?.node;
    if (nodeEngine !== undefined && nodeEngine.length > 0) {
      const match = /\d+/u.exec(nodeEngine);
      if (match?.[0] !== undefined) {
        return Number(match[0]);
      }
    }
  } catch {}

  return 0;
}

/**
 * Read the raw Node.js version string from `.nvmrc` or `.node-version`.
 *
 * @param projectRoot - Root directory of the project
 * @returns The trimmed version string (with leading `v` stripped), or empty string
 */
export async function detectNodeVersion(projectRoot: string): Promise<string> {
  const nvmrcPath = path.join(projectRoot, ".nvmrc");
  const nodeVersionPath = path.join(projectRoot, ".node-version");

  try {
    const res = await fs.readFile(nvmrcPath, "utf8");
    return res.trim().replace(/^v/u, "");
  } catch {}

  try {
    const res = await fs.readFile(nodeVersionPath, "utf8");
    return res.trim().replace(/^v/u, "");
  } catch {}

  return "";
}

/**
 * Detect whether the project uses pnpm catalogs.
 *
 * Checks `pnpm-workspace.yaml` for `catalog` or `catalogs` fields.
 *
 * @param projectRoot - Root directory of the project
 * @returns `true` if pnpm catalogs are detected
 */
export async function detectPnpmCatalog(projectRoot: string): Promise<boolean> {
  const workspacePath = path.join(projectRoot, "pnpm-workspace.yaml");

  try {
    const content = await fs.readFile(workspacePath, "utf8");
    const lines = content.split("\n");
    return lines.some((line) => /^\s*catalogs?:/u.test(line));
  } catch {}

  return false;
}

/**
 * Indent sizes honored when deriving the stylistic indent from `.editorconfig`.
 */
const EDITORCONFIG_INDENT_SIZES: ReadonlySet<number> = new Set([2, 4, 8]);

/**
 * Extension tokens of `.editorconfig` section selectors that target JavaScript or TypeScript files.
 */
const EDITORCONFIG_SCRIPT_SECTION_TOKEN = /^[cm]?[jt]sx?$/u;

/**
 * Whether an `.editorconfig` section selector applies to JavaScript/TypeScript files.
 *
 * Accepts the universal `*` selector and selectors whose extension tokens are
 * JS/TS variants (`*.js`, `*.ts`, `*.{js,jsx,ts,tsx}`, ...).
 *
 * @param section - The section selector without its surrounding brackets
 * @returns `true` when the section targets JavaScript/TypeScript files
 */
function editorConfigSectionAppliesToScripts(section: string): boolean {
  return (
    section === "*" || section.split(/[,.{}]/u).some((token) => EDITORCONFIG_SCRIPT_SECTION_TOKEN.test(token.trim()))
  );
}

/**
 * Extract the JS/TS indentation setting from raw `.editorconfig` contents.
 *
 * Minimal INI handling: CRLF-normalized lines, `#`/`;` comments stripped,
 * lowercased keys/values, and only sections applying to JS/TS files (the
 * universal `*` plus js/ts variants) consulted. Later matching sections win,
 * mirroring editorconfig semantics.
 *
 * @param content - Raw `.editorconfig` contents
 * @returns The derived indent value, or `undefined` when none is specified
 */
function parseEditorConfigIndent(content: string): StylisticConfig["indent"] {
  let mut_indentStyle: string | undefined;
  let mut_indentSize: string | undefined;
  let mut_tabWidth: string | undefined;
  let mut_currentSection: string | undefined;

  /* eslint-disable functional/no-loop-statements -- line-by-line INI parsing requires iteration */
  for (const rawLine of content.replaceAll("\r\n", "\n").split("\n")) {
    const line = rawLine.split("#", 1)[0]?.split(";", 1)[0]?.trim() ?? "";
    if (line.length === 0) {
      continue;
    }

    if (line.startsWith("[") && line.endsWith("]")) {
      mut_currentSection = line.slice(1, -1);
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (
      separatorIndex === -1 ||
      mut_currentSection === undefined ||
      !editorConfigSectionAppliesToScripts(mut_currentSection)
    ) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim().toLowerCase();
    const value = line
      .slice(separatorIndex + 1)
      .trim()
      .toLowerCase();

    switch (key) {
      case "indent_style": {
        mut_indentStyle = value;
        break;
      }
      case "indent_size": {
        mut_indentSize = value;
        break;
      }
      case "tab_width": {
        mut_tabWidth = value;
        break;
      }
      // No default: keys irrelevant to indent derivation are ignored.
    }
  }
  /* eslint-enable functional/no-loop-statements -- line-by-line INI parsing requires iteration */

  if (mut_indentStyle === "tab") {
    return "tab";
  }

  // `indent_size = tab` defers to `tab_width`, mirroring editorconfig semantics.
  /* eslint-disable functional/no-loop-statements -- candidate precedence check requires iteration */
  for (const size of [mut_indentSize, mut_tabWidth]) {
    const parsed = Number(size);
    if (EDITORCONFIG_INDENT_SIZES.has(parsed)) {
      return parsed;
    }
  }
  /* eslint-enable functional/no-loop-statements -- candidate precedence check requires iteration */

  return undefined;
}

/**
 * Derive the stylistic indent from the project's `.editorconfig`.
 *
 * Walks up from `projectRoot` to the nearest `.editorconfig` — stopping at one
 * declaring `root = true` without any indent setting — and reads its JS/TS
 * indentation: `"tab"` for `indent_style = tab`, otherwise `indent_size` or
 * `tab_width` when set to 2, 4, or 8. Never throws; missing or malformed
 * files yield `undefined`.
 *
 * @param projectRoot - Root directory of the project
 * @returns The derived indent value, or `undefined` when undetectable
 */
export function readEditorConfigIndent(projectRoot: string): StylisticConfig["indent"] {
  try {
    let mut_dir = path.resolve(projectRoot);

    /* eslint-disable functional/no-loop-statements -- directory walk requires iteration */
    while (true) {
      const editorConfigPath = path.join(mut_dir, ".editorconfig");

      // eslint-disable-next-line node/no-sync -- stylistic options resolve synchronously during assembly
      if (existsSync(editorConfigPath)) {
        // eslint-disable-next-line node/no-sync -- stylistic options resolve synchronously during assembly
        const content = readFileSync(editorConfigPath, "utf8");
        const indent = parseEditorConfigIndent(content);

        if (indent !== undefined) {
          return indent;
        }

        // A root-declaring file ends the search even when it sets no indent.
        if (/^root\s*=\s*true\s*$/mu.test(content)) {
          return undefined;
        }
      }

      const parent = path.dirname(mut_dir);
      if (parent === mut_dir) {
        return undefined;
      }
      mut_dir = parent;
    }
    /* eslint-enable functional/no-loop-statements -- directory walk requires iteration */
  } catch {
    return undefined;
  }
}

const IGNORED_TSCONFIG_DIRS = new Set([
  "node_modules",
  "dist",
  "build",
  "out",
  ".output",
  ".git",
  ".github",
  ".husky",
  ".turbo",
  ".next",
  ".nuxt",
  ".cache",
  "coverage",
]);

async function findTsconfigFiles(dir: string, maxDepth = 4, currentDepth = 0): Promise<string[]> {
  if (currentDepth > maxDepth) {
    return [];
  }
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const results = await Promise.all(
      entries.map(async (entry) => {
        if (entry.isDirectory()) {
          if (!IGNORED_TSCONFIG_DIRS.has(entry.name) && !entry.name.startsWith(".")) {
            return findTsconfigFiles(path.join(dir, entry.name), maxDepth, currentDepth + 1);
          }
          return [];
        }
        if (entry.isFile() && /^tsconfig(?:\..+)?\.json$/iu.test(entry.name)) {
          return [path.join(dir, entry.name)];
        }
        return [];
      }),
    );
    return results.flat();
  } catch {
    return [];
  }
}

function collectErasableSyntaxFiles(
  ts: typeof import("typescript"),
  configFile: string,
  mut_visited: Set<string>,
  mut_files: Set<string>,
): void {
  if (mut_visited.has(configFile)) {
    return;
  }
  mut_visited.add(configFile);

  const readResult = ts.readConfigFile(configFile, (filePath) => ts.sys.readFile(filePath)) as {
    config?: unknown;
    error?: unknown;
  };
  if (readResult.error === undefined && readResult.config !== undefined) {
    const parsed = ts.parseJsonConfigFileContent(readResult.config, ts.sys, path.dirname(configFile));
    if (parsed.options.erasableSyntaxOnly === true) {
      /* eslint-disable functional/no-loop-statements */
      for (const fileName of parsed.fileNames) {
        mut_files.add(fileName);
      }
      /* eslint-enable functional/no-loop-statements */
    }

    if (parsed.projectReferences !== undefined) {
      /* eslint-disable functional/no-loop-statements */
      for (const ref of parsed.projectReferences) {
        const resolvedRef = ts.resolveProjectReferencePath(ref);
        collectErasableSyntaxFiles(ts, resolvedRef, mut_visited, mut_files);
      }
      /* eslint-enable functional/no-loop-statements */
    }
  }
}

/**
 * Detect the files included by tsconfigs that have `erasableSyntaxOnly` enabled.
 *
 * @param projectRoot - Root directory of the project
 * @param tsconfigPath - Optional relative or absolute path to tsconfig file (defaults to "tsconfig.json")
 * @returns An array of relative file paths included by tsconfigs where `erasableSyntaxOnly` is true
 */
export async function detectTsconfigErasableSyntaxFiles(
  projectRoot: string,
  tsconfigPath = "tsconfig.json",
): Promise<string[]> {
  try {
    const [ts] = (await loadPackages(["typescript"])) as [typeof import("typescript")];
    const resolvedPath = path.isAbsolute(tsconfigPath) ? tsconfigPath : path.join(projectRoot, tsconfigPath);

    const rootConfigFile = ts.findConfigFile(projectRoot, (filePath) => ts.sys.fileExists(filePath), resolvedPath);
    const nestedFiles = await findTsconfigFiles(projectRoot);

    const mut_discoveredFiles = new Set<string>([
      ...(rootConfigFile === undefined ? [] : [rootConfigFile]),
      ...nestedFiles,
    ]);

    const mut_visited = new Set<string>();
    const mut_files = new Set<string>();

    /* eslint-disable functional/no-loop-statements */
    for (const configFile of mut_discoveredFiles) {
      collectErasableSyntaxFiles(ts, configFile, mut_visited, mut_files);
    }
    /* eslint-enable functional/no-loop-statements */

    return [...mut_files].map((fileName) => path.relative(projectRoot, fileName).replaceAll("\\", "/"));
  } catch {}

  return [];
}

/**
 * Detect whether `erasableSyntaxOnly` is enabled in any of the project's tsconfigs (including nested configs and project references).
 *
 * @param projectRoot - Root directory of the project
 * @param tsconfigPath - Optional relative or absolute path to tsconfig file (defaults to "tsconfig.json")
 * @returns `true` if `erasableSyntaxOnly` is enabled in any detected tsconfig
 */
export async function detectTsconfigErasableSyntaxOnly(
  projectRoot: string,
  tsconfigPath = "tsconfig.json",
): Promise<boolean> {
  const files = await detectTsconfigErasableSyntaxFiles(projectRoot, tsconfigPath);
  return files.length > 0;
}
