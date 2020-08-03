import type { DateTimeZone } from "./date-time-zone";

/**
 * A range of time
 */
export interface TimeRange{
  /**
   * The start date/time of the range
   */
  startDateTime: DateTimeZone;

  /**
   * The end date/time of the range
   */
  endDateTime: DateTimeZone;
}
