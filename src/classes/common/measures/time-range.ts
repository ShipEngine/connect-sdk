import { hideAndFreeze, Joi, _internal } from "../../../internal";
import { TimeRangePOJO } from "../../../pojos/common";

/**
 * A range of time
 */
export class TimeRange {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "time range",
    schema: Joi.object({
      startDateTime: Joi.date().required(),
      endDateTime: Joi.date().required(),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The start date/time of the range
   */
  public readonly startDateTime: Date;

  /**
   * The end date/time of the range
   */
  public readonly endDateTime: Date;

  //#endregion

  public constructor(pojo: TimeRangePOJO) {
    this.startDateTime = pojo.startDateTime;
    this.endDateTime = pojo.endDateTime;

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
