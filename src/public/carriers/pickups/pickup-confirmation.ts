import type { ChargePOJO, Identifiers, NotePOJO, TimeRangePOJO } from "../../common";
import type { ShipmentIdentifierPOJO } from "../shipments/shipment-identifier";

/**
 * Confirmation that a package pickup has been scheduled
 */
export interface PickupConfirmation {
  /**
   * The unique ID of the pickup
   */
  id: string;

  /**
   * Your own identifiers for this pickup
   */
  identifiers?: Identifiers;

  /**
   * A list of dates and times when the carrier intends to be available to pickup
   */
  timeWindows: readonly TimeRangePOJO[];

  /**
   * The breakdown of charges for this pickup.
   * If the carrier does not provide a detailed breakdown, then just use a single
   * charge of type "pickup".
   */
  charges: readonly ChargePOJO[];

  /**
   * The shipments to be picked-up.
   * If not specified, the assumption is that all of the shipments will be picked up.
   */
  shipments?: readonly ShipmentIdentifierPOJO[];

  /**
   * Human-readable information about the pickup confirmation
   */
  notes?: NotePOJO[];

  /**
   * Arbitrary data about this pickup that will be persisted by the ShipEngine Connect.
   * Must be JSON serializable.
   */
  metadata?: object;
}
