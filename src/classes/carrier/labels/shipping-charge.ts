import { ShippingChargeType } from "../../../enums";
import { ShippingChargePOJO } from "../../../pojos/carrier";
import { Joi } from "../../../validation";
import { MonetaryValue } from "../../common";

/**
 * An itemized shipping charge in the total cost of a shipment
 */
export class ShippingCharge {
  //#region Class Fields

  public static readonly label = "shipping charge";

  /** @internal */
  public static readonly schema = Joi.object({
    name: Joi.string().trim().singleLine().min(1).max(100),
    type: Joi.string().enum(ShippingChargeType).required(),
    amount: MonetaryValue.schema.required(),
  });

  //#endregion
  //#region Instance Fields

  public readonly name: string;
  public readonly type: ShippingChargeType;
  public readonly amount: MonetaryValue;

  //#endregion

  public constructor(pojo: ShippingChargePOJO) {
    this.name = pojo.name;
    this.type = pojo.type;
    this.amount = new MonetaryValue(pojo.amount);

    // Prevent modifications after validation
    Object.freeze(this);
  }
}
