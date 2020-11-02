import type { UUID } from "./types";


/**
 * A ShipEngine Connect app
 */
export interface AppDefinition {
  /**
   * A UUID that uniquely identifies the app.
   * This ID should never change.
   */
  id: UUID;

  /**
   * An optional UUID that is used to relate this app to an existing production app.
   * Do not set this field unless instructed to by the shipengine connect team.
   */
  providerId?: UUID;
}


/**
 * A ShipEngine Connect app manifest (package.json file)
 */
export interface AppManifest {
  name: string;
  version: string;
  description: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  [key: string]: unknown;
}
