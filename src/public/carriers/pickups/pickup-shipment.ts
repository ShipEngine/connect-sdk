import type { DeliveryService, DeliveryServiceIdentifierPOJO } from "../delivery-service";
import type { ShipmentIdentifier, ShipmentIdentifierPOJO } from "../shipments/shipment-identifier";
import type { PickupPackage, PickupPackagePOJO } from "./pickup-package";

/**
 * The shipment information needed to schedule a pickup
 */
export interface PickupShipmentPOJO extends ShipmentIdentifierPOJO {
  /**
   * The delivery service to use for this shipment
   */
  deliveryService: DeliveryServiceIdentifierPOJO | string;

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
 * The shipment information needed to schedule a pickup
 */
export interface PickupShipment extends ShipmentIdentifier {
  /**
   * The delivery service to use
   */
  readonly deliveryService: DeliveryService;

  /**
   * Arbitrary data about this shipment that was previously persisted by the ShipEngine Platform.
   */
  readonly metadata: object;

  /**
   * The list of packages in the shipment
   */
  readonly packages: ReadonlyArray<PickupPackage>;

  /**
   * The first package in the `packages` array.
   * Useful for carriers that only support single-piece shipments.
   */
  readonly package: PickupPackage;
}
