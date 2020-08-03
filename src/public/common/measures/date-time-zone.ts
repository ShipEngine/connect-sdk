/**
 * A date/time in a specific time zone
 */
export interface DateTimeZone {
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
