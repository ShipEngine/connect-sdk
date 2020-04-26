import { CustomDataPOJO, IdentifierPOJO } from "../common";
import { ShipmentIdentifierPOJO } from "./shipment-pojo";
import { TimeRangePOJO } from "./time-range-pojo";

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
   * Arbitrary data for that will be persisted by ShipEngine IPaaS.
   */
  customData?: CustomDataPOJO;
}
