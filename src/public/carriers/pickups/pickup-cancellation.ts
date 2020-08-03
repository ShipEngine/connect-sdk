import type { Address, ContactInfo, Identifiers, Note, TimeRange, UUID } from "../../common";
import type { PickupCancellationReason } from "../enums";
import type { PickupService } from "./pickup-service";
import type { PickupShipment } from "./pickup-shipment";

/**
 * Cancellation of a previously-scheduled package pickup
 */
export interface PickupCancellation {
  /**
   * The unique ID of this cancellation. This ID is used to correlate cancellations with outcomes.
   */
  cancellationID: UUID;

  /**
   * The unique ID of the pickup to be cancelled
   */
  id: string;

  /**
   * Your own identifiers for this pickup
   */
  identifiers: Identifiers;

  /**
   * The requested pickup service
   */
  pickupService: PickupService;

  /**
   * The reason for the cancellation
   */
  reason: PickupCancellationReason;

  /**
   * Information about why the customer is cancelling the pickup
   */
  notes: Array<Note>;

  /**
   * The address where the pickup was requested
   */
  address: Address;

  /**
   * The contact information of the person who scheduled/cancelled the pickup
   */
  contact: ContactInfo;

  /**
   * A list of dates and times when the carrier intended to pickup
   */
  timeWindows: Array<TimeRange>;

  /**
   * The shipments to be picked up
   */
  shipments: Array<PickupShipment>;

  /**
   * Arbitrary data about this pickup that was previously persisted by the ShipEngine Platform.
   */
  metadata: object;
}
