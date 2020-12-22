// eslint-disable-next-line node/no-unsupported-features/es-syntax
export default {
  extensions: ["ts"],
  require: ["ts-node/register", "tsconfig-paths/register"],
  environmentVariables: {
    /* eslint-disable @typescript-eslint/naming-convention */
    TS_NODE_PROJECT: "tests/tsconfig.json",
    /* eslint-enable @typescript-eslint/naming-convention */
  },
};
