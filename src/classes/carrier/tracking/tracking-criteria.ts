import { TrackingCriteriaPOJO } from "../../../pojos/carrier";
import { Joi, validate } from "../../../validation";
import { App } from "../../common/app";
import { hideAndFreeze, _internal } from "../../utils";
import { Shipment } from "../shipments/shipment";

/**
 * Specifies the criteria for tracking details
 */
export class TrackingCriteria {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "tracking criteria",
    schema: Joi.object({
      shipment: Shipment[_internal].schema.required(),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The shipment to get tracking details for
   */
  public readonly shipment: Shipment;

  //#endregion

  public constructor(pojo: TrackingCriteriaPOJO, app: App) {
    validate(pojo, TrackingCriteria);

    this.shipment = new Shipment(pojo.shipment, app);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(TrackingCriteria);
