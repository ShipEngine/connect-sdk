import type { Dimensions, DimensionsPOJO, Weight, WeightPOJO } from "../../common";
import type { PackageIdentifier, PackageIdentifierPOJO } from "../packages/package-identifier";
import type { PackagingIdentifier, PackagingIdentifierPOJO } from "../packaging";


/**
 * The package information needed to schedule a pickup
 */
export interface PickupPackagePOJO extends PackageIdentifierPOJO {
  /**
   * The packaging used for this package
   */
  packaging: PackagingIdentifierPOJO;

  /**
   * The package dimensions
   */
  dimensions?: DimensionsPOJO;

  /**
   * The package weight
   */
  weight?: WeightPOJO;

  /**
   * Arbitrary data about this package that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  metadata?: object;
}


/**
 * The package information needed to schedule a pickup
 */
export interface PickupPackage extends PackageIdentifier {
  /**
   * The packaging used for this package
   */
  readonly packaging: PackagingIdentifier;

  /**
   * The package dimensions
   */
  readonly dimensions?: Dimensions;

  /**
   * The package weight
   */
  readonly weight?: Weight;

  /**
   * Arbitrary data about this package that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  readonly metadata?: object;
}
