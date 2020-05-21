import { UUID } from "./types";

/**
 * A ShipEngine Integration Platform app
 */
export interface AppPOJO extends AppDefinition {
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


/**
 * A ShipEngine Integration Platform app
 */
export interface AppDefinition {
  /**
   * A UUID that uniquely identifies the app.
   * This ID should never change, even if the app name changes.
   */
  id: UUID;
}
