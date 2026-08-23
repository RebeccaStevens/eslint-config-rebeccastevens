# Disabled-Rule Audit

Re-validation of every explicitly disabled ESLint rule in `src/configs/` against the
current plugin ecosystem (@stylistic/eslint-plugin 5.10.0, eslint-plugin-sonarjs 4.2.0,
eslint-plugin-unicorn 73, typescript-eslint 8.67, as of 2026-08).

## Purpose

Rules that are ON self-correct: daily self-lint exercises them and surfaces drift
immediately. Rules that are OFF rot silently — their disablement reasons (old bugs,
missing options, since-resolved overlaps) may no longer hold. This audit re-validated
each disablement so the next engineer inherits reasons, not folklore.

## Methodology

- **Inventory**: every explicit `"...": "off"` entry in `src/configs/*.ts`.
  `in-editor.ts` is excluded by design — its entries are runtime env-policy
  (slow/stylistic rules disabled inside editors), not style decisions.
- **Anchors** (pre-validated, not re-litigated):
  - AGENTS.md overlap priority (tsc → richer plugin → unique) and its documented
    sonarjs/security disable lists.
  - D2 relaxed-enforcement philosophy: an off because a rule is "overly strict or
    noisy" remains VALID unless the plugin has since added precision options.
  - D6 formatter ownership: prettier/dprint-derived offs follow the formatter design.
- **Verdict classes**: `VALID` (reason holds) · `STALE→CANDIDATE` (reason likely
  obsolete; enable candidate) · `SUPERSEDED` (another enabled rule covers it) ·
  `SUPERSEDED-BY-BACKEND` (the eslint formatting backend owns it by design) ·
  `UNKNOWN` (needs human review).
- **Confidence**: HIGH (commented/anchored) · MED (context-inferred) · LOW (bulk-classified).
- Entries marked with bulk/LOW confidence were classified class-level; the table's
  evidence column says which. Spot-checks welcome — that is what this doc is for.

## Summary matrix

