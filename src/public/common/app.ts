import type { UUID } from "./types";


/**
 * A ShipEngine Integration Platform app
 */
export interface AppDefinition {
  /**
   * A UUID that uniquely identifies the carrier.
   * This ID should never change.
   */
  id: UUID;
}


/**
 * A ShipEngine Integration Platform app manifest (package.json file)
 */
export interface AppManifest {
  name: string;
  version: string;
  description: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  [key: string]: unknown;
}
