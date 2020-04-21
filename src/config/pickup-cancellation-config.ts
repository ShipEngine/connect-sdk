import { PickupCancellationReason } from "../enums";
import { CustomData, Identifier, UUID } from "../types";
import { AddressConfig } from "./address-config";
import { ContactInfoConfig } from "./contact-info-config";
import { ShipmentConfig } from "./shipment-config";
import { TimeRangeConfig } from "./time-range-config";

/**
 * Cancellation of a previously-requested package pickup
 */
export interface PickupCancellationConfig {
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
  identifiers?: Identifier[];

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
  address: AddressConfig;

  /**
   * The contact information of the person who scheduled/canceled the pickup
   */
  contact: ContactInfoConfig;

  /**
   * A list of dates and times when the carrier intended to pickup
   */
  timeWindows: TimeRangeConfig[];

  /**
   * The shipments to be picked up
   */
  shipments: ShipmentConfig[];

  /**
   * Arbitrary data that was returned when the pickup was originally confirmed.
   */
  customData?: CustomData;
}
