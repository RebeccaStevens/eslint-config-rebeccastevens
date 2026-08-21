import type { FlatConfigItem, OptionsFunctional, OptionsSecurity } from "../types";
import { loadPlugins } from "../utils";

const sonarCoreSecurityRules = [
  "sonarjs/no-hardcoded-secrets",
  "sonarjs/hardcoded-secret-signatures",
  "sonarjs/no-hardcoded-passwords",
  "sonarjs/sql-queries",
  "sonarjs/xml-parser-xxe",
  "sonarjs/no-unsafe-unzip",
  "sonarjs/csrf",
  "sonarjs/insecure-jwt-token",
  "sonarjs/pseudo-random",
  "sonarjs/weak-ssl",
  "sonarjs/no-weak-cipher",
  "sonarjs/hashing",
  "sonarjs/encryption-secure-mode",
  "sonarjs/insecure-cookie",
  "sonarjs/cookie-no-httponly",
  "sonarjs/no-session-cookies-on-static-assets",
] as const;

const sonarNoisySecurityRules = [
  "sonarjs/no-hardcoded-ip",
  "sonarjs/no-os-command-from-path",
  "sonarjs/os-command",
  "sonarjs/no-intrusive-permissions",
  "sonarjs/web-sql-database",
  "sonarjs/unverified-certificate",
  "sonarjs/no-clear-text-protocols",
  "sonarjs/publicly-writable-directories",
  "sonarjs/link-with-target-blank",
  "sonarjs/disabled-auto-escaping",
  "sonarjs/no-mixed-content",
  "sonarjs/no-referrer-policy",
  "sonarjs/strict-transport-security",
  "sonarjs/content-security-policy",
  "sonarjs/frame-ancestors",
  "sonarjs/no-mime-sniff",
  "sonarjs/x-powered-by",
  "sonarjs/hidden-files",
  "sonarjs/disabled-resource-integrity",
  "sonarjs/confidential-information-logging",
  "sonarjs/production-debug",
  "sonarjs/no-debug-commands-in-ui-tests",
  "sonarjs/aws-s3-bucket-insecure-http",
  "sonarjs/aws-s3-bucket-versioning",
  "sonarjs/aws-s3-bucket-granted-access",
  "sonarjs/aws-s3-bucket-public-access",
  "sonarjs/aws-iam-public-access",
  "sonarjs/aws-iam-all-privileges",
  "sonarjs/aws-iam-all-resources-accessible",
  "sonarjs/aws-iam-privilege-escalation",
  "sonarjs/aws-ec2-unencrypted-ebs-volume",
  "sonarjs/aws-ec2-rds-dms-public",
  "sonarjs/aws-rds-unencrypted-databases",
  "sonarjs/aws-opensearchservice-domain",
  "sonarjs/aws-sagemaker-unencrypted-notebook",
  "sonarjs/aws-restricted-ip-admin-access",
  "sonarjs/aws-sns-unencrypted-topics",
  "sonarjs/aws-sqs-unencrypted-queue",
  "sonarjs/aws-efs-unencrypted",
  "sonarjs/aws-apigateway-public-api",
] as const;

/**
 * Enable SonarJS recommended rules via `eslint-plugin-sonarjs`.
 *
 * Enables `elseif-without-else` as an error when `functionalEnforcement` is
 * `recommended` or `strict`. Security rules respect `securitySeverity`.
 * Disables rules overlapping other plugins (no-unused-vars → `@typescript-eslint`,
 * no-fallthrough/no-labels/code-eval → core, no-parameter-reassignment → core)
 * and overly strict/stylistic rules (no-nested-conditional, cognitive-complexity,
 * todo-tag, redundant-type-aliases, function-return-type, deprecation,
 * different-types-comparison, no-alphabetical-sort, use-type-alias, void-use).
 *
 * @param options - Options with functionalEnforcement and optional securitySeverity
 * @returns Flat config items enabling SonarJS recommended rules
 */
export async function sonar(
  options: Readonly<Required<OptionsFunctional>> & {
    securitySeverity?: OptionsSecurity["severity"];
  },
): Promise<FlatConfigItem[]> {
  const { functionalEnforcement = "none", securitySeverity = "moderate" } = options;

  const [pluginSonar] = await loadPlugins(["eslint-plugin-sonarjs"]);

  const securityRules =
    securitySeverity === "none"
      ? Object.fromEntries([...sonarCoreSecurityRules, ...sonarNoisySecurityRules].map((rule) => [rule, "off"]))
      : securitySeverity === "lite"
        ? {
            ...Object.fromEntries(sonarCoreSecurityRules.map((rule) => [rule, "warn"])),
            ...Object.fromEntries(sonarNoisySecurityRules.map((rule) => [rule, "off"])),
          }
        : securitySeverity === "strict"
          ? Object.fromEntries([...sonarCoreSecurityRules, ...sonarNoisySecurityRules].map((rule) => [rule, "error"]))
          : {
              ...Object.fromEntries(sonarCoreSecurityRules.map((rule) => [rule, "error"])),
              ...Object.fromEntries(sonarNoisySecurityRules.map((rule) => [rule, "off"])),
            };

  return [
    {
      name: "rs:sonar",
      plugins: {
        sonarjs: pluginSonar,
      },
      rules: {
        ...(pluginSonar as { configs?: { recommended?: { rules?: Record<string, string> } } }).configs?.recommended
          ?.rules,

        ...securityRules,

        ...((functionalEnforcement === "recommended" || functionalEnforcement === "strict") && {
          "sonarjs/elseif-without-else": "error",
        }),

        // ── Disable sonarjs rules already handled by other plugins ─────────
        "sonarjs/assertions-in-tests": "off", // vitest/expect-expect
        "sonarjs/no-default-utility-imports": "off",
        "sonarjs/no-unused-vars": "off", // @typescript-eslint/no-unused-vars (TS) / no-unused-vars (JS)
        "sonarjs/no-fallthrough": "off", // no-fallthrough (core)
        "sonarjs/no-labels": "off", // no-labels (core)
        "sonarjs/code-eval": "off", // no-eval (core)
        "sonarjs/no-parameter-reassignment": "off", // no-param-reassign (core, functional mode)

        // ── Turn off overly strict / stylistic sonar rules ─────────────────
        "sonarjs/no-nested-conditional": "off",
        "sonarjs/cognitive-complexity": "off",
        "sonarjs/todo-tag": "off",
        "sonarjs/redundant-type-aliases": "off",
        "sonarjs/function-return-type": "off",
        "sonarjs/deprecation": "off",
        "sonarjs/different-types-comparison": "off",
        "sonarjs/no-alphabetical-sort": "off",
        "sonarjs/use-type-alias": "off",
        "sonarjs/void-use": "off",
      },
    },
  ];
}
