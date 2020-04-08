/**
 * A range of time
 */
export interface TimeRangeConfig {
  /**
   * The start date/time of the range. Can be specified as a Date object or an ISO 8601 string.
   *
   * @see https://en.wikipedia.org/wiki/ISO_8601
   */
  startDateTime: Date | string;

  /**
   * The end date/time of the range. Can be specified as a Date object or an ISO 8601 string.
   *
   * @see https://en.wikipedia.org/wiki/ISO_8601
   */
  endDateTime: Date | string;

  /**
   * The local time zone, as an IANA name (e.g. "America/Los_Angeles", "Asia/Tokyo").
   * This can be used to format the `start` and `end` dates in local time.
   *
   * @see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
   */
  timeZone: string;
}
