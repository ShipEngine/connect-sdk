import * as moment from "moment-timezone";
import { DateTimeZone as IDateTimeZone, DateTimeZonePOJO } from "../../../public";
import { hideAndFreeze, regex, _internal } from "../utils";
import { Joi } from "../validation";

export class DateTimeZone implements IDateTimeZone {
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

  public readonly value: string;
  public readonly timeZone: string;
  public readonly offset: string;

  public get isUTC(): boolean {
    return this.offset.slice(1) === "00:00";
  }

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

    const { value, timeZone } = pojo;

    this.value = value;
    this.timeZone = timeZone;

    if (timeZone.startsWith("+") || timeZone.startsWith("-")) {
      // The timeZone is already a UTC offset
      this.offset = timeZone;
    }
    else {
      // Get the UTC offset for this date/time and time zone
      this.offset = moment.tz(value, timeZone).format("Z");
    }

    // Make this object immutable
    hideAndFreeze(this);
  }

  public toDate(): Date {
    const { value, offset } = this;
    return new Date(value + offset);
  }

  public toString(): string {
    const { value, timeZone, offset } = this;
    return timeZone === offset ? value + offset : `${value} ${timeZone}`;
  }

  public toISOString(): string {
    const { value, offset } = this;
    return value + offset;
  }

  public toJSON(): DateTimeZonePOJO {
    const { value, timeZone } = this;
    return { value, timeZone };
  }

  public getTime(): number {
    return this.toDate().getTime();
  }

  public valueOf(): number {
    return this.toDate().getTime();
  }
}


/**
 * Parses an ISO 8601 date/time string with a time zone
 */
function parse(isoDateTime: string): DateTimeZonePOJO {
  // eslint-disable-next-line prefer-const
  let [, value, timeZone] = regex.isoDateTime.exec(isoDateTime)!;
  if (timeZone === "Z") {
    timeZone = "UTC";
  }
  return { value, timeZone };
}
