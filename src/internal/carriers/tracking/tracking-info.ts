import { ShipmentStatus, TrackingInfo as TrackingInfoPOJO } from "../../../public";
import { App, DateTimeZone, hideAndFreeze, Joi, _internal } from "../../common";
import { ShipmentIdentifierBase, ShipmentIdentifier } from "../shipments/shipment-identifier";
import { PackageTrackingInfo } from "./package-tracking-info";
import { TrackingEvent } from "./tracking-event";

export class TrackingInfo extends ShipmentIdentifierBase {
  public static readonly [_internal] = {
    label: "tracking info",
    schema: ShipmentIdentifier[_internal].schema.keys({
      deliveryDateTime: DateTimeZone[_internal].schema,
      packages: Joi.array().items(PackageTrackingInfo[_internal].schema).optional(),
      events: Joi.array().min(1).items(TrackingEvent[_internal].schema),
    }),
  };

  public readonly deliveryDateTime?: DateTimeZone;
  public readonly packages: readonly PackageTrackingInfo[];
  public readonly events: readonly TrackingEvent[];

  public get package(): PackageTrackingInfo | undefined {
    return this.packages[0];
  }

  public get latestEvent(): TrackingEvent {
    const events = this.events;
    let latestEvent = events[0];
    for (let i = 1; i < events.length; i++) {
      if (events[i].dateTime.getTime() > latestEvent.dateTime.getTime()) {
        latestEvent = events[i];
      }
    }
    return latestEvent;
  }

  public get status(): ShipmentStatus {
    return this.latestEvent.status;
  }

  public get hasError(): boolean {
    return this.events.some((event) => event.isError);
  }

  public get shipDateTime(): DateTimeZone | undefined {
    for (const event of this.events) {
      if (event.status === ShipmentStatus.Accepted) {
        return event.dateTime;
      }
    }
  }

  public constructor(pojo: TrackingInfoPOJO, app: App) {
    super(pojo);

    this.deliveryDateTime =
      pojo.deliveryDateTime ? new DateTimeZone(pojo.deliveryDateTime) : undefined;
    this.packages = pojo.packages ? pojo.packages.map((parcel) => new PackageTrackingInfo(parcel, app)) : [];
    this.events = pojo.events.map((event) => new TrackingEvent(event));

    // Make this object immutable
    hideAndFreeze(this);
  }
}
