import type { DefinitionIdentifier, DefinitionIdentifierPOJO } from "../common";


/**
 * Describes a type of packaging
 */
export interface PackagingDefinition extends DefinitionIdentifierPOJO {
  /**
   * The user-friendly name for this packaging (e.g. "Flat-Rate Box", "Large Padded Envelope")
   */
  name: string;

  /**
   * A short, user-friendly description of the packaging
   */
  description?: string;

  /**
   * Indicates whether the weight must be specified when using this packaging
   */
  requiresWeight?: boolean;

  /**
   * Indicates whether the dimensions must be specified when using this packaging
   */
  requiresDimensions?: boolean;

}


/**
 * Describes a type of packaging
 */
export type PackagingPOJO = PackagingDefinition;


/**
 * Identifies a type of packaging
 */
export type PackagingIdentifierPOJO = DefinitionIdentifierPOJO;


/**
 * Identifies a type of packaging
 */
export type PackagingIdentifier = DefinitionIdentifier;


/**
 * Describes a type of packaging
 */
export interface Packaging extends DefinitionIdentifier {
  /**
   * The user-friendly name for this packaging (e.g. "Flat-Rate Box", "Large Padded Envelope")
   */
  readonly name: string;

  /**
   * A short, user-friendly description of the packaging
   */
  readonly description: string;

  /**
   * Indicates whether the weight must be specified when using this packaging
   */
  readonly requiresWeight: boolean;

  /**
   * Indicates whether the dimensions must be specified when using this packaging
   */
  readonly requiresDimensions: boolean;
}
