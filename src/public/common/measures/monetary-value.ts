/**
 * An ISO 4217 currency code that is supported by ShipEngine
 *
 * @see https://en.wikipedia.org/wiki/ISO_4217
 */
export enum Currency {
  UnitedStatesDollar = "USD",
  CanadianDollar = "CAD",
  AustralianDollar = "AUD",
  GreatBritishPound = "GBP",
  Euro = "EUR",
  NewZealandDollar = "NZD",
}

/**
 * A monetary value in a supported currency
 */
export interface MonetaryValuePOJO {
  /**
   * The amount of this value.
   */
  // We need this to be a number so we can compute totals for each charge type
  value: number;

  /**
   * The currency that the value represents.
   */
  // The platform supports arbitrary currency codes; it doesn't seem like a good idea to tie ourselves to an enum for this
  currency: string;
}

/**
 * A monetary value in a supported currency
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
  readonly currency: Currency;
}
