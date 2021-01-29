// NOTE: We can't use `import` syntax here because package.json is outside the TypeScript root dir
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
const manifest = require("../../../package.json");

/**
 * The SDK manifest (package.json)
 */
export const sdk = manifest as AppManifestPOJO;


/**
 * A ShipEngine Connect app manifest (package.json file)
 */
export interface AppManifestPOJO {
  name: string;
  version: string;
  description?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
}
