import { hideAndFreeze, Joi, _internal } from "../../../internal";
import { TrackingInfoPOJO } from "../../../pojos/carrier";
import { DateTimeZone } from "../../common";
import { App } from "../../common/app";
import { shipmentIdentifierMixin } from "../shipments/shipment-identifier";
import { PackageTrackingInfo } from "./package-tracking-info";
import { TrackingEvent } from "./tracking-event";

/**
 * Tracking information about a shipment
 */
export class TrackingInfo extends shipmentIdentifierMixin() {
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
   * The events and status changes that have occured for this shipment
   */
  public readonly events: ReadonlyArray<TrackingEvent>;

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
