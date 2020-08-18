import type { DateTimeZone, DateTimeZonePOJO } from "./date-time-zone";

/**
 * A range of time
 */
export interface TimeRangePOJO {
  /**
   * The start date/time of the range
   */
  startDateTime?: DateTimeZonePOJO | Date | string;

  /**
   * The end date/time of the range
   */
  endDateTime?: DateTimeZonePOJO | Date | string;
}


/**
 * A range of time
 */
export interface TimeRange {
  /**
   * The start date/time of the range
   */
  readonly startDateTime?: DateTimeZone;

  /**
   * The end date/time of the range
   */
  readonly endDateTime?: DateTimeZone;

  /**
   * Returns the time range as a string, if available
   */
  toString(): string;
}
