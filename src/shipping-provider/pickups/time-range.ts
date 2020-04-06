import { zonedTimeToUtc } from "date-fns-tz";
import { assert } from "../../assert";
import { TimeRangeConfig } from "../../config";

const iso8601 = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?/;
iso8601.examples = ["yyyy-mm-dd", "yyyy-mm-ddThh:mm"];

/**
 * A range of time
 */
export class TimeRange {
  /**
   * The start date/time of the range
   */
  public readonly start: Date;

  /**
   * The end date/time of the range
   */
  public readonly end: Date;

  /**
   * The local time zone, as an IANA name (e.g. "America/Los_Angeles", "Asia/Tokyo").
   * This can be used to format the `start` and `end` dates in local time.
   *
   * @see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
   */
  public readonly timeZone: string;

  /**
   * Creates a TimeRange from a config object
   */
  public constructor(config: TimeRangeConfig) {
    assert.type.object(config, "time range");
    this.timeZone = assert.string.nonWhitespace(config.timeZone, "IANA time zone");
    this.start = validateDate(config.start, "start date/time", this.timeZone);
    this.end = validateDate(config.start, "end date/time", this.timeZone);

    if (this.end.getTime() < this.start.getTime()) {
      throw new RangeError(
        `Invalid time range: ${this.start.toISOString()} - ${this.end.toISOString()}. ` +
        "The start date occurs after the end date."
      );
    }

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.start);
    Object.freeze(this.end);
  }
}

/**
 * Validates a Date or ISO 8601 string
 */
function validateDate(value: Date | string, fieldName: string, timeZone: string): Date {
  let date: Date;

  if (value instanceof Date) {
    date = value;
  }
  else {
    assert.string.pattern(value, iso8601, fieldName);
    date = zonedTimeToUtc(value, timeZone);
  }

  return assert.type.date(date, fieldName);
}
