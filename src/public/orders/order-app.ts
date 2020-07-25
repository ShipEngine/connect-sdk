import type { AppPOJO, Connect, ConnectionApp, ConnectionAppDefinition, FormPOJO, InlineOrReference, TransactionPOJO } from "../common";
import type { GetSalesOrder, GetSalesOrdersByDate, GetSeller, ShipmentCancelled, ShipmentCreated } from "./methods";
import type { SalesOrder } from "./sales-order";
import type { SalesOrderIdentifierPOJO } from "./sales-order-identifier";
import type { SalesOrderTimeRangePOJO } from "./sales-order-time-range";
import type { Seller } from "./sellers/seller";
import type { SellerIdentifierPOJO } from "./sellers/seller-identifier";
import { SalesOrderShipmentPOJO } from "./shipments/sales-order-shipment";


/**
 * A ShipEngine Integration Platform order app
 */
export interface OrderAppDefinition extends ConnectionAppDefinition {
  /**
   * Returns detailed information about a seller on the marketplace
   */
  getSeller?: InlineOrReference<GetSeller>;

  /**
   * Returns a specific sales order
   */
  getSalesOrder?: InlineOrReference<GetSalesOrder>;

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
  getSeller?: GetSeller;
  getSalesOrder?: GetSalesOrder;
  getSalesOrdersByDate?: GetSalesOrdersByDate;
  shipmentCreated?: ShipmentCreated;
  shipmentCancelled?: ShipmentCancelled;
}


/**
 * A ShipEngine Integration Platform order app
 */
export interface OrderApp extends ConnectionApp {
  /**
   * Returns detailed information about a seller
   */
  getSeller?(transaction: TransactionPOJO, id: SellerIdentifierPOJO): Promise<Seller>;

  /**
   * Returns a specific sales order
   */
  getSalesOrder?(transaction: TransactionPOJO, id: SalesOrderIdentifierPOJO): Promise<SalesOrder>;

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
