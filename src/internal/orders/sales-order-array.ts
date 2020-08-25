import { SalesOrderArray as SalesOrderArrayPOJO } from "../../public";
import { hideAndFreeze, Joi, _internal, validate } from "../common";
import { SalesOrderPaging } from "./sales-order-paging";
import { SalesOrder } from "./sales-order";

export class SalesOrderArray extends Array {
  // TODO: Add better validation and unit tests
  public static readonly [_internal] = {
    label: "sales order array",
    schema: Joi.array()
  };

  public readonly paging?: SalesOrderPaging;

  public constructor(salesOrders: SalesOrderArrayPOJO) {
    super();

    if(salesOrders) {
      this.paging = salesOrders.paging ? new SalesOrderPaging(salesOrders.paging) : undefined;
    }

    for (const salesOrder of salesOrders) {
      this.push(new SalesOrder(validate(salesOrder, SalesOrder)));
    }

    // Make this object immutable
    hideAndFreeze(this);
  }
}
