import { assert } from "../../assert";
import { MonetaryValueConfig } from "../../config";
import { ShippingChargeConfig } from "../../config/shipping-charge-config";
import { ShippingChargeType } from "../../enums";
import { MonetaryValue } from "../../measures";

/**
 * An itemized shipping charge in the total cost of a shipment
 */
export class ShippingCharge {
  public readonly type: ShippingChargeType;
  public readonly amount: MonetaryValueConfig;
  public readonly description: string;

  /**
   * Creates a ShippingCharge from a config object
   */
  public constructor(config: ShippingChargeConfig) {
    assert.type.object(config, "shipping charge");
    this.type = assert.string.enum(config.type, ShippingChargeType, "shipping charge type");
    this.amount = new MonetaryValue(config.amount);
    this.description = assert.string(config.description, "shipping charge description", "");

    // Prevent modifications after validation
    Object.freeze(this);
  }
}
