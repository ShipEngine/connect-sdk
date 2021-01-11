import Joi = require("joi");
import {
  SalesOrderPaging as SalesOrderPagingPOJO,
  SalesOrderStatus,
  SalesOrderTimeRange as ISalesOrderTimeRange,
  TimeRangePOJO,
  SalesOrderCustomFieldMappingPOJO
} from "../../public";
import { hideAndFreeze, TimeRange, TimeRangeBase, _internal } from "../common";
import { SalesOrderPaging } from "./sales-order-paging";
import { SalesOrderCustomFieldMapping } from "./sales-order-custom-field-mapping";

export interface SalesOrderTimeRangePOJO extends TimeRangePOJO {	
  paging?: SalesOrderPagingPOJO;	
  statusMappings?: {	
    [key: string]: SalesOrderStatus;	
  };	
  fieldMappings?: SalesOrderCustomFieldMappingPOJO;
}

export class SalesOrderTimeRange extends TimeRangeBase implements ISalesOrderTimeRange {
  public static readonly [_internal] = {
    label: "time range",
    schema: TimeRange[_internal].schema.keys({
      paging: SalesOrderPaging[_internal].schema,
      statusMappings: Joi.object().optional(),
      fieldMappings: Joi.object().optional(),
    })
  };

  // TODO: make this optional because the first request won't always be populated since it needs to 
  // be populated by the app user.
  public readonly paging?: {
    readonly pageSize: number;
    readonly pageNumber?: number;
    readonly pageCount: number;
    readonly cursor?: string;
  };

  public readonly statusMappings?: Readonly<{
    [key: string]: SalesOrderStatus;
  }>;

  public readonly fieldMappings?: Readonly<SalesOrderCustomFieldMapping>;

  public constructor(pojo: SalesOrderTimeRangePOJO) {
    super(pojo);

    if (pojo.paging) {
      this.paging = new SalesOrderPaging(pojo.paging);
    }

    this.statusMappings = pojo.statusMappings;
    this.fieldMappings = pojo.fieldMappings && new SalesOrderCustomFieldMapping(pojo.fieldMappings)

    // Make this object immutable
    hideAndFreeze(this);
  }
}
