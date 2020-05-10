import { hideAndFreeze, Joi, validate, _internal } from "../../../internal";
import { TrackingCriteriaPOJO } from "../../../pojos/carrier";
import { ShipmentIdentifier } from "../shipments/shipment-identifier";

/**
 * An event or status change that occurred while processing a shipment
 */
export class TrackingEvent {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "tracking event",
    schema: Joi.object({
      dateTime:
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The shipment to get tracking details for
   */
  public readonly shipment: ShipmentIdentifier;

  //#endregion

  public constructor(pojo: TrackingCriteriaPOJO) {
    validate(pojo, TrackingCriteria);

    this.shipment = new ShipmentIdentifier(pojo.shipment);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(TrackingCriteria);
