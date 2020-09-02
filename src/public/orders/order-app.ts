import type { ConnectionAppDefinition, InlineOrReference } from "../common";
import type { GetSalesOrdersByDate, ShipmentCreated, AcknowledgeOrders } from "./methods";


/**
 * A ShipEngine Connect order app
 */
export interface OrderAppDefinition extends ConnectionAppDefinition {
  /**
   * Returns all orders that were created and/or modified within a given timeframe
   */
  getSalesOrdersByDate?: InlineOrReference<GetSalesOrdersByDate>;

  /**
   * Called when a shipment is created for one or more items in one or more sales orders.
   *
   * A single shipment may contain items from multiple sales orders, and a single sales order
   * may be fulfilled by multiple shipments.
   */
  shipmentCreated?: InlineOrReference<ShipmentCreated>;

  /**
   * Called when an order has been imported into a marketplace.
   */
  acknowledgeOrders?: InlineOrReference<AcknowledgeOrders>;

  /**
   * Indicates whether to allow emails to be sent to customers with shipping or order updates
   */
  sendMail?: boolean;

  /**
   * Indicates to show time zone related settings to the user.
   */
  canConfigureTimeZone?: boolean;
}
