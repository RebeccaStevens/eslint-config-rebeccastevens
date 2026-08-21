import type { FlatConfigItem, OptionsOverrides } from "../types";
import { detectEngineNodeMajor, detectNodeMajor, loadPlugins } from "../utils";

export async function unicorn(options: OptionsOverrides & { projectRoot?: string } = {}): Promise<FlatConfigItem[]> {
  const { projectRoot = process.cwd(), overrides = {} } = options;
  const [pluginUnicorn] = await loadPlugins(["eslint-plugin-unicorn"]);

  const mut_engineNodeMajor = await detectEngineNodeMajor(projectRoot);
  const mut_localNodeMajor = await detectNodeMajor(projectRoot);

  // If local dev version is higher than engine version, we enable modern features on non-src files.
  const localSupportsNode20 = mut_localNodeMajor >= 20;
  const localSupportsNode22 = mut_localNodeMajor >= 22;
  const localSupportsNode23 = mut_localNodeMajor >= 23;

  const engineSupportsNode20 = mut_engineNodeMajor >= 20;
  const engineSupportsNode22 = mut_engineNodeMajor >= 22;
  const engineSupportsNode23 = mut_engineNodeMajor >= 23;

  const shouldOverrideNonSrc =
    (!engineSupportsNode20 && localSupportsNode20) ||
    (!engineSupportsNode22 && localSupportsNode22) ||
    (!engineSupportsNode23 && localSupportsNode23);

  return [
    {
      name: "rs:unicorn",
      plugins: {
        unicorn: pluginUnicorn,
      },
      rules: {
        ...(pluginUnicorn as { configs?: { recommended?: { rules?: Record<string, unknown> } } }).configs?.recommended
          ?.rules,

        // Specific overrides
        "unicorn/filename-case": [
          "error",
          {
            cases: { kebabCase: true, pascalCase: true },
            ignore: [String.raw`^.*\.md$`, "FUNDING.yml"],
          },
        ],
        "unicorn/import-style": [
          "error",
          {
            extendDefaultStyles: false,
            styles: { typescript: { default: true, named: true } },
          },
        ],
        "unicorn/no-instanceof-builtins": [
          "error",
          {
            strategy: "strict",
            useErrorIsError: true,
          },
        ],
        "unicorn/prefer-at": ["error", { checkAllIndexAccess: false }],

        // Explicitly disabled rules
        "unicorn/no-anonymous-default-export": "off", // https://github.com/sindresorhus/eslint-plugin-unicorn/issues/2302
        "unicorn/no-await-in-promise-methods": "off", // https://github.com/sindresorhus/eslint-plugin-unicorn/issues/2302
        "unicorn/no-single-promise-in-promise-methods": "off", // https://github.com/sindresorhus/eslint-plugin-unicorn/issues/2302
        "unicorn/no-useless-spread": "off", // https://github.com/sindresorhus/eslint-plugin-unicorn/issues/2018
        "unicorn/prefer-module": "off",

        // Disabling overly strict or noisy recommended rules
        "unicorn/name-replacements": "off",
        "unicorn/no-non-function-verb-prefix": "off",
        "unicorn/no-null": "off",
        "unicorn/no-top-level-side-effects": "off",
        "unicorn/no-unsafe-property-key": "off",
        "unicorn/no-useless-undefined": "off",
        "unicorn/prefer-await": "off",
        "unicorn/prefer-string-raw": "off",
        "unicorn/single-line-block-comment-style": "off",
        "unicorn/consistent-boolean-name": "off",
        "unicorn/consistent-conditional-object-spread": "off",
        "unicorn/no-array-callback-reference": "off",
        "unicorn/no-array-reduce": "off",
        "unicorn/no-break-in-nested-loop": "off",
        "unicorn/no-computed-property-existence-check": "off",
        "unicorn/no-top-level-assignment-in-function": "off",
        "unicorn/no-unreadable-array-destructuring": "off",
        "unicorn/prefer-promise-with-resolvers": "off",
        "unicorn/prevent-abbreviations": "off",

        // Node >= 20 feature: Array#toSorted()
        ...(engineSupportsNode20 ? {} : { "unicorn/no-array-sort": "off" }),

        // Node >= 22 features: Iterator helpers & Set methods
        ...(engineSupportsNode22
          ? {}
          : {
              "unicorn/prefer-iterator-helpers": "off",
              "unicorn/prefer-iterator-to-array": "off",
              "unicorn/prefer-set-methods": "off",
            }),

        // Node >= 23 / 22.14 features: Promise.try()
        ...(engineSupportsNode23 ? {} : { "unicorn/prefer-promise-try": "off" }),

        ...overrides,
      },
    },
    ...(shouldOverrideNonSrc
      ? [
          {
            name: "rs:unicorn:version-override-non-src",
            ignores: ["src/**", "**/src/**"],
            rules: {
              ...(!engineSupportsNode20 && localSupportsNode20 ? { "unicorn/no-array-sort": "error" as const } : {}),
              ...(!engineSupportsNode22 && localSupportsNode22
                ? {
                    "unicorn/prefer-iterator-helpers": "error" as const,
                    "unicorn/prefer-iterator-to-array": "error" as const,
                    "unicorn/prefer-set-methods": "error" as const,
                  }
                : {}),
              ...(!engineSupportsNode23 && localSupportsNode23
                ? { "unicorn/prefer-promise-try": "error" as const }
                : {}),
            },
          },
        ]
      : []),
  ];
}
