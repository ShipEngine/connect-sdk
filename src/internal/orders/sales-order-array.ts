import { SalesOrderArray as SalesOrderArrayPOJO, SalesOrderPaging } from "../../public";
import { hideAndFreeze, Joi, _internal } from "../common";

export class SalesOrderArray extends Array {
  // TODO: Add better validation and unit tests
  public static readonly [_internal] = {
    label: "sales order array",
    schema: Joi.array()
  };

  public readonly paging: SalesOrderPaging;

  public constructor(pojo: SalesOrderArrayPOJO) {
    super();

    this.paging = {
      ...pojo.paging,
      pageNumber: 1,
      pageCount: 1,
      pageSize: this.length,
    };

    // Make this object immutable
    hideAndFreeze(this);
  }
}
