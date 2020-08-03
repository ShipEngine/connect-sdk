import { SalesOrderTimeRange as ISalesOrderTimeRange, SalesOrderTimeRange as SalesOrderTimeRangePOJO } from "../../definitions";
import { hideAndFreeze, Joi, TimeRange, TimeRangeBase, _internal } from "../common";

export class SalesOrderTimeRange extends TimeRangeBase implements ISalesOrderTimeRange {
  public static [_internal] = {
    label: "time range",
    schema: TimeRange[_internal].schema.keys({
      includeChanges: Joi.boolean(),
      paging: Joi.object({
        pageSize: Joi.number().integer().min(1).required(),
        pageNumber: Joi.number().integer().min(0).required(),
        pageCount: Joi.number().integer().min(1),
        cursor: Joi.string()
      })
    })
  };

  public includeChanges: boolean;
  public paging?: {
    pageSize: number;
    pageNumber: number;
    pageCount?: number;
    cursor?: string;
  };

  public constructor(pojo: SalesOrderTimeRangePOJO) {
    super(pojo);

    this.includeChanges = pojo.includeChanges || false;

    this.paging = pojo.paging;

    // Make this object immutable
    hideAndFreeze(this);
  }
}
