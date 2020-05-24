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
 * A date/time in a specific time zone
 */
export interface DateTimeZone {
  /**
   * The date and time, without a time zone (e.g. "2005-09-23T17:30:00")
   */
  readonly value: string;

  /**
   * The UTC offset (e.g. "+05:30") or IANA time zone (e.g. "America/Los_Angeles", "Asia/Tokyo")
   *
   * @see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
   */
  readonly timeZone: string;

  /**
   * The UTC offset (e.g. "+05:30")
   */
  readonly offset: string;

  /**
   * Indicates whether the date/time is in UTC.
   */
  readonly isUTC: boolean;

  /**
   * Returns the date/time as a JavaScript `Date` object.
   *
   * NOTE: JavaScript Date objects only support local/UTC time
   */
  toDate(): Date;

  /**
   * Returns a string representation of the date/time and time zone
   */
  toString(): string;

  /**
   * Returns the date/time as an ISO 8601 string
   */
  toISOString(): string;

  /**
   * Returns the carrier as an object that can be safely serialized as JSON.
   */
  toJSON(): DateTimeZonePOJO;

  /**
   * Returns the number of milliseconds since the Unix Epoch, in UTC
   *
   * @see https://en.wikipedia.org/wiki/Unix_time
   */
  getTime(): number;

  /**
   * Returns the primitive value of the date/time. This method is used internally by the
   * JavaScript engine whenever a primitive value is expected.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf
   */
  valueOf(): number;
}
