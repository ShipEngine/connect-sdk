import { SalesOrderTimeRange } from ".";
import { SalesOrderStatus } from "./enums";

/**
 * Specifies the request for getting sales orders.
 */
export interface GetSalesOrdersByDateRequest extends SalesOrderTimeRange {
    /**
     * A customer specified desired mapping for status codes.
     */
    salesOrderStatusMapping?: SalesOrderStatusMapping;
}

export interface SalesOrderStatusMapping {
    /**
     * The raw status string used by the order source.
     */
    source_status: string;
    /**
     * The sales order status. Values: 'AwaitingPayment',
     * 'AwaitingShipment', 'Cancelled', 'Completed', 'OnHold',
     * 'PendingFulfillment'
    */
    maps_to: SalesOrderStatus;
}
