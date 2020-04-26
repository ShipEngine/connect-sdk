import { TrackingCriteriaPOJO } from "../../../pojos/carrier";
import { Joi, validate } from "../../../validation";
import { App } from "../../common";
import { Shipment } from "../shipment";

/**
 * Specifies the criteria for tracking details
 */
export class TrackingCriteria {
  //#region Class Fields

  public static readonly label = "tracking criteria";

  /** @internal */
  public static readonly schema = Joi.object({
    shipment: Shipment.schema.required(),
  });

  //#endregion
  //#region Instance Fields

  /**
   * The shipment to get tracking details for
   */
  public readonly shipment: Shipment;

  //#endregion

  public constructor(pojo: TrackingCriteriaPOJO, app: App) {
    validate(pojo, TrackingCriteria);

    this.shipment = new Shipment(pojo.shipment, app);

    // Prevent modifications after validation
    Object.freeze(this);
  }
}
