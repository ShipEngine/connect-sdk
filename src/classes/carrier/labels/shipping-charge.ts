import { assert } from "../../../assert";
import { ShippingChargeType } from "../../../enums";
import { ShippingChargePOJO } from "../../../pojos";
import { MonetaryValue } from "../../monetary-value";

/**
 * An itemized shipping charge in the total cost of a shipment
 */
export class ShippingCharge {
  public readonly type: ShippingChargeType;
  public readonly amount: MonetaryValue;
  public readonly description: string;

  public constructor(pojo: ShippingChargePOJO) {
    assert.type.object(pojo, "shipping charge");
    this.type = assert.string.enum(pojo.type, ShippingChargeType, "shipping charge type");
    this.amount = new MonetaryValue(pojo.amount);
    this.description = assert.string(pojo.description, "shipping charge description", "");

    // Prevent modifications after validation
    Object.freeze(this);
  }
}
