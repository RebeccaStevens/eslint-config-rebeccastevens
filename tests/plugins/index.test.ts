import test from "ava";
import * as fs from "fs";

import { pluginConfigs } from "~/plugins";

const files: ReadonlyArray<string> = fs
  .readdirSync("./src/plugins")
  .filter((file) => file !== "index.ts" && file.endsWith(".ts"));

test("imports all available rule modules", (t) => {
  t.is(files.length, pluginConfigs.length);
});
