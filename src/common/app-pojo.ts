/**
 * A ShipEngine Integration Platform app
 */
export interface AppPOJO {
  manifest: AppManifestPOJO;
}

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
