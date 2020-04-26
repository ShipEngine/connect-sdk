import { zonedTimeToUtc } from "date-fns-tz";
import { TimeRangePOJO } from "../../../pojos/carrier";
import { Joi } from "../../../validation";

/**
 * A range of time
 */
export class TimeRange {
  //#region Class Fields

  public static readonly label = "time range";

  /** @internal */
  public static readonly schema = Joi.object({
    startDateTime: Joi.alternatives(Joi.date(), Joi.string().isoDate()).required(),
    endDateTime: Joi.alternatives(Joi.date(), Joi.string().isoDate()).required(),
    timeZone: Joi.string().trim().singleLine().min(1).max(50),
  });

  //#endregion
  //#region Instance Fields

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

  //#endregion

  public constructor(pojo: TimeRangePOJO) {
    this.timeZone = pojo.timeZone;
    this.startDateTime = validateDate(pojo.startDateTime, this.timeZone);
    this.endDateTime = validateDate(pojo.endDateTime, this.timeZone);

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
 * Parses a ISO 8601 string in the specified time zone
 */
function validateDate(value: Date | string, timeZone: string): Date {
  if (value instanceof Date) {
    return value;
  }
  else {
    return zonedTimeToUtc(value, timeZone);
  }
}
