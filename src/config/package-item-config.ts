import { Country } from "../countries";
import { Identifier } from "../types";
import { MonetaryValueConfig, QuantityConfig } from "./measures-config";
import { SalesOrderIdentifierConfig } from "./sales-order-config";

/**
 * An item inside a package
 */
export interface PackageItemConfig {
  /**
   * The Stock Keeping Unit code
   */
  sku?: string;

  /**
   * Alternative identifiers associated with this item
   */
  identifiers?: Identifier[];

  /**
   * A description of the item. Often used for customs declarations.
   */
  description?: string;

  /**
   * The sales order associated with this item
   */
  salesOrder?: SalesOrderIdentifierConfig;

  /**
   * The quantity of this item in the package. May be zero.
   */
  quantity: QuantityConfig;

  /**
   * The monetary value of each item
   */
  unitValue: MonetaryValueConfig;

  /**
   * The country of origin, for customs declarations purposes
   */
  countryOfOrigin?: Country;

  /**
   * The country of manufacture, for customs declarations purposes
   */
  countryOfManufacture?: Country;

  /**
   * The Harmonized Tariff Code for the item.
   *
   * @see https://hts.usitc.gov/
   */
  harmonizedTariffCode?: string;
}
