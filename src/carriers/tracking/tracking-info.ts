import { DateTimeZone, DateTimeZonePOJO } from "../../common";
import { App, hideAndFreeze, Joi, _internal } from "../../common/internal";
import { ShipmentStatus } from "../enums";
import { ShipmentIdentifierBase, ShipmentIdentifierPOJO } from "../shipments/shipment-identifier";
import { PackageTrackingInfo, PackageTrackingInfoPOJO } from "./package-tracking-info";
import { TrackingEvent } from "./tracking-event";
import { TrackingEventPOJO } from "./tracking-event-pojo";

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
export class TrackingInfo extends ShipmentIdentifierBase {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "shipment",
    schema: Joi.object({
      deliveryDateTime: DateTimeZone[_internal].schema,
      packages: Joi.array().min(1).items(PackageTrackingInfo[_internal].schema),
      events: Joi.array().min(1).items(TrackingEvent[_internal].schema),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The date and time that the shipment is now expected to be delivered.
   * Once the shipment has been delivered, this is the actual delivery date/time.
   */
  public readonly deliveryDateTime?: DateTimeZone;

  /**
   * The list of packages in the shipment
   */
  public readonly packages: ReadonlyArray<PackageTrackingInfo>;

  /**
   * Returns the first package in the `packages` array.
   * Useful for carriers that only support single-piece shipments.
   */
  public get package(): PackageTrackingInfo {
    return this.packages[0];
  }

  /**
   * The events and status changes that have occured for this shipment
   */
  public readonly events: ReadonlyArray<TrackingEvent>;

  //#endregion
  //#region Helper Properties

  /**
   * The latest event in the `events` array
   */
  public get latestEvent(): TrackingEvent {
    let events = this.events;
    let latestEvent = events[0];
    for (let i = 1; i < events.length; i++) {
      if (events[i].dateTime.getTime() > latestEvent.dateTime.getTime()) {
        latestEvent = events[i];
      }
    }
    return latestEvent;
  }

  /**
   * The latest status
   */
  public get status(): ShipmentStatus {
    return this.latestEvent.status;
  }

  /**
   * Indicates whether the `events` array contains any error events
   */
  public get hasError(): boolean {
    return this.events.some((event) => event.isError);
  }

  /**
   * The date/time of the first "accepted" event in the `events` array, if any
   */
  public get shipDateTime(): DateTimeZone | undefined {
    for (let event of this.events) {
      if (event.status === ShipmentStatus.Accepted) {
        return event.dateTime;
      }
    }
  }

  //#endregion

  public constructor(pojo: TrackingInfoPOJO, app: App) {
    super(pojo);

    this.deliveryDateTime =
      pojo.deliveryDateTime ? new DateTimeZone(pojo.deliveryDateTime) : undefined;
    this.packages = pojo.packages.map((parcel) => new PackageTrackingInfo(parcel, app));
    this.events = pojo.events.map((event) => new TrackingEvent(event));

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(TrackingInfo);
