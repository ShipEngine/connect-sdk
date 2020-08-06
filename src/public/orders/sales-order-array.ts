import { SalesOrder } from "./sales-order";
import { SalesOrderPagingPOJO } from "./sales-order-time-range";


/**
 * Specifies a date/time range to retrieve sales orders for
 */
export interface SalesOrderArray extends Array<SalesOrder> {
  paging?: SalesOrderPagingPOJO;
}
