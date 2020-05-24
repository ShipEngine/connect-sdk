import { SalesOrderTimeRange as ISalesOrderTimeRange, SalesOrderTimeRangePOJO } from "../../public";
import { hideAndFreeze, Joi, TimeRange, TimeRangeBase, _internal } from "../common";

export class SalesOrderTimeRange extends TimeRangeBase implements ISalesOrderTimeRange {
  public static readonly [_internal] = {
    label: "time range",
    schema: TimeRange[_internal].schema.keys({
      includeChanges: Joi.boolean(),
    }),
  };

  public readonly includeChanges: boolean;

  public constructor(pojo: SalesOrderTimeRangePOJO) {
    super(pojo);

    this.includeChanges = pojo.includeChanges || false;

    // Make this object immutable
    hideAndFreeze(this);
  }
}
