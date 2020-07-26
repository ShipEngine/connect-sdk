import { SalesOrder, SalesOrderPOJO } from "./sales-order";
import { SalesOrderPaging } from "./sales-order-time-range";


/**
 * Specifies a date/time range to retrieve sales orders for
 */
export interface SalesOrderArrayPOJO extends Array<SalesOrderPOJO> {
  paging: SalesOrderPaging;
}

/**
 * Specifies a date/time range to retrieve sales orders for
 */
export interface SalesOrderArray extends Array<SalesOrder> {
  paging: SalesOrderPaging;
}
