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
    typescript: {
      tsconfig: "./tsconfig.eslint.json",
    },
    functional: "lite",
    formatters: true,
    stylistic: true,
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
