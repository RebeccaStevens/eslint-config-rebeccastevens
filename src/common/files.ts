export const typescriptExtensions = [".ts", ".tsx", ".mts", ".cts"];
export const typescriptDeclarationExtensions = [".d.ts", ".d.mts", ".d.cts"];
export const jsExtensions = [".js", ".mjs", ".cjs"];
export const jsxExtensions = [".jsx", ".tsx"];
export const commonJsExtensions = [".cjs", ".cts"];

export const typescriptSupportedExtensions = [
  ...new Set([
    ...typescriptExtensions,
    ...typescriptDeclarationExtensions,
    ...jsExtensions,
    ...jsxExtensions,
  ]),
];

export const typescriptFiles = [`**/*{${typescriptExtensions.join(",")}}`];
export const typescriptDeclarationFiles = [
  `**/*{${typescriptDeclarationExtensions.join(",")}}`,
];
export const jsxFiles = [`**/*{${jsxExtensions.join(",")}}`];
export const commonJsFiles = [`**/*{${commonJsExtensions.join(",")}}`];

export const testFiles = ["{test,tests}/**/*", "**/*.{spec,test}.*"];
