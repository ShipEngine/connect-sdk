import type { Identifiers, IdentifiersPOJO } from "./identifiers";

/**
 * Identifies an object in an app definition
 */
export interface DefinitionIdentifierPOJO {
  /**
   * The unique identifier for this object. This ID should never change.
   */
  id: string;
}

/**
 * Identifies an object in an app definition
 */
export interface DefinitionIdentifier {
  /**
   * The unique identifier for this object. This ID should never change.
   */
  readonly id: string;
}
