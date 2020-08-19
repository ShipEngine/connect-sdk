import { SalesOrderPaging, SalesOrderTimeRange as ISalesOrderTimeRange, TimeRangePOJO } from "../../public";
import { hideAndFreeze, Joi, TimeRange, TimeRangeBase, _internal } from "../common";


export interface SalesOrderTimeRangePOJO extends TimeRangePOJO {
  paging: SalesOrderPaging;
}


export class SalesOrderTimeRange extends TimeRangeBase implements ISalesOrderTimeRange {
  public static readonly [_internal] = {
    label: "time range",
    schema: TimeRange[_internal].schema.keys({
      paging: Joi.object({
        pageSize: Joi.number().integer().min(1).required(),
        pageNumber: Joi.number().integer().min(0),
        pageCount: Joi.number().integer().min(1),
        cursor: Joi.string()
      })
    })
  };

  public readonly paging: {
    readonly pageSize: number;
    readonly pageNumber?: number;
    readonly pageCount: number;
    readonly cursor?: string;
  };

  public constructor(pojo: SalesOrderTimeRangePOJO) {
    super(pojo);

    this.paging = pojo.paging;

    // Make this object immutable
    hideAndFreeze(this);
  }
}
