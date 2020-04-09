import * as currency from "currency.js";
import { assert } from "./assert";
import { PackageItemConfig } from "./config/package-item-config";
import { Country } from "./countries";
import { MonetaryValue, Quantity } from "./measures";
import { SalesOrderIdentifier } from "./sales-order";
import { Identifier } from "./types";

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

  public constructor(config: PackageItemConfig) {
    assert.type.object(config, "package item");
    this.sku = config.sku && assert.string.nonWhitespace(config.sku, "SKU");
    this.identifiers = assert.array.ofIdentifiers(config.identifiers, "identifiers", []);
    this.description = assert.string(config.description, "item description", "");
    this.salesOrder = config.salesOrder && new SalesOrderIdentifier(config.salesOrder);
    this.quantity = new Quantity(config.quantity);
    this.unitValue = new MonetaryValue(config.unitValue);
    this.countryOfOrigin = config.countryOfOrigin
      && assert.string.enum(config.countryOfOrigin, Country, "origin country");
    this.countryOfManufacture = config.countryOfManufacture
      && assert.string.enum(config.countryOfManufacture, Country, "country of manufacture");
    this.harmonizedTariffCode = config.harmonizedTariffCode
      && assert.string.nonWhitespace(config.harmonizedTariffCode, "harmonized tariff code");

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.identifiers);
  }
}
