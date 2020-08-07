import type { AddressPOJO, DateTimeZonePOJO, NotePOJO, PersonNamePOJO } from "../../common";
import type { ShipmentStatus } from "../enums";

/**
 * An event or status change that occurred while processing a shipment
 */

export interface TrackingEvent {
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
   * Indicates whether this event represents an error state, such as a lost package or failed delivery.
   */
  isError?: boolean;

  /**
   * The carrier's event or status code
   */
  code?: string;

  /**
   * The carrier's description of the event or status code.
   * This description should not be specific to this particular shipment.
   */
  description?: string;

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
  notes?: NotePOJO[];
}
