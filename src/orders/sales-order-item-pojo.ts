import { ChargePOJO, MonetaryValuePOJO, NotePOJO, QuantityPOJO, URLString, WeightPOJO } from "../common";
import { ProductIdentifierPOJO } from "../products";
import { FulfillmentStatus } from "./enums";
import { SalesOrderItemIdentifierPOJO } from "./sales-order-item-identifier";
import { ShippingPreferencesPOJO } from "./shipping-preferences";

/**
 * An item in a sales order
 */
export interface SalesOrderItemPOJO extends SalesOrderItemIdentifierPOJO {
  /**
   * The user-friendly name of the item. This is often the same as the product name.
   */
  name: string;

  /**
   * A short description of the item. This is often the same as the product summary.
   */
  description?: string;

  /**
   * Indicates whether the order item has been fulfilled
   */
  fulfillmentStatus?: FulfillmentStatus;

  /**
   * The product associated with this item
   */
  product?: ProductIdentifierPOJO;

  /**
   * The quantity of this item in the sales order
   */
  quantity: QuantityPOJO;

  /**
   * The sale price of each item
   */
  unitPrice: MonetaryValuePOJO;

  /**
   * The weight of each item
   */
  unitWeight?: WeightPOJO;

  /**
   * The URL of a webpage where the customer can view the order item
   */
  itemURL?: URLString | URL;

  /**
   * The URL of a webpage where the customer can track the package
   */
  trackingURL?: URLString | URL;

  /**
   * Preferences on how this item should be shipped
   */
  shippingPreferences?: ShippingPreferencesPOJO;

  /**
   * The breakdown of charges for this order item
   */
  charges?: ReadonlyArray<ChargePOJO>;

  /**
   * Human-readable information regarding this order item, such as gift notes, backorder notices, etc.
   */
  notes?: string | ReadonlyArray<string | NotePOJO>;

  /**
   * Arbitrary data about this order item that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  metadata?: object;
}
