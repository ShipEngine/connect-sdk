import type { Identifiers, MonetaryValue, Quantity } from "../../common";
import type { SalesOrderIdentifier, SalesOrderItemIdentifier } from "../../orders";
import type { ProductIdentifier } from "../../products";


/**
 * An item inside a package
 */
export interface PackageItem {
  /**
   * The Stock Keeping Unit code
   */
  readonly sku: string;

  /**
   * Your own identifiers for this item
   */
  readonly identifiers: Identifiers;

  /**
   * The sales order associated with this item
   */
  readonly salesOrder?: SalesOrderIdentifier;

  /**
   * The sales order item associated with this item
   */
  readonly salesOrderItem?: SalesOrderItemIdentifier;

  /**
   * The product associated with this item
   */
  readonly product?: ProductIdentifier;

  /**
   * The quantity of this item in the package
   */
  readonly quantity?: Quantity;

  /**
   * The sale price of each item
   */
  readonly unitPrice?: MonetaryValue;

  /**
   * The total price of this item. This is `unitPrice` multiplied by `quantity`.
   */
  readonly totalPrice?: MonetaryValue;
}
