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
  readonly cancellationID: UUID;

  /**
   * The unique ID of the pickup to be cancelled
   */
  readonly id: string;

  /**
   * Your own identifiers for this pickup
   */
  readonly identifiers: Identifiers;

  /**
   * The requested pickup service
   */
  readonly pickupService: PickupService;

  /**
   * The reason for the cancellation
   */
  readonly reason: PickupCancellationReason;

  /**
   * Information about why the customer is cancelling the pickup
   */
  readonly notes: readonly Note[];

  /**
   * The address where the pickup was requested
   */
  readonly address: Address;

  /**
   * The contact information of the person who scheduled/cancelled the pickup
   */
  readonly contact: ContactInfo;

  /**
   * A list of dates and times when the carrier intended to pickup
   */
  readonly timeWindows: readonly TimeRange[];

  /**
   * The shipments to be picked up
   */
  readonly shipments: readonly PickupShipment[];

  /**
   * Arbitrary data about this pickup that was previously persisted by the ShipEngine Platform.
   */
  readonly metadata: object;
}
