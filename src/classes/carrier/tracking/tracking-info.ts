import { hideAndFreeze, Joi, validate, _internal } from "../../../internal";
import { TrackingCriteriaPOJO } from "../../../pojos/carrier";
import { ShipmentIdentifier } from "../shipments/shipment-identifier";

/**
 * Tracking information about a shipment
 */
export class TrackingInfo {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "tracking info",
    schema: Joi.object({
      shipment: ShipmentIdentifier[_internal].schema.required(),
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
    validate(pojo, TrackingInfo);

    this.shipment = new ShipmentIdentifier(pojo.shipment);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(TrackingInfo);
