import { SalesOrderArray as ISalesOrderArray, SalesOrderArrayPOJO, SalesOrderPaging } from "../../../definitions";
import { hideAndFreeze, Joi, _internal } from "../../common";

export class SalesOrderArray extends Array implements ISalesOrderArray {
  // TODO: Add better validation and unit tests
  public static readonly [_internal] = {
    label: "sales order array",
    schema: Joi.array()
  };

  public readonly paging: SalesOrderPaging;

  public constructor(pojo: SalesOrderArrayPOJO) {
    super();
    this.paging = pojo.paging;

    // Make this object immutable
    hideAndFreeze(this);
  }
}
