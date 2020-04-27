import { RateCriteriaPOJO } from "../../../pojos/carrier";
import { Joi, validate } from "../../../validation";
import { App } from "../../common/app";
import { NewShipment, Shipment } from "../shipment";

/**
 * Specifies the criteria for rate quotes
 */
export class RateCriteria {
  //#region Class Fields

  public static readonly label = "rate criteria";

  /** @internal */
  public static readonly schema = Joi.object({
    shipment: Shipment.schema.required(),
  });

  //#endregion
  //#region Instance Fields

  /**
   * The shipment information used to get rate quotes
   */
  public readonly shipment: NewShipment;

  //#endregion

  public constructor(pojo: RateCriteriaPOJO, app: App) {
    validate(pojo, RateCriteria);

    this.shipment = new NewShipment(pojo.shipment, app);

    // Prevent modifications after validation
    Object.freeze(this);
  }
}
