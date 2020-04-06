/**
 * A ShipEngine IPaaS app manifest (package.json file)
 */
export interface AppManifest {
  name?: string;
  description?: string;
  version?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
}
