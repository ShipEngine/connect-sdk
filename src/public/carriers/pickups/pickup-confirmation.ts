import type { Charge, Identifiers, MonetaryValue, Note, TimeRange } from "../../common";
import type { ShipmentIdentifier } from "../shipments/shipment-identifier";

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
  identifiers: Identifiers;

  /**
   * A list of dates and times when the carrier intends to be available to pickup
   */
  timeWindows: Array<TimeRange>;

  /**
   * The breakdown of charges for this pickup.
   * If the carrier does not provide a detailed breakdown, then just use a single
   * charge of type "pickup".
   */
  charges: Array<Charge>;

  /**
   * The total cost of all charges for this pickup
   */
  totalAmount: MonetaryValue;

  /**
   * The shipments to be picked-up
   */
  shipments: Array<ShipmentIdentifier>;

  /**
   * Additional information about the pickup confirmation
   */
  notes: Array<Note>;

  /**
   * Arbitrary data about this pickup that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  metadata: object;
}
