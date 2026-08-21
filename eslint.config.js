// @ts-check
import styleMigrate from "@stylistic/eslint-plugin-migrate";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const rsEslint = await jiti.import("./src", { default: true });

export default // @ts-expect-error
rsEslint(
  {
    projectRoot: import.meta.dirname,
    mode: "none",
    test: false,
    typescript: {
      useDefaultDefaultProject: false,
    },
    formatters: true,
    functional: "lite",
    json: true,
    markdown: true,
    stylistic: true,
    yaml: true,
    pnpm: true,
    ignores: ["AGENTS.md"],
  },
  {
    rules: {
      "jsdoc/require-jsdoc": "off",
    },
  },
  {
    files: ["src/configs/*.ts"],
    plugins: {
      "style-migrate": styleMigrate,
    },
    rules: {
      "style-migrate/migrate": ["error", { namespaceTo: "@stylistic" }],
    },
  },
);
