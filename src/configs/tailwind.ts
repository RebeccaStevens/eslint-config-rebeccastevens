import type { ESLint } from "eslint";
import semver from "semver";

import type { FlatConfigItem, OptionsTailwindCSS, RequiredOptionsStylistic } from "../types";
import { loadPackages } from "../utils";

export async function tailwind(
  options: Readonly<Required<OptionsTailwindCSS> & RequiredOptionsStylistic>,
): Promise<FlatConfigItem[]> {
  const { overrides, stylistic, tailwindVersion = 4 } = options;

  const [pluginReadableTailwind] = (await loadPackages(["eslint-plugin-readable-tailwind"])) as [ESLint.Plugin];

  if (
    tailwindVersion === 4 &&
    pluginReadableTailwind.meta?.version !== undefined &&
    !semver.satisfies(pluginReadableTailwind.meta.version, ">=2.0.0 || >=2.0.0-beta.0")
  ) {
    console.warn("Please update eslint-plugin-readable-tailwind to version 2.0.0 or higher for tailwindcss v4 support");
  }

  const [pluginTailwindCSS] = (await (tailwindVersion === 3 ? loadPackages(["eslint-plugin-tailwindcss"]) : [])) as [
    ESLint.Plugin | undefined,
  ];

  return [
    {
      name: "rs:tailwind-readable",
      plugins: {
        "tailwind-readable": pluginReadableTailwind,
      },
      rules: {
        ...(stylistic === false
          ? {}
          : {
              "tailwind-readable/multiline": [
                "warn",
                {
                  group: "newLine",
                  indent: stylistic.indent,
                  printWidth: stylistic.printWidth,
                },
              ],
              "tailwind-readable/no-unnecessary-whitespace": "warn",
            }),

        ...overrides,
      },
    },
    ...((tailwindVersion === 3
      ? [
          {
            name: "rs:tailwind-3",
            plugins: {
              tailwind: pluginTailwindCSS!,
            },
            rules: {
              "tailwind/no-contradicting-classname": "error",
              "tailwind/no-arbitrary-value": "off",
              "tailwind/no-custom-classname": "off",

              ...(stylistic === false
                ? {}
                : {
                    "tailwind/classnames-order": "warn",
                    "tailwind/enforces-negative-arbitrary-values": "warn",
                    "tailwind/enforces-shorthand": "warn",
                    "tailwind/no-unnecessary-arbitrary-value": "warn",
                  }),

              ...overrides,
            },
          },
        ]
      : []) satisfies FlatConfigItem[]),
    // ...((tailwindVersion === 4
    //   ? [
    //       {
    //         name: "rs:tailwind-4",
    //         plugins: {},
    //         rules: {
    //           ...overrides,
    //         },
    //       },
    //     ]
    //   : []) satisfies FlatConfigItem[]),
  ];
}
