import { AddressPOJO, ContactInfoPOJO, IdentifiersPOJO, TimeRangePOJO } from "../../common";
import { PickupCancellationReason } from "../../enums";
import { UUID } from "../../types";
import { PickupShipmentPOJO } from "./pickup-shipment-pojo";

/**
 * Cancellation of a previously-scheduled package pickup
 */
export interface PickupCancellationPOJO {
  /**
   * A value that uniquely identifies the pickup. This ID must be returned, along with a flag
   * indicating whether it was successfully canceled.
   */
  pickupID: string;

  /**
   * The confirmation number of the pickup request to be canceled
   */
  confirmationNumber?: string;

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
  notes?: string;

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
