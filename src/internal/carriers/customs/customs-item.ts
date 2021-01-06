import * as currency from "currency.js";
import { Country, CustomsItemPOJO, CustomsItem as ICustomsItem, CustomsItemType } from "../../../public";
import { hideAndFreeze, Joi, MonetaryValue, Quantity, _internal } from "../../common";

export class CustomsItem implements ICustomsItem {
  public static readonly [_internal] = {
    label: "customs item",
    schema: Joi.object({
      type: Joi.string().enum(CustomsItemType).required(),
      sku: Joi.string().singleLine().allow(""),
      description: Joi.string().singleLine().allow(""),
      quantity: Quantity[_internal].schema.required(),
      unitValue: MonetaryValue[_internal].schema.required(),
      countryOfOrigin: Joi.string().enum(Country),
      countryOfManufacture: Joi.string().enum(Country),
      harmonizedTariffCode: Joi.string().trim().singleLine().allow(""),
    }),
  };

  public readonly type: CustomsItemType;
  public readonly sku: string;
  public readonly description: string;
  public readonly quantity: Quantity;
  public readonly unitValue: MonetaryValue;
  public readonly countryOfOrigin?: Country;
  public readonly countryOfManufacture?: Country;
  public readonly harmonizedTariffCode: string;

  public get totalValue(): MonetaryValue {
    return new MonetaryValue({
      value: currency(this.unitValue.value).multiply(this.quantity.value).value,
      currency: this.unitValue.currency,
    });
  }

  public constructor(pojo: CustomsItemPOJO) {
    this.type = pojo.type;
    this.sku = pojo.sku || "";
    this.description = pojo.description || "";
    this.quantity = new Quantity(pojo.quantity);
    this.unitValue = new MonetaryValue(pojo.unitValue);
    this.countryOfOrigin = pojo.countryOfOrigin;
    this.countryOfManufacture = pojo.countryOfManufacture;
    this.harmonizedTariffCode = pojo.harmonizedTariffCode || "";

    // Make this object immutable
    hideAndFreeze(this);
  }
}
