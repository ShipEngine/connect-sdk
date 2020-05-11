import { IdentifierPOJO } from "../common";

/**
 * Identifies a package
 */
export interface PackageIdentifierPOJO {
  /**
   * The carrier tracking number
   */
  trackingNumber?: string;

  /**
   * Alternative identifiers associated with this package
   */
  identifiers?: IdentifierPOJO[];
}
