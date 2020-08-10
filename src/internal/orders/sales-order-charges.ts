import { SalesOrderCharges as ISalesOrderCharges } from "../../public";
import { MonetaryValue, hideAndFreeze, Joi, _internal } from "../common";

export class SalesOrderCharges implements ISalesOrderCharges {
  public static readonly [_internal] = {
    label: "sales order charges",
    schema: Joi.object({
      subTotal: MonetaryValue[_internal].schema,
      taxAmount: MonetaryValue[_internal].schema,
      shippingAmount: MonetaryValue[_internal].schema,
      confirmationCost: MonetaryValue[_internal].schema,
      insuranceCost: MonetaryValue[_internal].schema,
      otherCost: MonetaryValue[_internal].schema,
    }).unknown(false),
  };

  public readonly subTotal: MonetaryValue;
  public readonly taxAmount: MonetaryValue;
  public readonly shippingAmount: MonetaryValue;
  public readonly confirmationCost: MonetaryValue;
  public readonly insuranceCost: MonetaryValue;
  public readonly otherCost: MonetaryValue;

  public constructor(pojo?: ISalesOrderCharges) {

    this.subTotal = new MonetaryValue(pojo && pojo.subTotal || { value: 0, currency: "usd" });
    this.taxAmount = new MonetaryValue(pojo && pojo.taxAmount || { value: 0, currency: "usd" });
    this.shippingAmount = new MonetaryValue(pojo && pojo.shippingAmount || { value: 0, currency: "usd" });
    this.confirmationCost = new MonetaryValue(pojo && pojo.confirmationCost || { value: 0, currency: "usd" });
    this.insuranceCost = new MonetaryValue(pojo && pojo.insuranceCost || { value: 0, currency: "usd" });
    this.otherCost = new MonetaryValue(pojo && pojo.otherCost || { value: 0, currency: "usd" });

    // Make this object immutable
    hideAndFreeze(this);
  }
}
