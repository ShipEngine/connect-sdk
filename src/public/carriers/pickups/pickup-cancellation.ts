import type { Address, AddressPOJO, ContactInfo, ContactInfoPOJO, Identifiers, IdentifiersPOJO, Note, NotePOJO, TimeRange, TimeRangePOJO, UUID } from "../../common";
import type { PickupCancellationReason } from "../enums";
import type { PickupService, PickupServiceIdentifierPOJO } from "./pickup-service";
import type { PickupShipment, PickupShipmentPOJO } from "./pickup-shipment";

/**
 * Cancellation of a previously-scheduled package pickup
 */
export interface PickupCancellationPOJO {
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
  identifiers?: IdentifiersPOJO;

  /**
   * The requested pickup service
   */
  pickupService: PickupServiceIdentifierPOJO | string;

  /**
   * The reason for the cancellation
   */
  reason: PickupCancellationReason;

  /**
   * Human-readable information about why the customer is cancelling the pickup
   */
  notes?: string | ReadonlyArray<string | NotePOJO>;

  /**
   * The address where the pickup was requested
   */
  address: AddressPOJO;

  /**
   * The contact information of the person who scheduled/cancelled the pickup
   */
  contact: ContactInfoPOJO;

  /**
   * A list of dates and times when the carrier intended to pickup
   */
  timeWindows: ReadonlyArray<TimeRangePOJO>;

  /**
   * The shipments to be picked up
   */
  shipments: ReadonlyArray<PickupShipmentPOJO>;

  /**
   * Arbitrary data about this pickup that was previously persisted by the ShipEngine Platform.
   */
  metadata?: object;
}


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
  readonly notes: ReadonlyArray<Note>;

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
  readonly timeWindows: ReadonlyArray<TimeRange>;

  /**
   * The shipments to be picked up
   */
  readonly shipments: ReadonlyArray<PickupShipment>;

  /**
   * Arbitrary data about this pickup that was previously persisted by the ShipEngine Platform.
   */
  readonly metadata: object;
}
