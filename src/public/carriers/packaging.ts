import type { Definition, DefinitionIdentifier } from "../common";


/**
 * Describes a type of packaging
 */
export interface PackagingDefinition extends Definition {
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
 * Identifies a type of packaging
 */
export type PackagingIdentifier = DefinitionIdentifier;


/**
 * Identifies a type of packaging
 */
export type PackagingIdentifierPOJO = Definition;


/**
 * Describes a type of packaging
 */
export interface Packaging extends PackagingIdentifier {
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
