import { toDate } from "date-fns-tz";
import { hideAndFreeze, Joi, regex, _internal } from "../../../internal";
import { DateTimeZonePOJO } from "../../../pojos/common";

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
   * Indicates whether the `timeZone` is UTC. Use this property rather than comparing the
   * `timeZone` property to a string like "UTC", "Zulu", "+00:00", etc.
   */
  public get isUTC(): boolean {
    let utc = this.toDate().toISOString();
    return utc.startsWith(this.value);
  }

  /**
   * Indicates whether the `timeZone` is a UTC offset (e.g. "+05:30")
   */
  public get isUTCOffset(): boolean {
    let { timeZone } = this;
    return timeZone[0] === "+" || timeZone[0] === "-";
  }

  /**
   * Indicates whether the `timeZone` is an IANA time zone (e.g. "America/Los_Angeles", "Asia/Tokyo")
   */
  public get isIANATimeZone(): boolean {
    return !this.isUTCOffset;
  }

  //#endregion

  public constructor(pojo: Date | string | DateTimeZonePOJO) {
    if (typeof pojo === "string") {
      pojo = DateTimeZone.parse(pojo);
    }
    else if (pojo instanceof Date) {
      pojo = {
        value: pojo.toISOString().slice(0, 23),
        timeZone: "UTC",
      };
    }

    this.value = pojo.value;
    this.timeZone = pojo.timeZone;

    // Make this object immutable
    hideAndFreeze(this);
  }

  /**
   * Parses an ISO 8601 date/time string with a time zone
   */
  private static parse(isoDateTime: string): DateTimeZonePOJO {
    let [, value, timeZone] = regex.isoDateTime.exec(isoDateTime)!;
    if (timeZone === "Z") {
      timeZone = "UTC";
    }
    return { value, timeZone };
  }

  /**
   * Returns the date/time as a JavaScript `Date` object.
   *
   * NOTE: JavaScript Date objects only support local/UTC time
   */
  public toDate(): Date {
    let { value, timeZone, isUTCOffset } = this;
    return isUTCOffset ? new Date(value + timeZone) : toDate(value, { timeZone });
  }

  /**
   * Returns a string representation of the date/time and time zone
   */
  public toString(): string {
    let { value, timeZone, isUTCOffset } = this;
    return isUTCOffset ? value + timeZone : `${value} ${timeZone}`;
  }

  /**
   * Returns the date/time as an ISO 8601 string, preserving the time zone if possible
   */
  public toISOString(): string {
    let { value, timeZone, isUTCOffset } = this;
    return isUTCOffset ? value + timeZone : this.toDate().toISOString();
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
}

// Prevent modifications to the class
hideAndFreeze(DateTimeZone);
