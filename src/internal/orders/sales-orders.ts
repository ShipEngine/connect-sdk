import { SalesOrders as SalesOrdersPOJO } from "../../public";
import { hideAndFreeze, Joi, _internal, validate } from "../common";
import { SalesOrderPaging } from "./sales-order-paging";
import { SalesOrder } from "./sales-order";

export class SalesOrders {
  // TODO: Add better validation and unit tests
  public static readonly [_internal] = {
    label: "sales orders",
    schema: Joi.object({
      paging: SalesOrderPaging[_internal].schema,
      salesOrders: Joi.array().items(SalesOrder[_internal].schema).required()
    })
  };

  public readonly paging?: SalesOrderPaging;
  public readonly salesOrders?: SalesOrder[];

  public constructor(pojo: SalesOrdersPOJO) {
    this.paging = pojo.paging ? new SalesOrderPaging(pojo.paging) : undefined;
    this.salesOrders = []

    for (const salesOrder of pojo.salesOrders) {

      if(process.env.CONNECT_ENV === "production") {
        this.salesOrders.push(new SalesOrder(salesOrder));
      }
      else {
        this.salesOrders.push(new SalesOrder(validate(salesOrder, SalesOrder)));
      }
    }


    // Make this object immutable
    hideAndFreeze(this);
  }
}
