// @ts-check
import styleMigrate from "@stylistic/eslint-plugin-migrate";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

/**
 * @type {typeof import('./src').default}
 */
const rsEslint = await jiti.import("./src", { default: true });

export default rsEslint(
  {
    projectRoot: import.meta.dirname,
    mode: "none",
    typescript: {
      useDefaultDefaultProject: false,
    },
    formatters: true,
    functional: "lite",
    jsonc: true,
    markdown: true,
    stylistic: true,
    yaml: true,
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
