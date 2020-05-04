import { CustomDataPOJO, IdentifierPOJO, TimeRangePOJO } from "../common";
import { ShipmentIdentifierPOJO } from "./shipment-pojo";
import { ShippingChargePOJO } from "./shipping-charge-pojo";

/**
 * Confirmation that a package pickup has been scheduled
 */
export interface PickupConfirmationPOJO {
  /**
   * The carrier's confirmation ID
   */
  confirmationID: string;

  /**
   * Alternative identifiers associated with this confirmation
   */
  identifiers?: IdentifierPOJO[];

  /**
   * The shipments to be picked-up
   */
  shipments?: ShipmentIdentifierPOJO[];

  /**
   * A list of dates and times when the carrier intends to be available to pickup
   */
  timeWindows: TimeRangePOJO[];

  /**
   * Human-readable information about the pickup confirmation
   */
  notes?: string;

  /**
   * Arbitrary data that will be persisted by the ShipEngine Integration Platform.
   */
  customData?: CustomDataPOJO;
}
