import { Currency, LengthUnit, QuantityUnit, WeightUnit } from "../enums";

/**
 * The dimensions of a package
 */
export interface DimensionsPOJO {
  length: number;
  width: number;
  height: number;
  unit: LengthUnit;
}

/**
 * The weight of a package
 */
export interface WeightPOJO {
  value: number;
  unit: WeightUnit;
}

/**
 * The quantity of items in a package
 */
export interface QuantityPOJO {
  value: number;
  unit: QuantityUnit;
}

/**
 * A monetary value in a supported currency
 */
export interface MonetaryValuePOJO {
  /**
   * The amount of this value.
   *
   * NOTE: We recommend using a string value to avoid floating point rounding issues.
   */
  value: number | string;

  /**
   * The currency that the value represents.
   */
  currency: Currency;
}
