import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";

import type { ESLint, Linter } from "eslint";
import type { Awaitable } from "eslint-flat-config-utils";
import { isPackageExists } from "local-pkg";

import type { FlatConfigItem } from "./types";

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

  // eslint-disable-next-line ts/no-explicit-any, ts/no-unsafe-return
  return Promise.all(packageIds.map((id) => interopDefault(import(id)))) as any;
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
