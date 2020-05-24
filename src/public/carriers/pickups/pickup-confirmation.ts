import type { Charge, ChargePOJO, Identifiers, IdentifiersPOJO, MonetaryValue, Note, NotePOJO, TimeRange, TimeRangePOJO } from "../../common";
import type { ShipmentIdentifier, ShipmentIdentifierPOJO } from "../shipments/shipment-identifier";

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
  charges: ReadonlyArray<ChargePOJO>;

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


/**
 * Confirmation that a package pickup has been scheduled
 */
export interface PickupConfirmation {
  /**
   * The unique ID of the pickup
   */
  readonly id: string;

  /**
   * Your own identifiers for this pickup
   */
  readonly identifiers: Identifiers;

  /**
   * A list of dates and times when the carrier intends to be available to pickup
   */
  readonly timeWindows: ReadonlyArray<TimeRange>;

  /**
   * The breakdown of charges for this pickup.
   * If the carrier does not provide a detailed breakdown, then just use a single
   * charge of type "pickup".
   */
  readonly charges: ReadonlyArray<Charge>;

  /**
   * The total cost of all charges for this pickup
   */
  readonly totalAmount: MonetaryValue;

  /**
   * The shipments to be picked-up
   */
  readonly shipments: ReadonlyArray<ShipmentIdentifier>;

  /**
   * Additional information about the pickup confirmation
   */
  readonly notes: ReadonlyArray<Note>;

  /**
   * Arbitrary data about this pickup that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  readonly metadata: object;
}
