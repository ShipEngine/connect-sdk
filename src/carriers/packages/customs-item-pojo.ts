import { Country, MonetaryValuePOJO, QuantityPOJO } from "../../common";
import { CustomsItemType } from "../enums";

/**
 * Customs declarations for an item in a package
 */
export interface CustomsItemPOJO {
  /**
   * The customs type category
   */
  type: CustomsItemType;

  /**
   * The Stock Keeping Unit code
   */
  sku?: string;

  /**
   * A description of the item. Usually required if `type` is `other`.
   */
  description?: string;

  /**
   * The quantity of this item in the package. May be zero.
   */
  quantity: QuantityPOJO;

  /**
   * The monetary value of each item
   */
  unitValue: MonetaryValuePOJO;

  /**
   * The country of origin. This is usually the same as `countryOfManufacture`,
   * but some countries distinguish between the two for certain prodocuts.
   */
  countryOfOrigin?: Country;

  /**
   * The country where the item was manufactured
   */
  countryOfManufacture?: Country;

  /**
   * The Harmonized Tariff Code for the item.
   *
   * @see https://hts.usitc.gov/
   */
  harmonizedTariffCode?: string;
}
