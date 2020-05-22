import { Connect, FormPOJO, InlineOrReference, LocalizationPOJO, LocalizedBrandingPOJO } from "../common";
import { AppPOJO, ConnectionAppDefinition } from "../common/internal";
import { GetSalesOrder, GetSalesOrdersByDate, GetSeller, ShipmentCancelled, ShipmentCreated } from "./methods";

/**
 * A ShipEngine Integration Platform order app
 */
export interface OrderAppPOJO extends OrderAppDefinition, AppPOJO {
  connectionForm: FormPOJO;
  settingsForm?: FormPOJO;
  localization?: LocalizationPOJO<LocalizedBrandingPOJO>;
  connect: Connect;
  getSeller: GetSeller;
  getSalesOrder: GetSalesOrder;
  getSalesOrdersByDate: GetSalesOrdersByDate;
  shipmentCreated?: ShipmentCreated;
  shipmentCancelled?: ShipmentCancelled;
}


/**
 * A ShipEngine Integration Platform order app
 */
export interface OrderAppDefinition extends ConnectionAppDefinition {
  /**
   * Returns detailed information about a seller on the marketplace
   */
  getSeller: InlineOrReference<GetSeller>;

  /**
   * Returns a specific sales order
   */
  getSalesOrder: InlineOrReference<GetSalesOrder>;

  /**
   * Returns all orders that were created and/or modified within a given timeframe
   */
  getSalesOrdersByDate: InlineOrReference<GetSalesOrdersByDate>;

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
