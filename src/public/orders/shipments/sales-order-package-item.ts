import type { SalesOrderIdentifier, SalesOrderItemIdentifier } from "../../orders";
import type { ProductIdentifier } from "../../products";

/**
 * An item inside a package
 */
export interface SalesOrderPackageItem {
  /**
   * The sales order associated with this item
   */
  salesOrder: SalesOrderIdentifier;

  /**
   * The sales order item associated with this item
   */
  salesOrderItem: SalesOrderItemIdentifier;

  /**
   * The product associated with this item
   */
  product?: ProductIdentifier;

  /**
   * The quantity of this item in the package
   */
  quantity: Number;
}
