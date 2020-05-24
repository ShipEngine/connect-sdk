import type { DateTimeZone, DateTimeZonePOJO } from "../../common";
import type { ShipmentStatus } from "../enums";
import type { ShipmentIdentifier, ShipmentIdentifierPOJO } from "../shipments/shipment-identifier";
import type { PackageTrackingInfo, PackageTrackingInfoPOJO } from "./package-tracking-info";
import type { TrackingEvent, TrackingEventPOJO } from "./tracking-event";

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
  packages: ReadonlyArray<PackageTrackingInfoPOJO>;

  /**
   * The events and status changes that have occured for this shipment
   */
  events: ReadonlyArray<TrackingEventPOJO>;
}


/**
 * Tracking information about a shipment
 */
export interface TrackingInfo extends ShipmentIdentifier {
  /**
   * The date and time that the shipment is now expected to be delivered.
   * Once the shipment has been delivered, this is the actual delivery date/time.
   */
  readonly deliveryDateTime?: DateTimeZone;

  /**
   * The list of packages in the shipment
   */
  readonly packages: ReadonlyArray<PackageTrackingInfo>;

  /**
   * Returns the first package in the `packages` array.
   * Useful for carriers that only support single-piece shipments.
   */
  readonly package: PackageTrackingInfo;

  /**
   * The events and status changes that have occured for this shipment
   */
  readonly events: ReadonlyArray<TrackingEvent>;

  /**
   * The latest event in the `events` array
   */
  readonly latestEvent: TrackingEvent;

  /**
   * The latest status
   */
  readonly status: ShipmentStatus;

  /**
   * Indicates whether the `events` array contains any error events
   */
  readonly hasError: boolean;

  /**
   * The date/time of the first "accepted" event in the `events` array, if any
   */
  readonly shipDateTime: DateTimeZone | undefined;
}
