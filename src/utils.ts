import { type Awaitable, type FlatConfigItem } from "eslint-flat-config-utils";
import { isPackageExists } from "local-pkg";

/**
 * Combine array and non-array configs into a single array.
 */
export async function combine(
  ...configs: ReadonlyArray<Awaitable<FlatConfigItem | FlatConfigItem[]>>
): Promise<FlatConfigItem[]> {
  const resolved = await Promise.all(configs);
  return resolved.flat();
}

export async function interopDefault<T>(
  value: Awaitable<T>,
): Promise<T extends { default: infer U } ? U : T> {
  const resolved = await value;
  // eslint-disable-next-line ts/no-unsafe-return, ts/no-explicit-any, ts/no-unsafe-member-access
  return (resolved as any).default ?? resolved;
}

export function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? (value as T[]) : [value as T];
}

export const parserPlain = {
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
    const missingString = missing.join(", ");

    if (Boolean(process.env["CI"]) || !process.stdout.isTTY) {
      throw new Error(`Missing packages: ${missingString}`);
    }

    const prompt = await import("@clack/prompts");
    const result = await prompt.confirm({
      message:
        missing.length === 1
          ? `${missing[0]} is required for this config. Do you want to install it?`
          : `Packages are required for this config: ${missingString}.\nDo you want to install them?`,
    });

    if (result !== false)
      await import("@antfu/install-pkg").then(({ installPackage }) =>
        installPackage(missing, { dev: true }),
      );
  }

  // eslint-disable-next-line ts/no-unsafe-return
  return Promise.all(packageIds.map((id) => interopDefault(import(id)))) as any;
}
