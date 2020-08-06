import type { Identifiers } from "../../common";

/**
 * Identifies a package
 */
export interface PackageIdentifierPOJO {
  /**
   * The carrier tracking number
   */
  trackingNumber?: string;

  /**
   * Your own identifiers for this package
   */
  identifiers?: Identifiers;
}


/**
 * Identifies a package
 */
export interface PackageIdentifier {
  /**
   * The carrier tracking number
   */
  readonly trackingNumber: string;

  /**
   * Your own identifiers for this package
   */
  readonly identifiers: Identifiers;
}
