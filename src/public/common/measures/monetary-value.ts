/**
 * A monetary value
 */
export interface MonetaryValuePOJO {
  /**
   * The amount of this value.
   *
   * NOTE: We recommend using a string value to avoid floating point rounding issues.
   */
  value: string;

  /**
   * The currency that the value represents.
   */
  currency: string;
}

/**
 * A monetary value
 */
export interface MonetaryValue {
  /**
   * The amount of this value. Represented as a string to avoid floating
   * point rounding issues. You must parse this string into a type
   * appropriate for financial and monetary calculations.
   */
  readonly value: string;

  /**
   * The currency that the value represents.
   */
  readonly currency: string;
}
