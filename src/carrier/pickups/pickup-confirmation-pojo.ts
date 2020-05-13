import { IdentifierPOJO, TimeRangePOJO } from "../../common";
import { ShipmentIdentifierPOJO } from "../shipments/shipment-identifier";
import { ShippingChargePOJO } from "../shipping-charge-pojo";

/**
 * Confirmation that a package pickup has been scheduled
 */
export interface PickupConfirmationPOJO {
  /**
   * The carrier's confirmation number, if any
   */
  confirmationNumber?: string;

  /**
   * Alternative identifiers associated with this pickup
   */
  identifiers?: IdentifierPOJO[];

  /**
   * A list of dates and times when the carrier intends to be available to pickup
   */
  timeWindows: TimeRangePOJO[];

  /**
   * The breakdown of charges for this pickup.
   * If the carrier does not provide a detailed breakdown, then just use a single
   * charge of type "pickup".
   */
  charges: ShippingChargePOJO[];

  /**
   * The shipments to be picked-up.
   * If not specified, the assumption is that all of the shipments will be picked up.
   */
  shipments?: ShipmentIdentifierPOJO[];

  /**
   * Human-readable information about the pickup confirmation
   */
  notes?: string;

  /**
   * Arbitrary data about this pickup that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  metadata?: object;
}
