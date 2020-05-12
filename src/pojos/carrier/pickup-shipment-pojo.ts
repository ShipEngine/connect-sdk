import { UUID } from "../../types";
import { DimensionsPOJO, WeightPOJO } from "../common";
import { PackageIdentifierPOJO } from "./package-identifier-pojo";
import { ShipmentIdentifierPOJO } from "./shipment-identifier-pojo";

/**
 * The shipment information needed to schedule a pickup
 */
export interface PickupShipmentPOJO extends ShipmentIdentifierPOJO {
  /**
   * The ID of the delivery service to use
   */
  deliveryServiceID: UUID;

  /**
   * Arbitrary data about this shipment that was previously persisted by the ShipEngine Platform.
   */
  metadata?: object;

  /**
   * The list of packages in the shipment
   */
  packages: PickupPackagePOJO[];
}


/**
 * The package information needed to schedule a pickup
 */
export interface PickupPackagePOJO extends PackageIdentifierPOJO {
  /**
   * The ID of the packaging used
   */
  packagingID: UUID;

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
