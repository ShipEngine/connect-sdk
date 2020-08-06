
import type { PackageIdentifierPOJO } from "./package-identifier";

/**
 * Confirmation details about a package in a shipment
 */
export interface PackageConfirmation extends PackageIdentifierPOJO {
  /**
   * Arbitrary data about this package that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  metadata?: object;
}
