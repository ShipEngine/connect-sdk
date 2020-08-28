import { SalesOrder } from "./sales-order";
import { SalesOrderPagingPOJO } from "./sales-order-time-range";


/**
 * Specifies a date/time range to retrieve sales orders for
 */
export interface SalesOrders {
  paging?: SalesOrderPagingPOJO;

  salesOrders: SalesOrder[]
}
