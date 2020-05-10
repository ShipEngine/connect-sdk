import { PickupCancellationReason } from "../../enums";
import { UUID } from "../../types";
import { AddressPOJO, ContactInfoPOJO, CustomDataPOJO, IdentifierPOJO, TimeRangePOJO } from "../common";
import { ShipmentPOJO } from "./shipment-pojo";

/**
 * Cancellation of a previously-scheduled package pickup
 */
export interface PickupCancellationPOJO {
  /**
   * The confirmation ID of the pickup request to be canceled
   */
  confirmationID: string;

  /**
   * The ID of the requested pickup service
   */
  pickupServiceID: UUID;

  /**
   * Alternative identifiers associated with this confirmation
   */
  identifiers?: IdentifierPOJO[];

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
  shipments: ShipmentPOJO[];

  /**
   * Arbitrary data that was returned when the pickup was originally confirmed.
   */
  customData?: CustomDataPOJO;
}
