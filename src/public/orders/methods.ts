import type { Transaction } from "../common";
import { SalesOrders } from "./sales-orders";
import { SalesOrderShipment } from "./shipments/sales-order-shipment";
import { SalesOrderNotification } from "./sales-order-notification";
import { AcknowledgedSalesOrder } from "./acknowledged-sales-order";
import { SalesOrderTimeRange } from "./sales-order-time-range";

/**
 * Returns all orders that were created and/or modified within a given timeframe
 */
export type GetSalesOrdersByDate = (transaction: Transaction, range: SalesOrderTimeRange)
=> SalesOrders | Promise<SalesOrders>;

/**
 * Called when a shipment is created for one or more items in one or more sales orders.
 *
 * A single shipment may contain items from multiple sales orders, and a single sales order
 * may be fulfilled by multiple shipments.
 */
export type ShipmentCreated = (transaction: Transaction, shipment: SalesOrderShipment)
=> void | Promise<void>;


/**
 * Called when an order has been imported into a marketplace.
 */
export type AcknowledgeOrders = (transaction: Transaction, notifications: SalesOrderNotification[])
=> AcknowledgedSalesOrder[] | Promise<AcknowledgedSalesOrder[]>;
