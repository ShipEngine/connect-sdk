import { IdentifierPOJO, MonetaryValuePOJO, QuantityPOJO } from "../../common";
import { Country } from "../../enums";
import { SalesOrderIdentifierPOJO } from "../../order";

/**
 * An item inside a package
 */
export interface PackageItemPOJO {
  /**
   * The Stock Keeping Unit code
   */
  sku?: string;

  /**
   * Alternative identifiers associated with this item
   */
  identifiers?: IdentifierPOJO[];

  /**
   * A description of the item. Often used for customs declarations.
   */
  description?: string;

  /**
   * The sales order associated with this item
   */
  salesOrder?: SalesOrderIdentifierPOJO;

  /**
   * The quantity of this item in the package. May be zero.
   */
  quantity: QuantityPOJO;

  /**
   * The monetary value of each item
   */
  unitValue: MonetaryValuePOJO;

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
