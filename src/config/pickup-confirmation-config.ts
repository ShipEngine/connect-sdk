import { CustomData, Identifier } from "../types";
import { ShipmentIdentifierConfig } from "./shipment-config";
import { TimeRangeConfig } from "./time-range-config";

/**
 * Confirmation that a package pickup has been scheduled
 */
export interface PickupConfirmationConfig {
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
  shipments?: ShipmentIdentifierConfig[];

  /**
   * A list of dates and times when the carrier intends to be available to pickup
   */
  timeWindows: TimeRangeConfig[];

  /**
   * Human-readable information about the pickup confirmation
   */
  notes?: string;

  /**
   * Arbitrary data for that will be persisted by ShipEngine IPaaS.
   */
  customData?: CustomData;
}
