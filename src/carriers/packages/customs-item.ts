import * as currency from "currency.js";
import { Country, MonetaryValue, Quantity } from "../../common";
import { hideAndFreeze, Joi, _internal } from "../../common/internal";
import { CustomsItemType } from "../enums";
import { CustomsItemPOJO } from "./customs-item-pojo";

/**
 * Customs declarations for an item in a package
 */
export class CustomsItem {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "customs item",
    schema: Joi.object({
      type: Joi.string().enum(CustomsItemType).required(),
      sku: Joi.string().trim().singleLine().allow("").max(100),
      description: Joi.string().trim().singleLine().allow("").max(1000),
      quantity: Quantity[_internal].schema.required(),
      unitValue: MonetaryValue[_internal].schema.required(),
      countryOfOrigin: Joi.string().enum(Country),
      countryOfManufacture: Joi.string().enum(Country),
      harmonizedTariffCode: Joi.string().trim().singleLine().allow("").max(30),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The customs type category
   */
  public readonly type: CustomsItemType;

  /**
   * The Stock Keeping Unit code
   */
  public readonly sku: string;

  /**
   * A description of the item. Usually required if `type` is `other`.
   */
  public readonly description: string;

  /**
   * The quantity of this item in the package. May be zero.
   */
  public readonly quantity: Quantity;

  /**
   * The monetary value of each item
   */
  public readonly unitValue: MonetaryValue;

  /**
   * The total value of this item. This is `unitValue` multiplied by `quantity`.
   */
  public get totalValue(): MonetaryValue {
    return new MonetaryValue({
      value: currency(this.unitValue.value).multiply(this.quantity.value).toString(),
      currency: this.unitValue.currency,
    });
  }

  /**
   * The country of origin. This is usually the same as `countryOfManufacture`,
   * but some countries distinguish between the two for certain prodocuts.
   */
  public readonly countryOfOrigin?: Country;

  /**
   * The country where the item was manufactured
   */
  public readonly countryOfManufacture?: Country;

  /**
   * The Harmonized Tariff Code for the item.
   *
   * @see https://hts.usitc.gov/
   */
  public readonly harmonizedTariffCode: string;

  //#endregion

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

// Prevent modifications to the class
hideAndFreeze(CustomsItem);
