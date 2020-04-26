/**
 * A ShipEngine Integration Platform app manifest (package.json file)
 */
export interface AppManifestPOJO {
  name?: string;
  description?: string;
  version?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
}
