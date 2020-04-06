import { Currency, LengthUnit, QuantityUnit, WeightUnit } from "../measures";

/**
 * The dimensions of a package
 */
export interface DimensionsConfig {
  length: number;
  width: number;
  height: number;
  unit: LengthUnit;
}

/**
 * The weight of a package
 */
export interface WeightConfig {
  value: number;
  unit: WeightUnit;
}

/**
 * The quantity of items in a package
 */
export interface QuantityConfig {
  value: number;
  unit: QuantityUnit;
}

/**
 * A monetary value in a supported currency
 */
export interface MonetaryValueConfig {
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
