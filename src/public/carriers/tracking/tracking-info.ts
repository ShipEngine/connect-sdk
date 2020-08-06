import type { DateTimeZonePOJO } from "../../common";
import type { ShipmentIdentifierPOJO } from "../shipments/shipment-identifier";
import type { PackageTrackingInfo } from "./package-tracking-info";
import type { TrackingEvent } from "./tracking-event";

/**
 * Tracking information about a shipment
 */
export interface TrackingInfo extends ShipmentIdentifierPOJO {
  /**
   * The date and time that the shipment is now expected to be delivered.
   * Once the shipment has been delivered, this is the actual delivery date/time.
   */
  deliveryDateTime?: DateTimeZonePOJO | Date | string;

  /**
   * The list of packages in the shipment
   */
  packages: ReadonlyArray<PackageTrackingInfo>;

  /**
   * The events and status changes that have occured for this shipment
   */
  events: ReadonlyArray<TrackingEvent>;
}
