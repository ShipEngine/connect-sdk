import { ShippingChargeType } from "../../enums";
import { ShippingChargePOJO } from "../../pojos/carrier";
import { Joi } from "../../validation";
import { MonetaryValue } from "../common";
import { hideAndFreeze, _internal } from "../utils";

/**
 * An itemized shipping charge in the total cost of a shipment
 */
export class ShippingCharge {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "shipping charge",
    schema: Joi.object({
      name: Joi.string().trim().singleLine().min(1).max(100),
      type: Joi.string().enum(ShippingChargeType).required(),
      amount: MonetaryValue[_internal].schema.required(),
    }),
  };

  //#endregion
  //#region Public Fields

  public readonly name: string;
  public readonly type: ShippingChargeType;
  public readonly amount: MonetaryValue;

  //#endregion

  public constructor(pojo: ShippingChargePOJO) {
    this.name = pojo.name;
    this.type = pojo.type;
    this.amount = new MonetaryValue(pojo.amount);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(ShippingCharge);
