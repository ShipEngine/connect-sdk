/**
 * A ShipEngine Integration Platform app manifest (package.json file)
 */
export interface AppPOJO {
  name: string;
  version: string;
  description?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
}
