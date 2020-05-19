import { Transaction } from "../common";
import { SellerPOJO } from "./sellers/seller";
import { SellerIdentifier } from "./sellers/seller-identifier";

/**
 * Returns detailed information about a seller on the marketplace
 */
export type GetSeller = (transaction: Transaction, seller: SellerIdentifier)
  => SellerPOJO | Promise<SellerPOJO>;


/**
 * Returns a specific sales order
 */
export type GetSalesOrder = (transaction: Transaction)
  => void | Promise<void>;


/**
 * Returns all orders that were created and/or modified within a given timeframe
 */
export type GetSalesOrdersByDate = (transaction: Transaction)
  => void | Promise<void>;


/**
 * Called when a shipment is created for one or more items in one or more sales orders.
 *
 * A single shipment may contain items from multiple sales orders, and a single sales order
 * may be fulfilled by multiple shipments.
 */
export type ShipmentCreated = (transaction: Transaction)
  => void | Promise<void>;


/**
 * Called when a shipment is cancelled for one or more items in one or more sales orders.
 *
 * A single shipment may contain items from multiple sales orders, and a single sales order
 * may be fulfilled by multiple shipments.
 */
export type ShipmentCancelled = (transaction: Transaction)
  => void | Promise<void>;
