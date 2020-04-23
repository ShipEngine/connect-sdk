import { CustomData, Identifier } from "../../types";
import { TimeRangePOJO } from "../time-range-pojo";
import { ShipmentIdentifierPOJO } from "./shipment-pojo";

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
  identifiers?: Identifier[];

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
  customData?: CustomData;
}
