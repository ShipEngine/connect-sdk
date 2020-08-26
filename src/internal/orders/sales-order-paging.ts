import { hideAndFreeze, Joi, _internal } from "../common";
import { SalesOrderPagingPOJO } from "../../public";

export class SalesOrderPaging {
  // TODO: Add better validation and unit tests
  public static readonly [_internal] = {
    label: "sales order paging",
    schema: Joi.object({
      pageSize: Joi.number().required(),
      pageNumber: Joi.number(),
      pageCount: Joi.number().required(),
      cursor: Joi.string()
    })
  };

  public readonly pageSize: number;
  public readonly pageNumber?: number;
  public readonly pageCount: number;
  public readonly cursor?: string;

  public constructor(pojo: SalesOrderPagingPOJO) {
    this.pageSize = pojo.pageSize || 0;
    this.pageNumber = pojo.pageNumber || 0;
    this.pageCount = pojo.pageCount || 0;
    this.cursor = pojo.cursor || "";
    
    // Make this object immutable
    hideAndFreeze(this);
  }
}
