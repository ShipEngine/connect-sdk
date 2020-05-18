import { DimensionsPOJO, WeightPOJO } from "../../common";
import { DeliveryServiceIdentifierPOJO } from "../delivery-service-pojo";
import { PackageIdentifierPOJO } from "../packages/package-identifier";
import { PackagingIdentifierPOJO } from "../packaging-pojo";
import { ShipmentIdentifierPOJO } from "../shipments/shipment-identifier";

/**
 * The shipment information needed to schedule a pickup
 */
export interface PickupShipmentPOJO extends ShipmentIdentifierPOJO {
  /**
   * The delivery service to use for this shipment
   */
  deliveryService: DeliveryServiceIdentifierPOJO;

  /**
   * Arbitrary data about this shipment that was previously persisted by the ShipEngine Platform.
   */
  metadata?: object;

  /**
   * The list of packages in the shipment
   */
  packages: ReadonlyArray<PickupPackagePOJO>;
}


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
