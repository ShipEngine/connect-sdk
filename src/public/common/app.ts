import type { UUID } from "./types";


/**
 * A ShipEngine Connect app
 */
export interface AppDefinition {
  /**
   * A UUID that uniquely identifies the carrier.
   * This ID should never change.
   */
  id: UUID;
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
