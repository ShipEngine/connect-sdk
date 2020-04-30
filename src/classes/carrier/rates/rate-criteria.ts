import { RateCriteriaPOJO } from "../../../pojos/carrier";
import { Joi, validate } from "../../../validation";
import { App } from "../../common/app";
import { hideAndFreeze, _internal } from "../../utils";
import { NewShipment, Shipment } from "../shipment";

/**
 * Specifies the criteria for rate quotes
 */
export class RateCriteria {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "rate criteria",
    schema: Joi.object({
      shipment: Shipment[_internal].schema.required(),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The shipment information used to get rate quotes
   */
  public readonly shipment: NewShipment;

  //#endregion

  public constructor(pojo: RateCriteriaPOJO, app: App) {
    validate(pojo, RateCriteria);

    this.shipment = new NewShipment(pojo.shipment, app);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(RateCriteria);
