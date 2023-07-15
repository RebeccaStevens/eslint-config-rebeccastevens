import { promises as fs } from "node:fs";

import prettierConfig from "eslint-config-prettier";
import { configs as prettierPluginConfigs } from "eslint-plugin-prettier";

import overridesConfig from "~/configs/common-overrides";
import modernConfig from "~/configs/modern";
import typescriptConfig from "~/configs/typescript";
import { mergeConfigs } from "~/merge-configs";

// Merged config.
const config = mergeConfigs(
  modernConfig,
  typescriptConfig,
  overridesConfig,
  prettierPluginConfigs!["recommended"]!,
  prettierConfig,
);

// Write the file.
void fs.writeFile(
  ".eslintrc.preview.json",
  JSON.stringify(config, undefined, 2),
);
