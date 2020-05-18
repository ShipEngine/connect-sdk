import { IdentifiersPOJO, NotePOJO, TimeRangePOJO } from "../../common";
import { ShipmentIdentifierPOJO } from "../shipments/shipment-identifier";
import { ShippingChargePOJO } from "../shipping-charge-pojo";

/**
 * Confirmation that a package pickup has been scheduled
 */
export interface PickupConfirmationPOJO {
  /**
   * The unique ID of the pickup
   */
  id: string;

  /**
   * Your own identifiers for this pickup
   */
  identifiers?: IdentifiersPOJO;

  /**
   * A list of dates and times when the carrier intends to be available to pickup
   */
  timeWindows: ReadonlyArray<TimeRangePOJO>;

  /**
   * The breakdown of charges for this pickup.
   * If the carrier does not provide a detailed breakdown, then just use a single
   * charge of type "pickup".
   */
  charges: ReadonlyArray<ShippingChargePOJO>;

  /**
   * The shipments to be picked-up.
   * If not specified, the assumption is that all of the shipments will be picked up.
   */
  shipments?: ReadonlyArray<ShipmentIdentifierPOJO>;

  /**
   * Human-readable information about the pickup confirmation
   */
  notes?: string | ReadonlyArray<string | NotePOJO>;

  /**
   * Arbitrary data about this pickup that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  metadata?: object;
}
