import { AppPOJO, FilePath, InlineOrReference, LocalizationDefinition, LocalizationPOJO, LocalizedBrandingPOJO, URLString, UUID } from "../common";
import { GetSalesOrder, GetSalesOrdersByDate, GetSeller, ShipmentCancelled, ShipmentCreated } from "./methods";

/**
 * A ShipEngine Integration Platform order app
 */
export interface OrderAppPOJO extends OrderAppDefinition, AppPOJO {
  localization?: LocalizationPOJO<LocalizedBrandingPOJO>;
  getSeller: GetSeller;
  getSalesOrder: GetSalesOrder;
  getSalesOrdersByDate: GetSalesOrdersByDate;
  shipmentCreated?: ShipmentCreated;
  shipmentCancelled?: ShipmentCancelled;
}


/**
 * A ShipEngine Integration Platform order app
 */
export interface OrderAppDefinition {
  /**
   * A UUID that uniquely identifies the marketplace.
   * This ID should never change, even if the marketplace name changes.
   */
  id: UUID;

  /**
   * The user-friendly marketplace name (e.g. "Ebay", "Shopify")
   */
  name: string;

  /**
   * A short, user-friendly description of the marketplace
   */
  description?: string;

  /**
   * The URL of the marketplace's website
   */
  websiteURL: URLString;

  /**
   * The marketplace's logo image
   */
  logo: FilePath;

  /**
   * Localizaed values for fields that allow localization
   */
  localization?: InlineOrReference<LocalizationDefinition<{
    name?: string;
    description?: string;
    websiteURL?: URLString;
  }>>;

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
