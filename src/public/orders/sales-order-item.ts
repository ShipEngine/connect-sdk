import type { MonetaryValue, Note, Weight } from "../common";
import type { ProductIdentifier } from "../products";
import type { SalesOrderItemIdentifier } from "./sales-order-item-identifier";

/**
 * An item in a sales order
 */
export interface SalesOrderItem extends SalesOrderItemIdentifier {
  /**
   * The user-friendly name of the item. This is often the same as the product name.
   */
  name: string;

  /**
   * A short description of the item. This is often the same as the product summary.
   */
  description: string;

  /**
   * The product associated with this item
   */
  product: ProductIdentifier;

  /**
   * The quantity of this item in the sales order
   */
  quantity: Number;

  /**
   * The sale price of each item. This should NOT include additional charges or adjustments,
   * such as taxes or discounts. Use `charges` for those.
   */
  unitPrice: MonetaryValue;

  /**
   * The total price of this item. This is `unitPrice` multiplied by `quantity`.
   */
  totalPrice: MonetaryValue;

  /**
   * The weight of each item
   */
  unitWeight?: Weight;

  /**
   * The URL of a webpage where the customer can view the order item
   */
  itemURL?: URL;

  /**
   * The URL of a webpage where the customer can view an image of the order item
   */
  thumbnailURL?: URL;

  /**
   * Human-readable information regarding this order item, such as gift notes, backorder notices, etc.
   */
  notes: Array<Note>;

  /**
   * Arbitrary data about this order item that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  metadata: object;
}
