import type { Identifiers, IdentifiersPOJO } from "./identifiers";
import type { UUID } from "./types";

/**
 * Identifies an object in an app definition
 */
export interface Definition {
  /**
   * A UUID that uniquely identifies the object. This ID should never change.
   */
  id: UUID;

  /**
   * Your own identifiers for the object
   */
  identifiers?: IdentifiersPOJO;

  /**
   * Optional code used to map to what the carrier or marketplace uses to identify the resource
   */
  code?: string;
}

/**
 * Identifies an object in an app definition
 */
export interface DefinitionIdentifier {
  /**
   * A UUID that uniquely identifies the object. This ID should never change.
   */
  readonly id: UUID;

  /**
   * Your own identifiers for the object
   */
  readonly identifiers: Identifiers;

  /**
   * Optional code used to map to what the carrier or marketplace uses to identify the resource
   */
  readonly code: string;
}
