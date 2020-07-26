import type { AppPOJO, Connect, ConnectionApp, ConnectionAppDefinition, FormPOJO, InlineOrReference, TransactionPOJO } from "../common";
import type { GetSalesOrdersByDate, ShipmentCancelled, ShipmentCreated } from "./methods";
import type { SalesOrder } from "./sales-order";
import type { SalesOrderTimeRangePOJO } from "./sales-order-time-range";
import { SalesOrderShipmentPOJO } from "./shipments/sales-order-shipment";


/**
 * A ShipEngine Integration Platform order app
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
   * Called when a shipment is cancelled for one or more items in one or more sales orders.
   *
   * A single shipment may contain items from multiple sales orders, and a single sales order
   * may be fulfilled by multiple shipments.
   */
  shipmentCancelled?: InlineOrReference<ShipmentCancelled>;
}


/**
 * A ShipEngine Integration Platform order app
 */
export interface OrderAppPOJO extends OrderAppDefinition, AppPOJO {
  connectionForm: FormPOJO;
  settingsForm?: FormPOJO;
  connect?: Connect;
  getSalesOrdersByDate?: GetSalesOrdersByDate;
  shipmentCreated?: ShipmentCreated;
  shipmentCancelled?: ShipmentCancelled;
}


/**
 * A ShipEngine Integration Platform order app
 */
export interface OrderApp extends ConnectionApp {
  /**
   * Returns all orders that were created and/or modified within a given timeframe
   */
  getSalesOrdersByDate?(
    transaction: TransactionPOJO, range: SalesOrderTimeRangePOJO): AsyncGenerator<SalesOrder>;

  /**
   * Called when a shipment is created for one or more items in one or more sales orders.
   *
   * A single shipment may contain items from multiple sales orders, and a single sales order
   * may be fulfilled by multiple shipments.
   */
  shipmentCreated?(transaction: TransactionPOJO, shipment: SalesOrderShipmentPOJO): Promise<void>;

  /**
   * Called when a shipment is cancelled for one or more items in one or more sales orders.
   *
   * A single shipment may contain items from multiple sales orders, and a single sales order
   * may be fulfilled by multiple shipments.
   */
  shipmentCancelled?(transaction: TransactionPOJO, shipment: SalesOrderShipmentPOJO): Promise<void>;
}
