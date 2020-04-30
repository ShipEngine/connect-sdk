import * as currency from "currency.js";
import { Country } from "../../countries";
import { PackageItemPOJO } from "../../pojos/carrier";
import { Joi } from "../../validation";
import { Identifier, MonetaryValue, Quantity } from "../common";
import { SalesOrderIdentifier } from "../order/sales-order";
import { hideAndFreeze, _internal } from "../utils";

/**
 * An item inside a package
 */
export class PackageItem {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "package item",
    schema: Joi.object({
      sku: Joi.string().trim().singleLine().allow("").max(100),
      identifiers: Joi.array().items(Identifier[_internal].schema),
      description: Joi.string().trim().singleLine().allow("").max(1000),
      salesOrder: SalesOrderIdentifier[_internal].schema,
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
   * The Stock Keeping Unit code
   */
  public readonly sku: string;

  /**
   * Alternative identifiers associated with this item
   */
  public readonly identifiers: ReadonlyArray<Identifier>;

  /**
   * A description of the item. Often used for customs declarations.
   */
  public readonly description: string;

  /**
   * The sales order associated with this item
   */
  public readonly salesOrder?: SalesOrderIdentifier;

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
   * The country of origin, for customs declarations purposes
   */
  public readonly countryOfOrigin?: Country;

  /**
   * The country of manufacture, for customs declarations purposes
   */
  public readonly countryOfManufacture?: Country;

  /**
   * The Harmonized Tariff Code for the item.
   *
   * @see https://hts.usitc.gov/
   */
  public readonly harmonizedTariffCode: string;

  //#endregion

  public constructor(pojo: PackageItemPOJO) {
    this.sku = pojo.sku || "";
    this.identifiers = pojo.identifiers ? pojo.identifiers.map((id) => new Identifier(id)) : [];
    this.description = pojo.description || "";
    this.salesOrder = pojo.salesOrder && new SalesOrderIdentifier(pojo.salesOrder);
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
hideAndFreeze(PackageItem);
