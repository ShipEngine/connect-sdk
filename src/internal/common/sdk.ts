// NOTE: We can't use `import` syntax here because package.json is outside the TypeScript root dir
// tslint:disable-next-line: no-var-requires no-require-imports
const manifest = require("../../../package.json");

/**
 * The SDK manifest (package.json)
 */
export const sdk = manifest as AppManifestPOJO;


/**
 * A ShipEngine Integration Platform app manifest (package.json file)
 */
export interface AppManifestPOJO {
  name: string;
  version: string;
  description?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
}
