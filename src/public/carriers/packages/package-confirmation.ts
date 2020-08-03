
import type { PackageIdentifier } from "./package-identifier";

/**
 * Confirmation details about a package in a shipment
 */
export interface PackageConfirmation extends PackageIdentifier {
  /**
   * Arbitrary data about this package that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  metadata: object;
}
