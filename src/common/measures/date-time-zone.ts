import { format, toDate } from "date-fns-tz";
import { hideAndFreeze, regex, _internal } from "../internal/utils";
import { Joi } from "../internal/validation";

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
export class DateTimeZone {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "date/time",
    schema: Joi.alternatives(
      Joi.date(),
      Joi.string().isoDateTime({ timeZone: true }),
      Joi.object({
        value: Joi.string().isoDateTime({ timeZone: false }).required(),
        timeZone: Joi.string().timeZone().required(),
      })
    ),
  };

  //#endregion
  //#region Public Fields

  /**
   * The date and time, without a time zone (e.g. "2005-09-23T17:30:00")
   */
  public readonly value: string;

  /**
   * The UTC offset (e.g. "+05:30") or IANA time zone (e.g. "America/Los_Angeles", "Asia/Tokyo")
   *
   * @see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
   */
  public readonly timeZone: string;

  /**
   * The UTC offset (e.g. "+05:30")
   */
  public readonly offset: string;

  /**
   * Indicates whether the date/time is in UTC.
   */
  public get isUTC(): boolean {
    return this.offset.slice(1) === "00:00";
  }

  //#endregion

  public constructor(pojo: DateTimeZonePOJO | Date | string) {
    if (typeof pojo === "string") {
      pojo = parse(pojo);
    }
    else if (pojo instanceof Date) {
      pojo = {
        value: pojo.toISOString().slice(0, 23),
        timeZone: "UTC",
      };
    }

    let { value, timeZone } = pojo;

    this.value = value;
    this.timeZone = timeZone;

    if (timeZone[0] === "+" || timeZone[0] === "-") {
      // The timeZone is already a UTC offset
      this.offset = timeZone;
    }
    else {
      // Get the UTC offset for this date/time and time zone
      this.offset = format(toDate(value, { timeZone }), "xxx", { timeZone });
    }

    // Make this object immutable
    hideAndFreeze(this);
  }

  //#region Date methods

  /**
   * Returns the date/time as a JavaScript `Date` object.
   *
   * NOTE: JavaScript Date objects only support local/UTC time
   */
  public toDate(): Date {
    let { value, offset } = this;
    return new Date(value + offset);
  }

  /**
   * Returns a string representation of the date/time and time zone
   */
  public toString(): string {
    let { value, timeZone, offset } = this;
    return timeZone === offset ? value + offset : `${value} ${timeZone}`;
  }

  /**
   * Returns the date/time as an ISO 8601 string
   */
  public toISOString(): string {
    let { value, offset } = this;
    return value + offset;
  }

  /**
   * Returns the carrier as a POJO that can be safely serialized as JSON.
   */
  public toJSON(): DateTimeZonePOJO {
    let { value, timeZone } = this;
    return { value, timeZone };
  }

  /**
   * Returns the number of milliseconds since the Unix Epoch, in UTC
   *
   * @see https://en.wikipedia.org/wiki/Unix_time
   */
  public getTime(): number {
    return this.toDate().getTime();
  }

  /**
   * Returns the primitive value of the date/time. This method is used internally by the
   * JavaScript engine whenever a primitive value is expected.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf
   */
  public valueOf(): number {
    return this.toDate().getTime();
  }

  //#endregion
}

// Prevent modifications to the class
hideAndFreeze(DateTimeZone);

/**
 * Parses an ISO 8601 date/time string with a time zone
 */
function parse(isoDateTime: string): DateTimeZonePOJO {
  let [, value, timeZone] = regex.isoDateTime.exec(isoDateTime)!;
  if (timeZone === "Z") {
    timeZone = "UTC";
  }
  return { value, timeZone };
}
