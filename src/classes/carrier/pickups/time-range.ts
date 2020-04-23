import { zonedTimeToUtc } from "date-fns-tz";
import { assert } from "../../../assert";
import { TimeRangePOJO } from "../../../pojos";

const iso8601 = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?/;
iso8601.examples = ["yyyy-mm-dd", "yyyy-mm-ddThh:mm"];

/**
 * A range of time
 */
export class TimeRange {
  /**
   * The start date/time of the range
   */
  public readonly startDateTime: Date;

  /**
   * The end date/time of the range
   */
  public readonly endDateTime: Date;

  /**
   * The local time zone, as an IANA name (e.g. "America/Los_Angeles", "Asia/Tokyo").
   * This can be used to format the `start` and `end` dates in local time.
   *
   * @see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
   */
  public readonly timeZone: string;

  public constructor(pojo: TimeRangePOJO) {
    assert.type.object(pojo, "time range");
    this.timeZone = assert.string.nonWhitespace(pojo.timeZone, "IANA time zone");
    this.startDateTime = validateDate(pojo.startDateTime, "start date/time", this.timeZone);
    this.endDateTime = validateDate(pojo.startDateTime, "end date/time", this.timeZone);

    if (this.endDateTime.getTime() < this.startDateTime.getTime()) {
      throw new RangeError(
        `Invalid time range: ${this.startDateTime.toISOString()} - ${this.endDateTime.toISOString()}. ` +
        "The start date occurs after the end date."
      );
    }

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.startDateTime);
    Object.freeze(this.endDateTime);
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
