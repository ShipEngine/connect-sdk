import { hideAndFreeze, Joi, _internal } from "../../internal";
import { DateTimeZone, DateTimeZonePOJO } from "./date-time-zone";

/**
 * A range of time
 */
export interface TimeRangePOJO {
  /**
   * The start date/time of the range
   */
  startDateTime: DateTimeZonePOJO | Date | string;

  /**
   * The end date/time of the range
   */
  endDateTime: DateTimeZonePOJO | Date | string;
}


/**
 * A range of time
 */
export class TimeRange {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "time range",
    schema: Joi.object({
      startDateTime: DateTimeZone[_internal].schema.required(),
      endDateTime: DateTimeZone[_internal].schema.required(),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The start date/time of the range
   */
  public readonly startDateTime: DateTimeZone;

  /**
   * The end date/time of the range
   */
  public readonly endDateTime: DateTimeZone;

  //#endregion

  public constructor(pojo: TimeRangePOJO) {
    this.startDateTime = new DateTimeZone(pojo.startDateTime);
    this.endDateTime = new DateTimeZone(pojo.endDateTime);

    if (this.endDateTime.getTime() < this.startDateTime.getTime()) {
      throw new RangeError(`Invalid time range: ${this.toString()}. The start date occurs after the end date.`);
    }

    // Make this object immutable
    hideAndFreeze(this);
  }

  /**
   * Returns the time range as a string
   */
  public toString() {
    return `${this.startDateTime.toISOString()} - ${this.endDateTime.toISOString()}`;
  }
}

// Prevent modifications to the class
hideAndFreeze(TimeRange);
