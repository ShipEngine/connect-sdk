import { SalesOrderIdentifierConfig } from "../../config";
import { Country } from "../../countries";
import { Dimensions, MonetaryValue, Quantity, Weight } from "../../measures";
import { Identifier } from "../../types";
import { Packaging } from "../packaging";

/**
 * The package information needed to create a label
 */
export interface LabelPackage {
  /**
   * The packaging used
   */
  packaging: Packaging;

  /**
   * The package dimensions
   */
  dimensions: Dimensions;

  /**
   * The package weight
   */
  weight: Weight;

  /**
   * The insured value of this package
   */
  insuredValue: MonetaryValue;

  /**
   * Indicates whether the package contains alcohol
   */
  containsAlcohol: boolean;

  /**
   * Indicates whether the
   */
  isNonMachineable: boolean;

  /**
   * Customized strings the end user expects to appear on their label.
   * The exact location on the label depends on the carrier. Some carriers
   * may limit the number of allowed label messages, or not support them at all.
   */
  labelMessages: string[];

  /**
   * Describes the items inside the package
   */
  contents: PackageItem[];
}

/**
 * An item inside a package
 */
export interface PackageItem {
  /**
   * A description of the item. Often used for customs declarations.
   */
  description: string;

  /**
   * The Stock Keeping Unit code
   */
  sku: string;

  /**
   * Alternative identifiers associated with this item
   */
  identifiers: Identifier[];

  /**
   * The
   */
  salesOrder: SalesOrderIdentifierConfig;

  /**
   * The quantity of this item in the package. May be zero.
   */
  quantity: Quantity;

  /**
   * The monetary value of each item
   */
  unitValue: MonetaryValue;

  /**
   * The total value of this item. This is `unitValue` multiplied by `quantity`.
   */
  totalValue: MonetaryValue;

  /**
   * The country of origin, for customs declarations purposes
   */
  countryOfOrigin: Country;

  /**
   * The country of manufacture, for customs declarations purposes
   */
  countryOfManufacture: Country;

  /**
   * The Harmonized Tariff Code for the item.
   *
   * @see https://hts.usitc.gov/
   */
  harmonizedTariffCode: string;
}
