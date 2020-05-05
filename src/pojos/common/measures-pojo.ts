import { Currency, LengthUnit, QuantityUnit, WeightUnit } from "../../enums";

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

/**
 * A date/time in a specific time zone
 */
export interface DateTimeZonePOJO {
  /**
   * The date and time, without a time zone (e.g. "2005-09-23T17:30:00")
   */
  value: string;

  /**
   * The UTC offset (e.g. "+05:30") or IANA time zone (e.g. "America/Los_Angeles", "Asia/Tokyo")
   *
   * @see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
   */
  timeZone: string;
}

/**
 * A range of time
 */
export interface TimeRangePOJO {
  /**
   * The start date/time of the range
   */
  startDateTime: DateTimeZonePOJO | Date | string;

  /**
   * The end date/time of the range
   */
  endDateTime: DateTimeZonePOJO | Date | string;
}
