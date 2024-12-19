import type {
  FlatConfigItem,
  OptionsFunctional,
  OptionsMode,
  OptionsOverrides,
  OptionsTypeScriptParserOptions,
  RequiredOptionsStylistic,
} from "../types";
import { loadPackages } from "../utils";

export async function functional(
  options: Readonly<
    Required<
      OptionsFunctional & RequiredOptionsStylistic & OptionsOverrides & OptionsTypeScriptParserOptions & OptionsMode
    >
  >,
): Promise<FlatConfigItem[]> {
  const {
    mode,
    overrides,
    stylistic,
    filesTypeAware,
    functionalEnforcement,
    ignoreNamePattern,
    // ignoreTypePattern,
  } = options;

  const [pluginFunctional] = (await loadPackages(["eslint-plugin-functional"])) as [
    (typeof import("eslint-plugin-functional"))["default"],
  ];

  const strictRules = {
    "functional/functional-parameters": "error",
    "functional/no-throw-statements": "error",
    "functional/no-try-statements": "error",
    "functional/no-let": "error",
    "functional/no-class-inheritance": "error",
    "functional/no-this-expressions": "error",
    "functional/no-loop-statements": "error",
    "functional/immutable-data": "error",
    "functional/prefer-immutable-types": "error",
    "functional/type-declaration-immutability": "error",
    "functional/no-mixed-types": "error",
    "functional/no-conditional-statements": [
      "error",
      {
        ignoreCodePattern: ["import.meta.vitest"],
      },
    ],
    "functional/no-expression-statements": "error",
    "functional/no-return-void": "error",
    "functional/prefer-property-signatures": stylistic === false ? "off" : "error",
    "functional/prefer-tacit": stylistic === false ? "off" : "warn",
    "functional/readonly-type": stylistic === false ? "off" : "error",
  } as const satisfies FlatConfigItem["rules"];

  const recommendedRules = {
    "functional/functional-parameters": [
      "error",
      {
        allowRestParameter: true,
        enforceParameterCount: false,
      },
    ],
    "functional/no-let": [
      "error",
      {
        allowInForLoopInit: true,
        ignoreIdentifierPattern: ignoreNamePattern,
      },
    ],
    "functional/no-loop-statements": "error",
    "functional/no-throw-statements": [
      "error",
      {
        allowToRejectPromises: true,
      },
    ],

    "functional/immutable-data": [
      "error",
      {
        ignoreAccessorPattern: ["**.mut_*.**"],
        ignoreClasses: "fieldsOnly",
        ignoreImmediateMutation: true,
        ignoreNonConstDeclarations: true,
      },
    ],
    "functional/no-conditional-statements": [
      "error",
      {
        allowReturningBranches: true,
        ignoreCodePattern: ["import.meta.vitest"],
      },
    ],
    "functional/no-expression-statements": [
      "error",
      {
        ignoreCodePattern: "^assert",
        ignoreSelfReturning: true,
        ignoreVoid: true,
      },
    ],
    "functional/no-return-void": mode === "library" ? "error" : "off",
    "ts/prefer-readonly-parameter-types": "off",
    "functional/prefer-immutable-types": [
      mode === "library" ? "warn" : "off",
      {
        enforcement: "None",
        overrides: [
          {
            specifiers: [
              {
                from: "file",
              },
              {
                from: "lib",
              },
            ],
            options: {
              ignoreInferredTypes: true,
              ignoreNamePattern,
              parameters: { enforcement: "ReadonlyShallow" },
            },
          },
        ],
        suggestions: {
          ReadonlyShallow: [
            [
              {
                pattern: "^([_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*\\[\\])$",
                replace: "readonly $1",
                message: "Prepend with readonly.",
              },
              {
                pattern: "^(Array|Map|Set)<(.+)>$",
                replace: "Readonly$1<$2>",
                message: "Use Readonly$1 instead of $1.",
              },
            ],
            [
              {
                pattern: "^(.+)$",
                replace: "Readonly<$1>",
                message: "Surround with Readonly.",
              },
            ],
          ],
          ReadonlyDeep: [
            [
              {
                pattern: "^(?:Readonly<(.+)>|(.+))$",
                replace: "ReadonlyDeep<$1$2>",
                message: "Surround with ReadonlyDeep.",
              },
            ],
          ],
          Immutable: [
            [
              {
                pattern: "^(?:Readonly(?:Deep)?<(.+)>|(.+))$",
                replace: "Immutable<$1$2>",
                message: "Surround with Immutable.",
              },
            ],
          ],
        },
      },
    ],
    "functional/type-declaration-immutability": [
      "error",
      {
        rules: [
          {
            identifiers: "I?Immutable.+",
            immutability: "Immutable",
            comparator: "AtLeast",
          },
          {
            identifiers: "I?ReadonlyDeep.+",
            immutability: "ReadonlyDeep",
            comparator: "AtLeast",
          },
          {
            identifiers: "I?Readonly.+",
            immutability: "ReadonlyShallow",
            comparator: "AtLeast",
            fixer: [
              {
                pattern: "^([_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*\\[\\])$",
                replace: "readonly $1",
              },
              {
                pattern: "^(Array|Map|Set)<(.+)>$",
                replace: "Readonly$1<$2>",
              },
              {
                pattern: "^(.+)$",
                replace: "Readonly<$1>",
              },
            ],
          },
          {
            identifiers: "I?Mutable.+",
            immutability: "Mutable",
            comparator: "AtMost",
            fixer: [
              {
                pattern: "^Readonly(Array|Map|Set)<(.+)>$",
                replace: "$1<$2>",
              },
              {
                pattern: "^Readonly<(.+)>$",
                replace: "$1",
              },
            ],
          },
        ],
      },
    ],

    "functional/prefer-property-signatures": stylistic === false ? "off" : "error",
    "functional/prefer-tacit": stylistic === false ? "off" : "warn",
    "functional/readonly-type": stylistic === false ? "off" : "error",
  } as const satisfies FlatConfigItem["rules"];

  const liteRules = {
    ...recommendedRules,
    "functional/no-conditional-statements": "off",
    "functional/no-expression-statements": "off",
    "functional/no-return-void": "off",
    "functional/prefer-immutable-types": [
      mode === "library" ? "warn" : "off",
      {
        ...recommendedRules["functional/prefer-immutable-types"][1],
        overrides: [
          {
            ...recommendedRules["functional/prefer-immutable-types"][1].overrides[0],
            specifiers: [
              {
                from: "file",
              },
            ],
          },
        ],
      },
    ],
  } as const satisfies FlatConfigItem["rules"];

  const noneLibraryRules = {
    "functional/prefer-immutable-types": liteRules["functional/prefer-immutable-types"],
    "functional/type-declaration-immutability": ["warn", liteRules["functional/type-declaration-immutability"][1]],
  } as const satisfies FlatConfigItem["rules"];

  return [
    {
      name: "rs:functional",
      plugins: {
        functional: pluginFunctional,
      },
      settings: {
        immutability: {
          overrides: [
            { type: "^Readonly<.+>$", to: "ReadonlyShallow" },
            { type: "^ReadonlyDeep<.+>$", to: "ReadonlyDeep" },
            { type: "^Immutable<.+>$", to: "Immutable" },
          ],
        },
      },
      rules: {
        ...pluginFunctional.configs.off.rules,
        ...(functionalEnforcement === "none"
          ? mode === "library"
            ? noneLibraryRules
            : {}
          : functionalEnforcement === "lite"
            ? liteRules
            : functionalEnforcement === "strict"
              ? strictRules
              : recommendedRules),
        ...overrides,
      },
    },
    {
      name: "rs:functional:disable-type-aware",
      ignores: filesTypeAware,
      rules: pluginFunctional.configs.disableTypeChecked.rules,
    },
  ];
}
