import type { MonetaryValuePOJO, QuantityPOJO, URLString, WeightPOJO } from "../common";
import type { ProductIdentifierPOJO } from "../products";
import type { SalesOrderItemIdentifierPOJO } from "./sales-order-item-identifier";

/**
 * An item in a sales order
 */
export interface SalesOrderItem extends SalesOrderItemIdentifierPOJO {
  /**
   * The user-friendly name of the item. This is often the same as the product name.
   */
  name: string;

  /**
   * A short description of the item. This is often the same as the product summary.
   */
  description?: string;

  /**
   * The product associated with this item
   */
  product: ProductIdentifierPOJO;

  /**
   * The quantity of this item in the sales order
   */
  quantity: QuantityPOJO;

  /**
   * The sale price of each item. This should NOT include additional charges or adjustments,
   * such as taxes or discounts. Use `charges` for those.
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
   * The URL of a webpage where the customer can view an image of the order item
   */
  thumbnailURL?: URLString | URL;

  /**
   * The location the product can be found in a warehouse
   */
  location?: string;
}
