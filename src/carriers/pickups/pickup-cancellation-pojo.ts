import { AddressPOJO, ContactInfoPOJO, IdentifiersPOJO, NotePOJO, TimeRangePOJO, UUID } from "../../common";
import { PickupCancellationReason } from "../enums";
import { PickupServiceIdentifierPOJO } from "./pickup-service-pojo";
import { PickupShipmentPOJO } from "./pickup-shipment-pojo";

/**
 * Cancellation of a previously-scheduled package pickup
 */
export interface PickupCancellationPOJO {
  /**
   * The unique ID of this cancellation. This ID is used to correlate cancellations with outcomes.
   */
  cancellationID: UUID;

  /**
   * The unique ID of the pickup to be canceled
   */
  id: string;

  /**
   * Your own identifiers for this pickup
   */
  identifiers?: IdentifiersPOJO;

  /**
   * The requested pickup service
   */
  pickupService: PickupServiceIdentifierPOJO;

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
   * The contact information of the person who scheduled/canceled the pickup
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
