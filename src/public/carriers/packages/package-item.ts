import type { Identifiers, MonetaryValue } from "../../common";
import type { SalesOrderIdentifier, SalesOrderItemIdentifier } from "../../orders";
import type { ProductIdentifier } from "../../products";

/**
 * An item inside a package
 */
export interface PackageItem {
  /**
   * The Stock Keeping Unit code
   */
  sku: string;

  /**
   * Your own identifiers for this item
   */
  identifiers: Identifiers;

  /**
   * The sales order associated with this item
   */
  salesOrder?: SalesOrderIdentifier;

  /**
   * The sales order item associated with this item
   */
  salesOrderItem?: SalesOrderItemIdentifier;

  /**
   * The product associated with this item
   */
  product?: ProductIdentifier;

  /**
   * The quantity of this item in the package
   */
  quantity: Number;

  /**
   * The sale price of each item
   */
  unitPrice: MonetaryValue;

  /**
   * The total price of this item. This is `unitPrice` multiplied by `quantity`.
   */
  totalPrice: MonetaryValue;
}
