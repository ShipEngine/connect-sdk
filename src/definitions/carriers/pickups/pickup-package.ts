import type { Dimensions, Weight } from "../../common";
import type { PackageIdentifier } from "../packages/package-identifier";
import type { PackagingIdentifier } from "../packaging";

/**
 * The package information needed to schedule a pickup
 */
export interface PickupPackage extends PackageIdentifier {
  /**
   * The packaging used for this package
   */
  packaging: PackagingIdentifier;

  /**
   * The package dimensions
   */
  dimensions?: Dimensions;

  /**
   * The package weight
   */
  weight?: Weight;

  /**
   * Arbitrary data about this package that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  metadata?: object;
}
