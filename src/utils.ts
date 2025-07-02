import assert from "node:assert/strict";

import type { Linter } from "eslint";
import type { Awaitable } from "eslint-flat-config-utils";
import { isPackageExists } from "local-pkg";

import type { FlatConfigItem } from "./types";

/**
 * Combine array and non-array configs into a single array.
 */
export async function combine(
  ...configs: ReadonlyArray<Awaitable<FlatConfigItem | FlatConfigItem[]>>
): Promise<FlatConfigItem[]> {
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

export async function loadPackages<T extends string[]>(
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
    const allPackages = [...mut_installPackagesToLoad.values()];
    mut_installPackagesTimeout = null;
    mut_installPackagesToLoad.clear();
    mut_installPackagesAction = null;
    assert(mut_installPackagesActionResolver !== null);
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
