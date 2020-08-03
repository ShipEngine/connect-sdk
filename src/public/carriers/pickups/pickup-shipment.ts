import type { DeliveryService } from "../delivery-service";
import type { ShipmentIdentifier } from "../shipments/shipment-identifier";
import type { PickupPackage } from "./pickup-package";

/**
 * The shipment information needed to schedule a pickup
 */
export interface PickupShipment extends ShipmentIdentifier {
  /**
   * The delivery service to use
   */
  deliveryService: DeliveryService;

  /**
   * Arbitrary data about this shipment that was previously persisted by the ShipEngine Platform.
   */
  metadata: object;

  /**
   * The list of packages in the shipment
   */
  packages: Array<PickupPackage>;

  /**
   * The first package in the `packages` array.
   * Useful for carriers that only support single-piece shipments.
   */
  package: PickupPackage;
}
