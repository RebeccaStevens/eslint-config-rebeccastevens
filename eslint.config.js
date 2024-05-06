// @ts-check
import styleMigrate from "@stylistic/eslint-plugin-migrate";
import JITI from "jiti";

const jiti = JITI(import.meta.url);

/**
 * @type {import('./src').default}
 */
const rsEslint = jiti("./src").default;

export default rsEslint(
  {
    mode: "none",
    typescript: {
      tsconfig: "./tsconfig.eslint.json",
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
      "style-migrate/migrate": ["error", { namespaceTo: "style" }],
    },
  },
);
