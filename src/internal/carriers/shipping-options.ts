import { ShippingOptions as ShippingOptionsPOJO } from "../../public";
import { hideAndFreeze, Joi, _internal } from "../common";

export class ShippingOptions {
  public static readonly [_internal] = {
    label: "shipping options",
    schema: Joi.object({
      dangerousGoodsCategory: Joi.string().optional(),
      billDutiesToSender: Joi.boolean().optional()
    }),
  };

  public readonly dangerousGoodsCategory: string;
  public readonly billDutiesToSender: boolean;

  public constructor(pojo: ShippingOptionsPOJO) {
    this.dangerousGoodsCategory = pojo.dangerousGoodsCategory || "";
    this.billDutiesToSender = pojo.billDutiesToSender || false;

    // Make this object immutable
    hideAndFreeze(this);
  }
}
