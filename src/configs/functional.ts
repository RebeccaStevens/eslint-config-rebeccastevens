import {
  type FlatConfigItem,
  type OptionsFunctional,
  type OptionsOverrides,
  type OptionsStylistic,
  type OptionsTypeScriptParserOptions,
} from "../types";
import { loadPackages } from "../utils";

import { defaultFilesTypesAware } from "./typescript";

export async function functional(
  options: Readonly<
    OptionsFunctional &
      OptionsStylistic &
      OptionsOverrides &
      OptionsTypeScriptParserOptions
  >,
): Promise<FlatConfigItem[]> {
  const {
    overrides = {},
    stylistic = true,
    filesTypeAware = defaultFilesTypesAware,
    functionalEnforcement = "none",
  } = options;

  if (functionalEnforcement === "none") {
    return [];
  }

  const [pluginFunctional] = (await loadPackages([
    "eslint-plugin-functional",
  ])) as [(typeof import("eslint-plugin-functional"))["default"]];

  const strictRules = {
    "functional/functional-parameters": "error",
    "functional/no-promise-reject": "error",
    "functional/no-throw-statements": "error",
    "functional/no-try-statements": "error",
    "functional/no-let": "error",
    "functional/no-classes": "error",
    "functional/no-this-expressions": "error",
    "functional/no-loop-statements": "error",
    "functional/immutable-data": "error",
    "functional/prefer-immutable-types": "error",
    "functional/prefer-readonly-type": "error",
    "functional/type-declaration-immutability": "error",
    "functional/no-mixed-types": "error",
    "functional/no-conditional-statements": "error",
    "functional/no-expression-statements": "error",
    "functional/no-return-void": "error",

    ...(stylistic === false
      ? {}
      : {
          "functional/prefer-property-signatures": "error",
          "functional/prefer-tacit": "error",
          "functional/readonly-type": "error",
        }),
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
        ignoreIdentifierPattern: ["^mutable", "^m_"],
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
      "warn",
      {
        enforcement: "None",
        ignoreInferredTypes: true,
        ignoreNamePattern: ["^[mM]_"],
        parameters: { enforcement: "ReadonlyShallow" },
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

    ...(stylistic === false
      ? {}
      : {
          "functional/prefer-property-signatures": "error",
          "functional/prefer-tacit": "error",
          "functional/readonly-type": "error",
        }),
  } satisfies FlatConfigItem["rules"];

  const liteRules = {
    ...recommendedRules,
    "functional/no-conditional-statements": "off",
    "functional/no-expression-statements": "off",
    "functional/no-return-void": "off",
  } satisfies FlatConfigItem["rules"];

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
        ...(functionalEnforcement === "lite"
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
