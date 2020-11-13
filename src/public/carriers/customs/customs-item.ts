import type { Country, MonetaryValuePOJO, QuantityPOJO } from "../../common";
import type { CustomsItemType } from "../enums";

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
   * The quantity of this item in the package
   */
  quantity: QuantityPOJO;

  /**
   * The monetary value of each item
   */
  unitValue: MonetaryValuePOJO;

  /**
   * The country of origin. This is usually the same as `countryOfManufacture`,
   * but some countries distinguish between the two for certain products.
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

export interface CustomsItem {
  /**
   * The customs type category
   */
  readonly type: CustomsItemType;

  /**
   * The Stock Keeping Unit code
   */
  readonly sku: string;

  /**
   * A description of the item. Usually required if `type` is `other`.
   */
  readonly description: string;

  /**
   * The quantity of this item in the package
   */
  readonly quantity: QuantityPOJO;

  /**
   * The monetary value of each item
   */
  readonly unitValue: MonetaryValuePOJO;

  /**
   * The country of origin. This is usually the same as `countryOfManufacture`,
   * but some countries distinguish between the two for certain products.
   */
  readonly countryOfOrigin?: Country;

  /**
   * The country where the item was manufactured
   */
  readonly countryOfManufacture?: Country;

  /**
   * The Harmonized Tariff Code for the item.
   *
   * @see https://hts.usitc.gov/
   */
  readonly harmonizedTariffCode: string;
}
