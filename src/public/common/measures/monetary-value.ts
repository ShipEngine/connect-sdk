/**
 * A monetary value
 */
export interface MonetaryValue {
  /**
   * The amount of this value. Represented as a string to avoid floating
   * point rounding issues. You must parse this string into a type
   * appropriate for financial and monetary calculations.
   */
  value: string;

  /**
   * The currency that the value represents.
   */
  currency: string;
}