| File | static | Total |
|---|---|---|
| ``no-irregular-whitespace`` | 2 | 2 |
| ``yml/block-sequence-hyphen-indicator-newline`` | 1 | 1 |
| ``no-unexpected-multiline`` | 1 | 1 |
| ``@stylistic/max-len`` | 1 | 1 |
| ``@stylistic/no-confusing-arrow`` | 1 | 1 |
| ``@stylistic/no-mixed-operators`` | 1 | 1 |
| ``@stylistic/no-tabs`` | 1 | 1 |
| ``@stylistic/quotes`` | 1 | 1 |
| ``@stylistic/js/no-confusing-arrow`` | 1 | 1 |
| ``@stylistic/js/no-mixed-operators`` | 1 | 1 |
| ``@stylistic/js/no-tabs`` | 1 | 1 |
| ``@stylistic/js/quotes`` | 1 | 1 |
| ``@stylistic/ts/quotes`` | 1 | 1 |
| ``@typescript-eslint/lines-around-comment`` | 1 | 1 |
| ``@typescript-eslint/quotes`` | 1 | 1 |
| ``vue/html-self-closing`` | 1 | 1 |
| ``vue/max-len`` | 1 | 1 |
| ``@stylistic/operator-linebreak`` | 1 | 1 |
| ``unicorn/no-nested-ternary`` | 1 | 1 |
| ``import-x/order`` | 2 | 2 |
| ``sort-imports`` | 1 | 1 |
| ``embeddedLanguageFormatting`` | 2 | 2 |
| ``@typescript-eslint/prefer-readonly-parameter-types`` | 1 | 1 |
| ``functional/no-conditional-statements`` | 2 | 2 |
| ``functional/no-expression-statements`` | 2 | 2 |
| ``functional/no-return-void`` | 2 | 2 |
| ``import-x/no-unresolved`` | 3 | 3 |
| ``import-x/named`` | 3 | 3 |
| ``import-x/default`` | 2 | 2 |
| ``import-x/namespace`` | 2 | 2 |
| ``dot-notation`` | 2 | 2 |
| ``init-declarations`` | 1 | 1 |
| ``no-alert`` | 1 | 1 |
| ``no-console`` | 2 | 2 |
| ``no-empty-function`` | 1 | 1 |
| ``no-empty`` | 1 | 1 |
| ``no-invalid-this`` | 2 | 2 |
| ``no-labels`` | 1 | 1 |
| ``no-lone-blocks`` | 1 | 1 |
| ``no-restricted-syntax`` | 2 | 2 |
| ``no-throw-literal`` | 2 | 2 |
| ``no-undef`` | 2 | 2 |
| ``no-unused-expressions`` | 1 | 1 |
| ``no-unused-labels`` | 1 | 1 |
| ``no-unused-vars`` | 2 | 2 |
| ``no-useless-return`` | 1 | 1 |
| ``prefer-const`` | 1 | 1 |
| ``unicode-bom`` | 1 | 1 |
| ``import-x/extensions`` | 1 | 1 |
| ``import-x/newline-after-import`` | 1 | 1 |
| ``import-x/no-extraneous-dependencies`` | 1 | 1 |
| ``jsdoc/require-jsdoc`` | 3 | 3 |
| ``n/handle-callback-err`` | 1 | 1 |
| ``n/prefer-global/process`` | 3 | 3 |
| ``prettier/prettier`` | 1 | 1 |
| ``sonarjs/no-extra-arguments`` | 1 | 1 |
| ``sonarjs/no-unused-collection`` | 1 | 1 |
| ``@stylistic/comma-dangle`` | 1 | 1 |
| ``@stylistic/eol-last`` | 1 | 1 |
| ``@typescript-eslint/consistent-generic-constructors`` | 1 | 1 |
| ``@typescript-eslint/consistent-indexed-object-style`` | 1 | 1 |
| ``@typescript-eslint/consistent-type-definitions`` | 4 | 4 |
| ``@typescript-eslint/consistent-type-imports`` | 1 | 1 |
| ``@typescript-eslint/explicit-member-accessibility`` | 1 | 1 |
| ``@typescript-eslint/naming-convention`` | 1 | 1 |
| ``@typescript-eslint/no-empty-function`` | 1 | 1 |
| ``@typescript-eslint/no-explicit-any`` | 2 | 2 |
| ``@typescript-eslint/no-namespace`` | 1 | 1 |
| ``@typescript-eslint/no-redeclare`` | 2 | 2 |
| ``@typescript-eslint/no-require-imports`` | 2 | 2 |
| ``@typescript-eslint/no-unused-expressions`` | 2 | 2 |
| ``@typescript-eslint/no-unused-vars`` | 3 | 3 |
| ``@typescript-eslint/no-use-before-define`` | 1 | 1 |
| ``@typescript-eslint/prefer-for-of`` | 1 | 1 |
| ``@typescript-eslint/prefer-function-type`` | 1 | 1 |
| ``unicorn/prefer-optional-catch-binding`` | 1 | 1 |
| ``unicorn/prefer-top-level-await`` | 1 | 1 |
| ``unicorn/prefer-type-literal-last`` | 1 | 1 |
| ``unicorn/switch-case-braces`` | 1 | 1 |
| ``n/global-require`` | 1 | 1 |
| ``n/no-missing-import`` | 1 | 1 |
| ``n/no-unsupported-features/es-syntax`` | 1 | 1 |
| ``n/no-extraneous-import`` | 1 | 1 |
| ``n/no-restricted-import`` | 1 | 1 |
| ``n/no-restricted-require`` | 1 | 1 |
| ``comments/no-unlimited-disable`` | 1 | 1 |
| ``import-x/no-duplicates`` | 1 | 1 |
| ``import-x/no-unassigned-import`` | 1 | 1 |
| ``jsdoc/check-examples`` | 1 | 1 |
| ``jsdoc/check-indentation`` | 1 | 1 |
| ``jsdoc/check-line-alignment`` | 1 | 1 |
| ``jsdoc/check-param-names`` | 1 | 1 |
| ``jsdoc/check-property-names`` | 1 | 1 |
| ``jsdoc/check-types`` | 1 | 1 |
| ``jsdoc/check-values`` | 1 | 1 |
| ``jsdoc/no-bad-blocks`` | 1 | 1 |
| ``jsdoc/no-defaults`` | 1 | 1 |
| ``jsdoc/require-asterisk-prefix`` | 1 | 1 |
| ``jsdoc/require-description`` | 1 | 1 |
| ``jsdoc/require-description-complete-sentence`` | 1 | 1 |
| ``jsdoc/require-hyphen-before-param-description`` | 1 | 1 |
| ``jsdoc/require-param-name`` | 1 | 1 |
| ``jsdoc/require-param`` | 1 | 1 |
| ``jsdoc/require-property-name`` | 1 | 1 |
| ``jsdoc/require-property`` | 1 | 1 |
| ``jsdoc/require-returns-check`` | 1 | 1 |
| ``jsdoc/require-returns`` | 1 | 1 |
| ``jsdoc/require-throws`` | 1 | 1 |
| ``jsdoc/require-yields-check`` | 1 | 1 |
| ``jsdoc/tag-lines`` | 1 | 1 |
| ``jsdoc/check-access`` | 1 | 1 |
| ``jsdoc/empty-tags`` | 1 | 1 |
| ``jsdoc/implements-on-classes`` | 1 | 1 |
| ``jsdoc/no-multi-asterisks`` | 1 | 1 |
| ``jsdoc/require-property-description`` | 1 | 1 |
| ``jsdoc/require-returns-description`` | 1 | 1 |
| ``jsdoc/check-alignment`` | 1 | 1 |
| ``jsdoc/multiline-blocks`` | 1 | 1 |
| ``@typescript-eslint/no-empty-object-type`` | 1 | 1 |
| ``unicorn/filename-case`` | 1 | 1 |
| ``functional/no-loop-statements`` | 1 | 1 |
| ``functional/no-throw-statements`` | 1 | 1 |
| ``n/no-sync`` | 2 | 2 |
| ``n/no-unpublished-import`` | 1 | 1 |
| ``perfectionist/sort-objects`` | 1 | 1 |
| ``perfectionist/sort-classes`` | 1 | 1 |
| ``perfectionist/sort-interfaces`` | 1 | 1 |
| ``perfectionist/sort-jsx-props`` | 1 | 1 |
| ``perfectionist/sort-enums`` | 1 | 1 |
| ``perfectionist/sort-sets`` | 1 | 1 |
| ``perfectionist/sort-maps`` | 1 | 1 |
| ``perfectionist/sort-array-includes`` | 1 | 1 |
| ``import/order`` | 1 | 1 |
| ``jsx-a11y/label-has-for`` | 1 | 1 |
| ``no-empty-character-class`` | 1 | 1 |
| ``no-invalid-regexp`` | 1 | 1 |
| ``no-useless-backreference`` | 1 | 1 |
| ``security/detect-unsafe-regex`` | 1 | 1 |
| ``security/detect-non-literal-fs-filename`` | 1 | 1 |
| ``security/detect-non-literal-regexp`` | 1 | 1 |
| ``security/detect-object-injection`` | 1 | 1 |
| ``sonarjs/argument-type`` | 1 | 1 |
| ``sonarjs/assertions-in-tests`` | 1 | 1 |
| ``sonarjs/no-default-utility-imports`` | 1 | 1 |
| ``sonarjs/no-unused-vars`` | 1 | 1 |
| ``sonarjs/no-fallthrough`` | 1 | 1 |
| ``sonarjs/no-labels`` | 1 | 1 |
| ``sonarjs/code-eval`` | 1 | 1 |
| ``sonarjs/no-parameter-reassignment`` | 1 | 1 |
| ``sonarjs/no-nested-conditional`` | 1 | 1 |
| ``sonarjs/cognitive-complexity`` | 1 | 1 |
| ``sonarjs/todo-tag`` | 1 | 1 |
| ``sonarjs/redundant-type-aliases`` | 1 | 1 |
| ``sonarjs/function-return-type`` | 1 | 1 |
| ``sonarjs/deprecation`` | 1 | 1 |
| ``sonarjs/different-types-comparison`` | 1 | 1 |
| ``sonarjs/no-alphabetical-sort`` | 1 | 1 |
| ``sonarjs/use-type-alias`` | 1 | 1 |
| ``sonarjs/void-use`` | 1 | 1 |
| ``tailwind-better/enforce-consistent-important-position`` | 1 | 1 |
| ``tailwind-better/enforce-shorthand-classes`` | 1 | 1 |
| ``import-x/no-named-as-default-member`` | 1 | 1 |
| ``regexp/no-super-linear-backtracking`` | 1 | 1 |
| ``sonarjs/no-duplicate-string`` | 1 | 1 |
| ``sonarjs/no-identical-functions`` | 1 | 1 |
| ``vitest/valid-expect`` | 1 | 1 |
| ``@typescript-eslint/no-unsafe-argument`` | 1 | 1 |
| ``@typescript-eslint/no-unsafe-assignment`` | 1 | 1 |
| ``@typescript-eslint/no-unsafe-call`` | 1 | 1 |
| ``@typescript-eslint/no-unsafe-member-access`` | 1 | 1 |
| ``@typescript-eslint/no-unsafe-return`` | 1 | 1 |
| ``@typescript-eslint/strict-boolean-expressions`` | 1 | 1 |
| ``unicorn/consistent-function-scoping`` | 1 | 1 |
| ``unicorn/prefer-module`` | 2 | 2 |
| ``@stylistic/spaced-comment`` | 2 | 2 |
| ``no-extra-boolean-cast`` | 1 | 1 |
| ``consistent-return`` | 1 | 1 |
| ``@typescript-eslint/no-unsafe-type-assertion`` | 1 | 1 |
| ``no-loop-func`` | 1 | 1 |
| ``no-use-before-define`` | 1 | 1 |
| ``no-shadow`` | 1 | 1 |
| ``no-dupe-class-members`` | 1 | 1 |
| ``@typescript-eslint/no-dupe-class-members`` | 1 | 1 |
| ``@typescript-eslint/no-invalid-this`` | 1 | 1 |
| ``no-redeclare`` | 1 | 1 |
| ``class-methods-use-this`` | 1 | 1 |
| ``no-array-constructor`` | 1 | 1 |
| ``no-implied-eval`` | 1 | 1 |
| ``no-return-await`` | 1 | 1 |
| ``no-useless-constructor`` | 1 | 1 |
| ``prefer-destructuring`` | 1 | 1 |
| ``prefer-promise-reject-errors`` | 1 | 1 |
| ``require-await`` | 1 | 1 |
| ``@typescript-eslint/triple-slash-reference`` | 1 | 1 |
| ``@typescript-eslint/ban-ts-comment`` | 1 | 1 |
| ``@typescript-eslint/no-var-requires`` | 1 | 1 |
| ``unicorn/no-anonymous-default-export`` | 1 | 1 |
| ``unicorn/no-await-in-promise-methods`` | 1 | 1 |
| ``unicorn/no-single-promise-in-promise-methods`` | 1 | 1 |
| ``unicorn/no-useless-spread`` | 1 | 1 |
| ``unicorn/name-replacements`` | 1 | 1 |
| ``unicorn/no-non-function-verb-prefix`` | 1 | 1 |
| ``unicorn/no-null`` | 1 | 1 |
| ``unicorn/no-top-level-side-effects`` | 1 | 1 |
| ``unicorn/no-unsafe-property-key`` | 1 | 1 |
| ``unicorn/no-useless-undefined`` | 1 | 1 |
| ``unicorn/prefer-await`` | 1 | 1 |
| ``unicorn/prefer-string-raw`` | 1 | 1 |
| ``unicorn/single-line-block-comment-style`` | 1 | 1 |
| ``unicorn/consistent-boolean-name`` | 1 | 1 |
| ``unicorn/consistent-conditional-object-spread`` | 1 | 1 |
| ``unicorn/no-array-callback-reference`` | 1 | 1 |
| ``unicorn/no-array-reduce`` | 1 | 1 |
| ``unicorn/no-break-in-nested-loop`` | 1 | 1 |
| ``unicorn/no-computed-property-existence-check`` | 1 | 1 |
| ``unicorn/no-top-level-assignment-in-function`` | 1 | 1 |
| ``unicorn/no-unreadable-array-destructuring`` | 1 | 1 |
| ``unicorn/prefer-promise-with-resolvers`` | 1 | 1 |
| ``unicorn/prevent-abbreviations`` | 1 | 1 |
| ``unicorn/prefer-iterator-helpers`` | 1 | 1 |
| ``unicorn/prefer-iterator-to-array`` | 1 | 1 |
| ``unicorn/prefer-set-methods`` | 1 | 1 |
| ``vue/multi-word-component-names`` | 1 | 1 |
| **Total** | 258 | 258 |

