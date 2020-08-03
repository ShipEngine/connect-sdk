import { ShipmentStatus, TrackingInfo as ITrackingInfo, TrackingInfo as TrackingInfoPOJO } from "../../../definitions";
import { App, DateTimeZone, hideAndFreeze, Joi, _internal } from "../../common";
import { ShipmentIdentifierBase } from "../shipments/shipment-identifier";
import { PackageTrackingInfo } from "./package-tracking-info";
import { TrackingEvent } from "./tracking-event";

export class TrackingInfo extends ShipmentIdentifierBase implements ITrackingInfo {
  public static [_internal] = {
    label: "shipment",
    schema: Joi.object({
      deliveryDateTime: DateTimeZone[_internal].schema,
      packages: Joi.array().min(1).items(PackageTrackingInfo[_internal].schema),
      events: Joi.array().min(1).items(TrackingEvent[_internal].schema),
    }),
  };

  public deliveryDateTime?: DateTimeZone;
  public packages: Array<PackageTrackingInfo>;
  public events: Array<TrackingEvent>;

  public get package(): PackageTrackingInfo {
    return this.packages[0];
  }

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

  public get status(): ShipmentStatus {
    return this.latestEvent.status;
  }

  public get hasError(): boolean {
    return this.events.some((event) => event.isError);
  }

  public get shipDateTime(): DateTimeZone | undefined {
    for (let event of this.events) {
      if (event.status === ShipmentStatus.Accepted) {
        return event.dateTime;
      }
    }
  }

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
