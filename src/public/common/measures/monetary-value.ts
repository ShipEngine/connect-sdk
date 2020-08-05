/**
 * A monetary value
 */
export interface MonetaryValuePOJO {
  /**
   * The amount of this value.
   */
  value: number;

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
   * The amount of this value.
   */
  readonly value: number;

  /**
   * The currency that the value represents.
   */
  readonly currency: string;
}