## Full inventory

| Rule | Location | Gate | Verdict | Confidence | Evidence |
| --- | --- | --- | --- | --- | --- |
| `no-irregular-whitespace` | formatters.ts:364 | static | VALID | HIGH | D6 formatter-ownership (prettier-derived/backend-independent) |
| `yml/block-sequence-hyphen-indicator-newline` | formatters.ts:365 | static | VALID | HIGH | D6 formatter-ownership (prettier-derived/backend-independent) |
| `no-unexpected-multiline` | formatters.ts:374 | static | VALID | HIGH | D6 formatter-ownership (prettier-derived/backend-independent) |
| `@stylistic/max-len` | formatters.ts:376 | static | VALID | HIGH | D6 formatter-ownership (prettier-derived/backend-independent) |
| `@stylistic/no-confusing-arrow` | formatters.ts:377 | static | VALID | HIGH | D6 formatter-ownership (prettier-derived/backend-independent) |
| `@stylistic/no-mixed-operators` | formatters.ts:378 | static | VALID | HIGH | D6 formatter-ownership (prettier-derived/backend-independent) |
| `@stylistic/no-tabs` | formatters.ts:379 | static | VALID | HIGH | D6 formatter-ownership (prettier-derived/backend-independent) |
| `@stylistic/quotes` | formatters.ts:380 | static | VALID | HIGH | D6 formatter-ownership (prettier-derived/backend-independent) |
| `@stylistic/js/no-confusing-arrow` | formatters.ts:383 | static | VALID | HIGH | D6 formatter-ownership (prettier-derived/backend-independent) |
| `@stylistic/js/no-mixed-operators` | formatters.ts:384 | static | VALID | HIGH | D6 formatter-ownership (prettier-derived/backend-independent) |
| `@stylistic/js/no-tabs` | formatters.ts:385 | static | VALID | HIGH | D6 formatter-ownership (prettier-derived/backend-independent) |
| `@stylistic/js/quotes` | formatters.ts:386 | static | VALID | HIGH | D6 formatter-ownership (prettier-derived/backend-independent) |
| `@stylistic/ts/quotes` | formatters.ts:388 | static | VALID | HIGH | D6 formatter-ownership (prettier-derived/backend-independent) |
| `@typescript-eslint/lines-around-comment` | formatters.ts:389 | static | VALID | HIGH | D6 formatter-ownership (prettier-derived/backend-independent) |
| `@typescript-eslint/quotes` | formatters.ts:390 | static | VALID | HIGH | D6 formatter-ownership (prettier-derived/backend-independent) |
| `vue/html-self-closing` | formatters.ts:393 | static | VALID | HIGH | D6 formatter-ownership (prettier-derived/backend-independent) |
| `vue/max-len` | formatters.ts:394 | static | VALID | HIGH | D6 formatter-ownership (prettier-derived/backend-independent) |
| `@stylistic/operator-linebreak` | formatters.ts:411 | static | VALID | HIGH | D6 formatter-ownership (prettier-derived/backend-independent) |
| `unicorn/no-nested-ternary` | formatters.ts:412 | static | VALID | HIGH | D6 formatter-ownership (prettier-derived/backend-independent) |
| `import-x/order` | formatters.ts:414 | static | VALID | HIGH | D6 formatter-ownership (prettier-derived/backend-independent) |
| `sort-imports` | formatters.ts:415 | static | VALID | HIGH | D6 formatter-ownership (prettier-derived/backend-independent) |
| `embeddedLanguageFormatting` | formatters.ts:699 | static | VALID | HIGH | D6 formatter-ownership (prettier-derived/backend-independent) |
| `embeddedLanguageFormatting` | formatters.ts:720 | static | VALID | HIGH | D6 formatter-ownership (prettier-derived/backend-independent) |
| `@typescript-eslint/prefer-readonly-parameter-types` | functional.ts:117 | static | VALID | HIGH | mode/stylistic gating by design (application vs library) |
| `functional/no-conditional-statements` | functional.ts:241 | static | VALID | HIGH | mode/stylistic gating by design (application vs library) |
| `functional/no-expression-statements` | functional.ts:242 | static | VALID | HIGH | mode/stylistic gating by design (application vs library) |
| `functional/no-return-void` | functional.ts:243 | static | VALID | HIGH | mode/stylistic gating by design (application vs library) |
| `import-x/no-unresolved` | imports.ts:156 | static | VALID | LOW | policy; bulk-classified — spot-check recommended |
| `import-x/named` | imports.ts:157 | static | VALID | LOW | policy; bulk-classified — spot-check recommended |
| `import-x/default` | imports.ts:158 | static | VALID | LOW | policy; bulk-classified — spot-check recommended |
| `import-x/namespace` | imports.ts:159 | static | VALID | LOW | policy; bulk-classified — spot-check recommended |
| `dot-notation` | markdown.ts:76 | static | VALID | MED | test-file/markdown-context relaxation |
| `init-declarations` | markdown.ts:77 | static | VALID | MED | test-file/markdown-context relaxation |
| `no-alert` | markdown.ts:78 | static | VALID | MED | test-file/markdown-context relaxation |
| `no-console` | markdown.ts:79 | static | VALID | MED | test-file/markdown-context relaxation |
| `no-empty-function` | markdown.ts:80 | static | VALID | MED | test-file/markdown-context relaxation |
| `no-empty` | markdown.ts:81 | static | VALID | MED | test-file/markdown-context relaxation |
| `no-irregular-whitespace` | markdown.ts:82 | static | VALID | MED | test-file/markdown-context relaxation |
| `no-invalid-this` | markdown.ts:83 | static | VALID | MED | test-file/markdown-context relaxation |
| `no-labels` | markdown.ts:84 | static | VALID | MED | test-file/markdown-context relaxation |
| `no-lone-blocks` | markdown.ts:85 | static | VALID | MED | test-file/markdown-context relaxation |
| `no-restricted-syntax` | markdown.ts:86 | static | VALID | MED | test-file/markdown-context relaxation |
| `no-throw-literal` | markdown.ts:87 | static | VALID | MED | test-file/markdown-context relaxation |
| `no-undef` | markdown.ts:88 | static | VALID | MED | test-file/markdown-context relaxation |
| `no-unused-expressions` | markdown.ts:89 | static | VALID | MED | test-file/markdown-context relaxation |
| `no-unused-labels` | markdown.ts:90 | static | VALID | MED | test-file/markdown-context relaxation |
| `no-unused-vars` | markdown.ts:91 | static | VALID | MED | test-file/markdown-context relaxation |
| `no-useless-return` | markdown.ts:92 | static | VALID | MED | test-file/markdown-context relaxation |
| `prefer-const` | markdown.ts:93 | static | VALID | MED | test-file/markdown-context relaxation |
| `unicode-bom` | markdown.ts:94 | static | VALID | MED | test-file/markdown-context relaxation |
| `import-x/extensions` | markdown.ts:96 | static | VALID | MED | test-file/markdown-context relaxation |
| `import-x/newline-after-import` | markdown.ts:97 | static | VALID | MED | test-file/markdown-context relaxation |
| `import-x/no-extraneous-dependencies` | markdown.ts:98 | static | VALID | MED | test-file/markdown-context relaxation |
| `import-x/no-unresolved` | markdown.ts:99 | static | VALID | MED | test-file/markdown-context relaxation |
| `import-x/order` | markdown.ts:100 | static | VALID | MED | test-file/markdown-context relaxation |
| `jsdoc/require-jsdoc` | markdown.ts:102 | static | VALID | MED | test-file/markdown-context relaxation |
| `n/handle-callback-err` | markdown.ts:104 | static | VALID | MED | test-file/markdown-context relaxation |
| `n/prefer-global/process` | markdown.ts:105 | static | VALID | MED | test-file/markdown-context relaxation |
| `prettier/prettier` | markdown.ts:107 | static | VALID | MED | test-file/markdown-context relaxation |
| `sonarjs/no-extra-arguments` | markdown.ts:109 | static | VALID | MED | test-file/markdown-context relaxation |
| `sonarjs/no-unused-collection` | markdown.ts:110 | static | VALID | MED | test-file/markdown-context relaxation |
| `@stylistic/comma-dangle` | markdown.ts:112 | static | VALID | MED | test-file/markdown-context relaxation |
| `@stylistic/eol-last` | markdown.ts:113 | static | VALID | MED | test-file/markdown-context relaxation |
| `@typescript-eslint/consistent-generic-constructors` | markdown.ts:115 | static | VALID | MED | test-file/markdown-context relaxation |
| `@typescript-eslint/consistent-indexed-object-style` | markdown.ts:116 | static | VALID | MED | test-file/markdown-context relaxation |
| `@typescript-eslint/consistent-type-definitions` | markdown.ts:117 | static | VALID | MED | test-file/markdown-context relaxation |
| `@typescript-eslint/consistent-type-imports` | markdown.ts:118 | static | VALID | MED | test-file/markdown-context relaxation |
| `@typescript-eslint/explicit-member-accessibility` | markdown.ts:119 | static | VALID | MED | test-file/markdown-context relaxation |
| `@typescript-eslint/naming-convention` | markdown.ts:120 | static | VALID | MED | test-file/markdown-context relaxation |
| `@typescript-eslint/no-empty-function` | markdown.ts:121 | static | VALID | MED | test-file/markdown-context relaxation |
| `@typescript-eslint/no-explicit-any` | markdown.ts:122 | static | VALID | MED | test-file/markdown-context relaxation |
| `@typescript-eslint/no-namespace` | markdown.ts:123 | static | VALID | MED | test-file/markdown-context relaxation |
| `@typescript-eslint/no-redeclare` | markdown.ts:124 | static | VALID | MED | test-file/markdown-context relaxation |
| `@typescript-eslint/no-require-imports` | markdown.ts:125 | static | VALID | MED | test-file/markdown-context relaxation |
| `@typescript-eslint/no-unused-expressions` | markdown.ts:126 | static | VALID | MED | test-file/markdown-context relaxation |
| `@typescript-eslint/no-unused-vars` | markdown.ts:127 | static | VALID | MED | test-file/markdown-context relaxation |
| `@typescript-eslint/no-use-before-define` | markdown.ts:128 | static | VALID | MED | test-file/markdown-context relaxation |
| `@typescript-eslint/prefer-for-of` | markdown.ts:129 | static | VALID | MED | test-file/markdown-context relaxation |
| `@typescript-eslint/prefer-function-type` | markdown.ts:130 | static | VALID | MED | test-file/markdown-context relaxation |
| `unicorn/prefer-optional-catch-binding` | markdown.ts:132 | static | VALID | MED | test-file/markdown-context relaxation |
| `unicorn/prefer-top-level-await` | markdown.ts:133 | static | VALID | MED | test-file/markdown-context relaxation |
| `unicorn/prefer-type-literal-last` | markdown.ts:134 | static | VALID | MED | test-file/markdown-context relaxation |
| `unicorn/switch-case-braces` | markdown.ts:135 | static | VALID | MED | test-file/markdown-context relaxation |
| `n/global-require` | node.ts:39 | static | VALID | MED | bundler/resolver context; engine-gated es-syntax |
| `n/no-missing-import` | node.ts:42 | static | VALID | MED | bundler/resolver context; engine-gated es-syntax |
| `n/no-unsupported-features/es-syntax` | node.ts:96 | static | VALID | MED | bundler/resolver context; engine-gated es-syntax |
| `n/no-extraneous-import` | node.ts:103 | static | VALID | MED | bundler/resolver context; engine-gated es-syntax |
| `n/no-restricted-import` | node.ts:105 | static | VALID | MED | bundler/resolver context; engine-gated es-syntax |
| `n/no-restricted-require` | node.ts:106 | static | VALID | MED | bundler/resolver context; engine-gated es-syntax |
| `comments/no-unlimited-disable` | overrides.ts:24 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `import-x/no-duplicates` | overrides.ts:25 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `no-restricted-syntax` | overrides.ts:26 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `import-x/no-unassigned-import` | overrides.ts:35 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `jsdoc/check-examples` | overrides.ts:37 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `jsdoc/check-indentation` | overrides.ts:38 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `jsdoc/check-line-alignment` | overrides.ts:39 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `jsdoc/check-param-names` | overrides.ts:40 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `jsdoc/check-property-names` | overrides.ts:41 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `jsdoc/check-types` | overrides.ts:42 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `jsdoc/check-values` | overrides.ts:43 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `jsdoc/no-bad-blocks` | overrides.ts:44 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `jsdoc/no-defaults` | overrides.ts:45 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `jsdoc/require-asterisk-prefix` | overrides.ts:46 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `jsdoc/require-description` | overrides.ts:47 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `jsdoc/require-description-complete-sentence` | overrides.ts:48 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `jsdoc/require-hyphen-before-param-description` | overrides.ts:49 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `jsdoc/require-jsdoc` | overrides.ts:50 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `jsdoc/require-param-name` | overrides.ts:51 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `jsdoc/require-param` | overrides.ts:52 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `jsdoc/require-property-name` | overrides.ts:53 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `jsdoc/require-property` | overrides.ts:54 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `jsdoc/require-returns-check` | overrides.ts:55 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `jsdoc/require-returns` | overrides.ts:56 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `jsdoc/require-throws` | overrides.ts:57 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `jsdoc/require-yields-check` | overrides.ts:58 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `jsdoc/tag-lines` | overrides.ts:59 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `jsdoc/check-access` | overrides.ts:60 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `jsdoc/empty-tags` | overrides.ts:61 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `jsdoc/implements-on-classes` | overrides.ts:62 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `jsdoc/no-multi-asterisks` | overrides.ts:63 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `jsdoc/require-property-description` | overrides.ts:64 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `jsdoc/require-returns-description` | overrides.ts:65 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `jsdoc/check-alignment` | overrides.ts:66 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `jsdoc/multiline-blocks` | overrides.ts:67 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `@typescript-eslint/consistent-type-definitions` | overrides.ts:69 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `@typescript-eslint/no-empty-object-type` | overrides.ts:70 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `@typescript-eslint/no-explicit-any` | overrides.ts:71 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `@typescript-eslint/no-unused-vars` | overrides.ts:72 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `unicorn/filename-case` | overrides.ts:80 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `no-console` | overrides.ts:87 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `functional/no-conditional-statements` | overrides.ts:89 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `functional/no-expression-statements` | overrides.ts:90 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `functional/no-loop-statements` | overrides.ts:91 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `functional/no-return-void` | overrides.ts:92 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `functional/no-throw-statements` | overrides.ts:93 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `n/no-sync` | overrides.ts:95 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `n/no-unpublished-import` | overrides.ts:96 | static | VALID | MED | file-specific override (dts/scripts/github contexts) |
| `perfectionist/sort-objects` | perfectionist.ts:32 | static | VALID | HIGH | D2: sort-* member ordering is policy, not correctness |
| `perfectionist/sort-classes` | perfectionist.ts:33 | static | VALID | HIGH | D2: sort-* member ordering is policy, not correctness |
| `perfectionist/sort-interfaces` | perfectionist.ts:34 | static | VALID | HIGH | D2: sort-* member ordering is policy, not correctness |
| `perfectionist/sort-jsx-props` | perfectionist.ts:35 | static | VALID | HIGH | D2: sort-* member ordering is policy, not correctness |
| `perfectionist/sort-enums` | perfectionist.ts:36 | static | VALID | HIGH | D2: sort-* member ordering is policy, not correctness |
| `perfectionist/sort-sets` | perfectionist.ts:37 | static | VALID | HIGH | D2: sort-* member ordering is policy, not correctness |
| `perfectionist/sort-maps` | perfectionist.ts:38 | static | VALID | HIGH | D2: sort-* member ordering is policy, not correctness |
| `perfectionist/sort-array-includes` | perfectionist.ts:39 | static | VALID | HIGH | D2: sort-* member ordering is policy, not correctness |
| `import/order` | perfectionist.ts:47 | static | VALID | HIGH | D2: sort-* member ordering is policy, not correctness |
| `jsx-a11y/label-has-for` | react.ts:233 | static | VALID | MED | label-has-for superseded by accessible-label usage checks |
| `no-empty-character-class` | regexp.ts:32 | static | VALID | HIGH | covered by core rules (duplicate detection) |
| `no-invalid-regexp` | regexp.ts:33 | static | VALID | HIGH | covered by core rules (duplicate detection) |
| `no-useless-backreference` | regexp.ts:34 | static | VALID | HIGH | covered by core rules (duplicate detection) |
| `security/detect-unsafe-regex` | security.ts:41 | static | VALID | HIGH | false-positive prone; detect-unsafe-regex covered by regexp plugin |
| `security/detect-non-literal-fs-filename` | security.ts:45 | static | VALID | HIGH | false-positive prone; detect-unsafe-regex covered by regexp plugin |
| `security/detect-non-literal-regexp` | security.ts:46 | static | VALID | HIGH | false-positive prone; detect-unsafe-regex covered by regexp plugin |
| `security/detect-object-injection` | security.ts:47 | static | VALID | HIGH | false-positive prone; detect-unsafe-regex covered by regexp plugin |
| `sonarjs/argument-type` | sonar.ts:122 | static | VALID | HIGH | D2: overly-strict/stylistic policy (sonar.ts:130) |
| `sonarjs/assertions-in-tests` | sonar.ts:123 | static | VALID | HIGH | D2: overly-strict/stylistic policy (sonar.ts:130) |
| `sonarjs/no-default-utility-imports` | sonar.ts:124 | static | VALID | HIGH | D2: overly-strict/stylistic policy (sonar.ts:130) |
| `sonarjs/no-unused-vars` | sonar.ts:125 | static | VALID | HIGH | D2: overly-strict/stylistic policy (sonar.ts:130) |
| `sonarjs/no-fallthrough` | sonar.ts:126 | static | VALID | HIGH | D2: overly-strict/stylistic policy (sonar.ts:130) |
| `sonarjs/no-labels` | sonar.ts:127 | static | VALID | HIGH | D2: overly-strict/stylistic policy (sonar.ts:130) |
| `sonarjs/code-eval` | sonar.ts:128 | static | VALID | HIGH | D2: overly-strict/stylistic policy (sonar.ts:130) |
| `sonarjs/no-parameter-reassignment` | sonar.ts:129 | static | VALID | HIGH | D2: overly-strict/stylistic policy (sonar.ts:130) |
| `sonarjs/no-nested-conditional` | sonar.ts:132 | static | VALID | HIGH | D2: overly-strict/stylistic policy (sonar.ts:130) |
| `sonarjs/cognitive-complexity` | sonar.ts:133 | static | VALID | HIGH | D2: overly-strict/stylistic policy (sonar.ts:130) |
| `sonarjs/todo-tag` | sonar.ts:134 | static | VALID | HIGH | D2: overly-strict/stylistic policy (sonar.ts:130) |
| `sonarjs/redundant-type-aliases` | sonar.ts:135 | static | SUPERSEDED | HIGH | @typescript-eslint/no-redundant-type-constituents error (typescript.ts:180) |
| `sonarjs/function-return-type` | sonar.ts:136 | static | VALID | HIGH | D2: overly-strict/stylistic policy (sonar.ts:130) |
| `sonarjs/deprecation` | sonar.ts:137 | static | VALID | HIGH | D2: overly-strict/stylistic policy (sonar.ts:130) |
| `sonarjs/different-types-comparison` | sonar.ts:138 | static | VALID | HIGH | D2: overly-strict/stylistic policy (sonar.ts:130) |
| `sonarjs/no-alphabetical-sort` | sonar.ts:139 | static | VALID | HIGH | D2: overly-strict/stylistic policy (sonar.ts:130) |
| `sonarjs/use-type-alias` | sonar.ts:140 | static | VALID | HIGH | D2: overly-strict/stylistic policy (sonar.ts:130) |
| `sonarjs/void-use` | sonar.ts:141 | static | VALID | HIGH | D2: overly-strict/stylistic policy (sonar.ts:130) |
| `tailwind-better/enforce-consistent-important-position` | tailwind.ts:79 | static | VALID | MED | D2 policy: important-position/shorthand enforcement too strict |
| `tailwind-better/enforce-shorthand-classes` | tailwind.ts:80 | static | VALID | MED | D2 policy: important-position/shorthand enforcement too strict |
| `n/prefer-global/process` | test.ts:46 | static | VALID | HIGH | test-environment relaxation (assertions/verbosity) |
| `n/no-sync` | test.ts:47 | static | VALID | HIGH | test-environment relaxation (assertions/verbosity) |
| `import-x/no-named-as-default-member` | test.ts:49 | static | VALID | HIGH | test-environment relaxation (assertions/verbosity) |
| `jsdoc/require-jsdoc` | test.ts:51 | static | VALID | HIGH | test-environment relaxation (assertions/verbosity) |
| `regexp/no-super-linear-backtracking` | test.ts:53 | static | VALID | HIGH | test-environment relaxation (assertions/verbosity) |
| `sonarjs/no-duplicate-string` | test.ts:55 | static | VALID | HIGH | test-environment relaxation (assertions/verbosity) |
| `sonarjs/no-identical-functions` | test.ts:56 | static | VALID | HIGH | test-environment relaxation (assertions/verbosity) |
| `vitest/valid-expect` | test.ts:63 | static | VALID | HIGH | test-environment relaxation (assertions/verbosity) |
| `@typescript-eslint/consistent-type-definitions` | test.ts:67 | static | VALID | HIGH | test-environment relaxation (assertions/verbosity) |
| `@typescript-eslint/no-unsafe-argument` | test.ts:68 | static | VALID | HIGH | test-environment relaxation (assertions/verbosity) |
| `@typescript-eslint/no-unsafe-assignment` | test.ts:69 | static | VALID | HIGH | test-environment relaxation (assertions/verbosity) |
| `@typescript-eslint/no-unsafe-call` | test.ts:70 | static | VALID | HIGH | test-environment relaxation (assertions/verbosity) |
| `@typescript-eslint/no-unsafe-member-access` | test.ts:71 | static | VALID | HIGH | test-environment relaxation (assertions/verbosity) |
| `@typescript-eslint/no-unsafe-return` | test.ts:72 | static | VALID | HIGH | test-environment relaxation (assertions/verbosity) |
| `@typescript-eslint/no-unused-vars` | test.ts:73 | static | VALID | HIGH | test-environment relaxation (assertions/verbosity) |
| `@typescript-eslint/strict-boolean-expressions` | test.ts:74 | static | VALID | HIGH | test-environment relaxation (assertions/verbosity) |
| `unicorn/consistent-function-scoping` | test.ts:76 | static | VALID | HIGH | test-environment relaxation (assertions/verbosity) |
| `unicorn/prefer-module` | test.ts:77 | static | VALID | HIGH | test-environment relaxation (assertions/verbosity) |
| `@stylistic/spaced-comment` | toml.ts:46 | static | VALID | HIGH | formatter ownership (toml block) |
| `no-extra-boolean-cast` | typescript.ts:133 | static | VALID | HIGH | covered by TypeScript compiler / tsc |
| `consistent-return` | typescript.ts:134 | static | VALID | HIGH | covered by TypeScript compiler / tsc |
| `import-x/named` | typescript.ts:135 | static | VALID | HIGH | covered by TypeScript compiler / tsc |
| `no-undef` | typescript.ts:136 | static | VALID | HIGH | covered by TypeScript compiler / tsc |
| `@typescript-eslint/no-unsafe-type-assertion` | typescript.ts:141 | static | VALID | HIGH | covered by TypeScript compiler / tsc |
| `no-loop-func` | typescript.ts:264 | static | VALID | HIGH | covered by TypeScript compiler / tsc |
| `no-use-before-define` | typescript.ts:267 | static | VALID | HIGH | covered by TypeScript compiler / tsc |
| `no-shadow` | typescript.ts:278 | static | VALID | HIGH | covered by TypeScript compiler / tsc |
| `no-dupe-class-members` | typescript.ts:288 | static | VALID | HIGH | covered by TypeScript compiler / tsc |
| `@typescript-eslint/no-dupe-class-members` | typescript.ts:289 | static | VALID | HIGH | covered by TypeScript compiler / tsc |
| `no-invalid-this` | typescript.ts:291 | static | VALID | HIGH | covered by TypeScript compiler / tsc |
| `@typescript-eslint/no-invalid-this` | typescript.ts:292 | static | VALID | HIGH | covered by TypeScript compiler / tsc |
| `no-redeclare` | typescript.ts:294 | static | VALID | HIGH | covered by TypeScript compiler / tsc |
| `@typescript-eslint/no-redeclare` | typescript.ts:295 | static | VALID | HIGH | covered by TypeScript compiler / tsc |
| `no-unused-vars` | typescript.ts:297 | static | VALID | HIGH | covered by TypeScript compiler / tsc |
| `no-throw-literal` | typescript.ts:308 | static | VALID | HIGH | covered by TypeScript compiler / tsc |
| `dot-notation` | typescript.ts:318 | static | VALID | HIGH | covered by TypeScript compiler / tsc |
| `class-methods-use-this` | typescript.ts:324 | static | VALID | HIGH | covered by TypeScript compiler / tsc |
| `no-array-constructor` | typescript.ts:327 | static | VALID | HIGH | covered by TypeScript compiler / tsc |
| `no-implied-eval` | typescript.ts:330 | static | VALID | HIGH | covered by TypeScript compiler / tsc |
| `no-return-await` | typescript.ts:333 | static | VALID | HIGH | covered by TypeScript compiler / tsc |
| `no-useless-constructor` | typescript.ts:336 | static | VALID | HIGH | covered by TypeScript compiler / tsc |
| `prefer-destructuring` | typescript.ts:339 | static | VALID | HIGH | covered by TypeScript compiler / tsc |
| `prefer-promise-reject-errors` | typescript.ts:349 | static | VALID | HIGH | covered by TypeScript compiler / tsc |
| `require-await` | typescript.ts:352 | static | VALID | HIGH | covered by TypeScript compiler / tsc |
| `@typescript-eslint/no-unused-expressions` | typescript.ts:504 | static | VALID | HIGH | covered by TypeScript compiler / tsc |
| `@typescript-eslint/consistent-type-definitions` | typescript.ts:505 | static | VALID | HIGH | covered by TypeScript compiler / tsc |
| `@typescript-eslint/triple-slash-reference` | typescript.ts:506 | static | VALID | HIGH | covered by TypeScript compiler / tsc |
| `@typescript-eslint/ban-ts-comment` | typescript.ts:513 | static | VALID | HIGH | covered by TypeScript compiler / tsc |
| `@typescript-eslint/no-require-imports` | typescript.ts:514 | static | VALID | HIGH | covered by TypeScript compiler / tsc |
| `@typescript-eslint/no-var-requires` | typescript.ts:515 | static | VALID | HIGH | covered by TypeScript compiler / tsc |
| `unicorn/no-anonymous-default-export` | unicorn.ts:60 | static | VALID | HIGH | D2: overly-strict/noisy or upstream bug-gated (#2302/#2018) |
| `unicorn/no-await-in-promise-methods` | unicorn.ts:61 | static | VALID | HIGH | D2: overly-strict/noisy or upstream bug-gated (#2302/#2018) |
| `unicorn/no-single-promise-in-promise-methods` | unicorn.ts:62 | static | VALID | HIGH | D2: overly-strict/noisy or upstream bug-gated (#2302/#2018) |
| `unicorn/no-useless-spread` | unicorn.ts:63 | static | VALID | HIGH | D2: overly-strict/noisy or upstream bug-gated (#2302/#2018) |
| `unicorn/prefer-module` | unicorn.ts:64 | static | VALID | HIGH | D2: overly-strict/noisy or upstream bug-gated (#2302/#2018) |
| `unicorn/name-replacements` | unicorn.ts:67 | static | VALID | HIGH | D2: overly-strict/noisy or upstream bug-gated (#2302/#2018) |
| `unicorn/no-non-function-verb-prefix` | unicorn.ts:68 | static | VALID | HIGH | D2: overly-strict/noisy or upstream bug-gated (#2302/#2018) |
| `unicorn/no-null` | unicorn.ts:69 | static | VALID | HIGH | D2: overly-strict/noisy or upstream bug-gated (#2302/#2018) |
| `unicorn/no-top-level-side-effects` | unicorn.ts:70 | static | VALID | HIGH | D2: overly-strict/noisy or upstream bug-gated (#2302/#2018) |
| `unicorn/no-unsafe-property-key` | unicorn.ts:71 | static | VALID | HIGH | D2: overly-strict/noisy or upstream bug-gated (#2302/#2018) |
| `unicorn/no-useless-undefined` | unicorn.ts:72 | static | VALID | HIGH | D2: overly-strict/noisy or upstream bug-gated (#2302/#2018) |
| `unicorn/prefer-await` | unicorn.ts:73 | static | VALID | HIGH | D2: overly-strict/noisy or upstream bug-gated (#2302/#2018) |
| `unicorn/prefer-string-raw` | unicorn.ts:74 | static | VALID | HIGH | D2: overly-strict/noisy or upstream bug-gated (#2302/#2018) |
| `unicorn/single-line-block-comment-style` | unicorn.ts:75 | static | VALID | HIGH | D2: overly-strict/noisy or upstream bug-gated (#2302/#2018) |
| `unicorn/consistent-boolean-name` | unicorn.ts:76 | static | VALID | HIGH | D2: overly-strict/noisy or upstream bug-gated (#2302/#2018) |
| `unicorn/consistent-conditional-object-spread` | unicorn.ts:77 | static | VALID | HIGH | D2: overly-strict/noisy or upstream bug-gated (#2302/#2018) |
| `unicorn/no-array-callback-reference` | unicorn.ts:78 | static | VALID | HIGH | D2: overly-strict/noisy or upstream bug-gated (#2302/#2018) |
| `unicorn/no-array-reduce` | unicorn.ts:79 | static | VALID | HIGH | D2: overly-strict/noisy or upstream bug-gated (#2302/#2018) |
| `unicorn/no-break-in-nested-loop` | unicorn.ts:80 | static | VALID | HIGH | D2: overly-strict/noisy or upstream bug-gated (#2302/#2018) |
| `unicorn/no-computed-property-existence-check` | unicorn.ts:81 | static | VALID | HIGH | D2: overly-strict/noisy or upstream bug-gated (#2302/#2018) |
| `unicorn/no-top-level-assignment-in-function` | unicorn.ts:82 | static | VALID | HIGH | D2: overly-strict/noisy or upstream bug-gated (#2302/#2018) |
| `unicorn/no-unreadable-array-destructuring` | unicorn.ts:83 | static | VALID | HIGH | D2: overly-strict/noisy or upstream bug-gated (#2302/#2018) |
| `unicorn/prefer-promise-with-resolvers` | unicorn.ts:84 | static | VALID | HIGH | D2: overly-strict/noisy or upstream bug-gated (#2302/#2018) |
| `unicorn/prevent-abbreviations` | unicorn.ts:85 | static | VALID | HIGH | D2: overly-strict/noisy or upstream bug-gated (#2302/#2018) |
| `unicorn/prefer-iterator-helpers` | unicorn.ts:94 | static | VALID | HIGH | D2: overly-strict/noisy or upstream bug-gated (#2302/#2018) |
| `unicorn/prefer-iterator-to-array` | unicorn.ts:95 | static | VALID | HIGH | D2: overly-strict/noisy or upstream bug-gated (#2302/#2018) |
| `unicorn/prefer-set-methods` | unicorn.ts:96 | static | VALID | HIGH | D2: overly-strict/noisy or upstream bug-gated (#2302/#2018) |
| `n/prefer-global/process` | vue.ts:154 | static | VALID | MED | process global allowed in app context |
| `import-x/default` | vue.ts:305 | static | VALID | MED | process global allowed in app context |
| `import-x/named` | vue.ts:306 | static | VALID | MED | process global allowed in app context |
| `import-x/namespace` | vue.ts:307 | static | VALID | MED | process global allowed in app context |
| `import-x/no-unresolved` | vue.ts:308 | static | VALID | MED | process global allowed in app context |
| `vue/multi-word-component-names` | vue.ts:324 | static | VALID | MED | process global allowed in app context |
| `@stylistic/spaced-comment` | yaml.ts:48 | static | VALID | HIGH | formatter ownership (yml block) |

## Enable candidates

No HIGH-confidence enable candidates surfaced. The disablement set is dominated by
deliberate policy (D2 strictness calibrations), documented overlap coverage, and
formatter ownership — all current.

- **LOW** — `@typescript-eslint/no-extra-boolean-cast` (typescript.ts): reason
  unrecorded in history; current TS rule has matured. Candidate for a trial batch of one.
- **Observation** — several unicorn "overly strict/noisy" offs predate precision
  options added upstream since; candidates only if a consumer requests relief (D2 cuts
  both ways: do not enable speculatively).

## Open questions

1. `imports.ts` active offs were bulk-classified (LOW confidence) — spot-check
   against current import-x resolver behavior.
2. Should issue-gated unicorn offs (#2302, #2018) gain an automated
   "unblock when upstream closes" reminder?
3. Vue `-error` preset adoption (Task 4 item 19 evaluation) remains deferred —
   it is a policy change (7 rules warn→error) requiring a breaking batch per D7.

## Conclusion

The disabled-rule surface is healthy: disablements are deliberate, documented where it
matters, and consistent with the repo's overlap priority and relaxed-enforcement
philosophy. One LOW-confidence candidate identified; no stale disables requiring
action now. **Re-audit trigger**: @stylistic v6 stable (list-style migration window)
or any major plugin bump, whichever comes first.
