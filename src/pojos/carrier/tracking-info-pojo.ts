import { ShipmentStatus } from "../../enums";
import { UUID } from "../../types";
import { AddressPOJO, DateTimeZonePOJO, DimensionsPOJO, PersonNamePOJO, WeightPOJO } from "../common";
import { ShipmentIdentifierPOJO } from "./shipment-identifier-pojo";

/**
 * Tracking information about a shipment
 */
export interface TrackingInfoPOJO extends ShipmentIdentifierPOJO {
  /**
   * The date and time that the shipment is now expected to be delivered.
   * Once the shipment has been delivered, this is the actual delivery date/time.
   */
  deliveryDateTime?: DateTimeZonePOJO | Date | string;

  /**
   * The list of packages in the shipment
   */
  packages: PackageTrackingInfoPOJO[];

  /**
   * The events and status changes that have occured for this shipment
   */
  events: TrackingEventPOJO[];
}

/**
 * The actual package info, as determined by the carrier
 */
export interface PackageTrackingInfoPOJO {
  /**
   * The ID of the actual packaging that was used, as determined by the carrier
   */
  packagingID?: UUID;

  /**
   * The actual package dimensions as measured by the carrier
   */
  dimensions?: DimensionsPOJO;

  /**
   * The actual package weight as measured by the carrier
   */
  weight?: WeightPOJO;
}

/**
 * An event or status change that occurred while processing a shipment
 */
export interface TrackingEventPOJO {
  /**
   * The user-friendly name of the event (e.g. "Arrived at Warehouse", "Delivered")
   */
  name?: string;

  /**
   * The date/time that this event occurred
   */
  dateTime: DateTimeZonePOJO | Date | string;

  /**
   * The shipment status at the time of this event
   */
  status: ShipmentStatus;

  /**
   * The carrier's event or status code
   */
  code?: string;

  /**
   * The carrier's description of the event or status code.
   * This description should not be specific to this particular shipment
   */
  description?: string;

  /**
   * Indicates whether this event represents an error state, such as a lost package or failed delivery.
   */
  isError?: boolean;

  /**
   * The carrier's error code
   */
  errorCode?: string;

  /**
   * The carrier's description of the error code.
   * This description should not be specific to this particular shipment
   */
  errorDescription?: string;

  /**
   * The address (or as much of it as is known) where the event occurred
   */
  address?: Partial<AddressPOJO>;

  /**
   * The name of the person who signed or approved this event.
   * This is usually only relevant for the "Deliverd" event.
   */
  signer?: string | PersonNamePOJO;

  /**
   * Human-readable information regarding this event, such as details about the error state
   * or a description of where the package was placed upon delivery.
   */
  notes?: string;
}
