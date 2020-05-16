import { AddressPOJO, ContactInfoPOJO, IdentifiersPOJO, NotePOJO, TimeRangePOJO } from "../../common";
import { UUID } from "../../types";
import { PickupCancellationReason } from "../enums";
import { PickupShipmentPOJO } from "./pickup-shipment-pojo";

/**
 * Cancellation of a previously-scheduled package pickup
 */
export interface PickupCancellationPOJO {
  /**
   * The unique ID of this cancellation request. This ID is used to correlate
   * requested cancellations with cancellation confirmations.
   */
  cancellationRequestID: UUID;

  /**
   * The confirmation ID of the pickup request to be canceled
   */
  confirmationID?: string;

  /**
   * Custom identifiers for this confirmation
   */
  identifiers?: IdentifiersPOJO;

  /**
   * The ID of the requested pickup service
   */
  pickupServiceID: UUID;

  /**
   * The reason for the cancellation
   */
  reason: PickupCancellationReason;

  /**
   * Human-readable information about why the customer is cancelling the pickup
   */
  notes?: string | Array<string | NotePOJO>;

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
  timeWindows: TimeRangePOJO[];

  /**
   * The shipments to be picked up
   */
  shipments: PickupShipmentPOJO[];

  /**
   * Arbitrary data about this pickup that was previously persisted by the ShipEngine Platform.
   */
  metadata?: object;
}
