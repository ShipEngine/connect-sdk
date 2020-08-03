import type { DateTimeZone } from "../../common";
import type { ShipmentStatus } from "../enums";
import type { ShipmentIdentifier } from "../shipments/shipment-identifier";
import type { PackageTrackingInfo } from "./package-tracking-info";
import type { TrackingEvent } from "./tracking-event";

/**
 * Tracking information about a shipment
 */
export interface TrackingInfo extends ShipmentIdentifier {
  /**
   * The date and time that the shipment is now expected to be delivered.
   * Once the shipment has been delivered, this is the actual delivery date/time.
   */
  deliveryDateTime?: DateTimeZone;

  /**
   * The list of packages in the shipment
   */
  packages: Array<PackageTrackingInfo>;

  /**
   * Returns the first package in the `packages` array.
   * Useful for carriers that only support single-piece shipments.
   */
  package: PackageTrackingInfo;

  /**
   * The events and status changes that have occured for this shipment
   */
  events: Array<TrackingEvent>;

  /**
   * The latest event in the `events` array
   */
  latestEvent: TrackingEvent;

  /**
   * The latest status
   */
  status: ShipmentStatus;

  /**
   * Indicates whether the `events` array contains any error events
   */
  hasError: boolean;

  /**
   * The date/time of the first "accepted" event in the `events` array, if any
   */
  shipDateTime: DateTimeZone | undefined;
}
