// tslint:disable: max-classes-per-file
import { ErrorCode } from "../errors";
import { error, hideAndFreeze, _internal } from "../internal/utils";
import { Joi } from "../internal/validation";
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
 * Abstract base class for date/time ranges
 */
export abstract class TimeRangeBase {
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
      throw error(ErrorCode.Validation,
        `Invalid time range: ${this.toString()}. The start date occurs after the end date.`);
    }
  }

  /**
   * Returns the time range as a string
   */
  public toString() {
    return `${this.startDateTime.toISOString()} - ${this.endDateTime.toISOString()}`;
  }
}


/**
 * A range of time
 */
export class TimeRange extends TimeRangeBase {
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

  public constructor(pojo: TimeRangePOJO) {
    super(pojo);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(TimeRange);
