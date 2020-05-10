import { ShipmentStatus } from "../../enums";
import { DateTimeZonePOJO } from "../common";
import { ShipmentIdentifierPOJO } from "./shipment-pojo";

/**
 * Tracking information about a shipment
 */
export interface TrackingInfoPOJO {
  /**
   * The shipment this tracking information is about
   */
  shipment?: ShipmentIdentifierPOJO;

  /**
   * The events and status changes that have occured for this shipment
   */
  events: TrackingEventPOJO[];
}

/**
 * An event or status change that occurred while processing a shipment
 */
export interface TrackingEventPOJO {
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
   * The carrier's description of the event or status, not specific to this particular shipment
   */
  description?: string;
}
