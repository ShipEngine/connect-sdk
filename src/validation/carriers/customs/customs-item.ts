import * as currency from "currency.js";
import { Country, CustomsItem as ICustomsItem, CustomsItem as CustomsItemPOJO, CustomsItemType } from "../../../definitions";
import { hideAndFreeze, Joi, MonetaryValue,  _internal } from "../../common";

export class CustomsItem implements ICustomsItem {
  public static [_internal] = {
    label: "customs item",
    schema: Joi.object({
      type: Joi.string().enum(CustomsItemType).required(),
      sku: Joi.string().trim().singleLine().allow("").max(100),
      description: Joi.string().trim().singleLine().allow("").max(1000),
      quantity: Joi.number().required(),
      unitValue: MonetaryValue[_internal].schema.required(),
      countryOfOrigin: Joi.string().enum(Country),
      countryOfManufacture: Joi.string().enum(Country),
      harmonizedTariffCode: Joi.string().trim().singleLine().allow("").max(30),
    }),
  };

  public type: CustomsItemType;
  public sku: string;
  public description: string;
  public quantity: Number;
  public unitValue: MonetaryValue;
  public countryOfOrigin?: Country;
  public countryOfManufacture?: Country;
  public harmonizedTariffCode: string;

  public get totalValue(): MonetaryValue {
    return new MonetaryValue({
      value: currency(this.unitValue.value).multiply(this.quantity as number).toString(),
      currency: this.unitValue.currency,
    });
  }

  public constructor(pojo: CustomsItemPOJO) {
    this.type = pojo.type;
    this.sku = pojo.sku || "";
    this.description = pojo.description || "";
    this.quantity = pojo.quantity;
    this.unitValue = new MonetaryValue(pojo.unitValue);
    this.countryOfOrigin = pojo.countryOfOrigin;
    this.countryOfManufacture = pojo.countryOfManufacture;
    this.harmonizedTariffCode = pojo.harmonizedTariffCode || "";

    // Make this object immutable
    hideAndFreeze(this);
  }
}
