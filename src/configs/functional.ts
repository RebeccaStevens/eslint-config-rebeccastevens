import {
  type FlatConfigItem,
  type OptionsFunctional,
  type OptionsMode,
  type OptionsOverrides,
  type OptionsTypeScriptParserOptions,
  type RequiredOptionsStylistic,
} from "../types";
import { loadPackages } from "../utils";

export async function functional(
  options: Readonly<
    Required<
      OptionsFunctional &
        RequiredOptionsStylistic &
        OptionsOverrides &
        OptionsTypeScriptParserOptions &
        OptionsMode
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

  const stylisticEnforcement = stylistic === false ? "off" : "error";

  const [pluginFunctional] = (await loadPackages([
    "eslint-plugin-functional",
  ])) as [(typeof import("eslint-plugin-functional"))["default"]];

  const strictRules = {
    "functional/functional-parameters": "error",
    "functional/no-throw-statements": "error",
    "functional/no-try-statements": "error",
    "functional/no-let": "error",
    "functional/no-classes": "error",
    "functional/no-this-expressions": "error",
    "functional/no-loop-statements": "error",
    "functional/immutable-data": "error",
    "functional/prefer-immutable-types": "error",
    "functional/type-declaration-immutability": "error",
    "functional/no-mixed-types": "error",
    "functional/no-conditional-statements": "error",
    "functional/no-expression-statements": "error",
    "functional/no-return-void": "error",
    "functional/prefer-property-signatures": stylisticEnforcement,
    "functional/prefer-tacit": stylisticEnforcement,
    "functional/readonly-type": stylisticEnforcement,
  } satisfies FlatConfigItem["rules"];

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
        allowInAsyncFunctions: true,
      },
    ],

    "functional/immutable-data": [
      "error",
      {
        ignoreAccessorPattern: ["**.mutable*.**", "**.m_*.**"],
        ignoreClasses: "fieldsOnly",
        ignoreImmediateMutation: true,
        ignoreNonConstDeclarations: true,
      },
    ],
    "functional/no-conditional-statements": [
      "error",
      {
        allowReturningBranches: true,
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
    "functional/no-return-void": "error",
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
                pattern: "^(Array|Map|Set)<(.+)>$",
                replace: "Readonly$1<$2>",
              },
              { pattern: "^(.+)$", replace: "Readonly<$1>" },
            ],
          ],
          ReadonlyDeep: [
            [
              {
                pattern: "^(?:Readonly<(.+)>|(.+))$",
                replace: "ReadonlyDeep<$1$2>",
              },
            ],
          ],
          Immutable: [
            [
              {
                pattern: "^(?:Readonly(?:Deep)?<(.+)>|(.+))$",
                replace: "Immutable<$1$2>",
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

    "functional/prefer-property-signatures": stylisticEnforcement,
    "functional/prefer-tacit": stylisticEnforcement,
    "functional/readonly-type": stylisticEnforcement,
  } satisfies FlatConfigItem["rules"];

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
            ...recommendedRules["functional/prefer-immutable-types"][1]
              .overrides[0],
            specifiers: [
              {
                from: "file",
              },
            ],
          },
        ],
      },
    ],
  } satisfies FlatConfigItem["rules"];

  const noneLibraryRules = {
    "functional/prefer-immutable-types":
      liteRules["functional/prefer-immutable-types"],
  };

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
