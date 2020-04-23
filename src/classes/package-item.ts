import * as currency from "currency.js";
import { assert } from "../assert";
import { Country } from "../countries";
import { PackageItemPOJO } from "../pojos";
import { Identifier } from "../types";
import { MonetaryValue } from "./monetary-value";
import { Quantity } from "./quantity";
import { SalesOrderIdentifier } from "./sales-order";

/**
 * An item inside a package
 */
export class PackageItem {
  /**
   * The Stock Keeping Unit code
   */
  public readonly sku?: string;

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
  public readonly harmonizedTariffCode?: string;

  public constructor(pojo: PackageItemPOJO) {
    assert.type.object(pojo, "package item");
    this.sku = pojo.sku && assert.string.nonWhitespace(pojo.sku, "SKU");
    this.identifiers = assert.array.ofIdentifiers(pojo.identifiers, "identifiers", []);
    this.description = assert.string(pojo.description, "item description", "");
    this.salesOrder = pojo.salesOrder && new SalesOrderIdentifier(pojo.salesOrder);
    this.quantity = new Quantity(pojo.quantity);
    this.unitValue = new MonetaryValue(pojo.unitValue);
    this.countryOfOrigin = pojo.countryOfOrigin
      && assert.string.enum(pojo.countryOfOrigin, Country, "origin country");
    this.countryOfManufacture = pojo.countryOfManufacture
      && assert.string.enum(pojo.countryOfManufacture, Country, "country of manufacture");
    this.harmonizedTariffCode = pojo.harmonizedTariffCode
      && assert.string.nonWhitespace(pojo.harmonizedTariffCode, "harmonized tariff code");

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.identifiers);
  }
}
