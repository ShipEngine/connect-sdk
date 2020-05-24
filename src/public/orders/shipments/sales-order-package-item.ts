import type { Quantity, QuantityPOJO } from "../../common";
import type { SalesOrderIdentifier, SalesOrderIdentifierPOJO, SalesOrderItemIdentifier, SalesOrderItemIdentifierPOJO } from "../../orders";
import type { ProductIdentifier, ProductIdentifierPOJO } from "../../products";

/**
 * An item inside a package
 */
export interface SalesOrderPackageItemPOJO {
  /**
   * The sales order associated with this item
   */
  salesOrder: SalesOrderIdentifierPOJO;

  /**
   * The sales order item associated with this item
   */
  salesOrderItem: SalesOrderItemIdentifierPOJO;

  /**
   * The product associated with this item
   */
  product?: ProductIdentifierPOJO;

  /**
   * The quantity of this item in the package
   */
  quantity: QuantityPOJO;
}


/**
 * An item inside a package
 */
export interface SalesOrderPackageItem {
  /**
   * The sales order associated with this item
   */
  readonly salesOrder: SalesOrderIdentifier;

  /**
   * The sales order item associated with this item
   */
  readonly salesOrderItem: SalesOrderItemIdentifier;

  /**
   * The product associated with this item
   */
  readonly product?: ProductIdentifier;

  /**
   * The quantity of this item in the package
   */
  readonly quantity: Quantity;
}
