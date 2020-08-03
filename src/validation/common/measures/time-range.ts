import { ErrorCode, TimeRange as ITimeRange, TimeRange as TimeRangePOJO } from "../../../definitions";
import { error } from "../errors";
import { hideAndFreeze, _internal } from "../utils";
import { Joi } from "../validation";
import { DateTimeZone } from "./date-time-zone";

export abstract class TimeRangeBase implements ITimeRange {
  public startDateTime: DateTimeZone;
  public endDateTime: DateTimeZone;

  public constructor(pojo: TimeRangePOJO) {
    this.startDateTime = new DateTimeZone(pojo.startDateTime);
    this.endDateTime = new DateTimeZone(pojo.endDateTime);

    if (this.endDateTime.getTime() < this.startDateTime.getTime()) {
      throw error(ErrorCode.Validation,
        `Invalid time range: ${this.toString()}. The start date occurs after the end date.`);
    }
  }

  public toString() {
    return `${this.startDateTime.toISOString()} - ${this.endDateTime.toISOString()}`;
  }
}


export class TimeRange extends TimeRangeBase {
  public static [_internal] = {
    label: "time range",
    schema: Joi.object({
      startDateTime: DateTimeZone[_internal].schema.required(),
      endDateTime: DateTimeZone[_internal].schema.required(),
    }),
  };

  public constructor(pojo: TimeRangePOJO) {
    super(pojo);

    // Make this object immutable
    hideAndFreeze(this);
  }
}
